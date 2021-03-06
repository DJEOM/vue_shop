<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!--表格区域  -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opera" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCateInfo(scope.row.id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 15, 25, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加表单对话框 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRoles"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类: ">
          <!-- 下拉菜单 options用于指定数据源  props--配置对象-->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <!-- 编辑内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editCateFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称">
          <el-input v-model="editForm.cat_name" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件  
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表
      cateList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前列的模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前列的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 将当前列定义为模板列
          type: "template",
          // 表示当前列的模板名称
          template: "opera",
        },
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: "",
        cat_id: 0,
        cat_level: 0,
      },
      // 添加分类表单的验证规则
      addCateFormRoles: {
        cat_pid: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的数据对象
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      editForm: {
        cat_name: ''
      },
      editDialogVisible: false,
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      //   console.log(res.data);
      // 数据列表赋值
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 监听pagesize的变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 添加分类对话框弹出前，先获取父级分类列表数据
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败!");
      }
      console.log(res.data);
      this.parentCateList = res.data;
    },
    // 选择级联列表发生改变时触发的函数
    parentCateChanged() {
      console.log(this.selectedKeys);
      //   如果selectedKeys数组中的length大于0,说明选中了父级分类
      if (this.selectedKeys.length > 0) {
        //  父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        //  为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //   父级分类的id
        this.addCateForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮,添加新的分类
    addCate() {
      //   console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 监听修改分类对话框的关闭事件
    async showEditDialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get("categories", {params: {id: 'cat_id'}});
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      console.log(res.data);
      this.editForm = res.data[0]
      this.editDialogVisible = true;
    },
    // 监听修改分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定修改分类
    editCateInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起修改分类信息的数据请求
        const { data: res } = await this.$http.put(
          "categories/" + this.editForm.cat_pid,
          {
            cat_name: this.editForm.cat_name,
            cat_level: this.editForm.cat_level,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改分类信息失败");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getCateList();
        // 提示修改成功
        this.$message.success("更新分类信息成功");
      });
    },

    // 根据id删除对应的分类信息
    async removeCateInfo(id) {
      console.log(id);
      // 弹框提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        // 取消删除，返回为cancel
        .catch((err) => err);
      // console.log(confirmResult);
      // 判断是否取消
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除!");
      }

      // 发起请求，完成删除分类操作
      const { data: res } = await this.$http.delete("categories" + 'id');
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败!");
      }
      this.$message.success("删除分类成功!");
      // 更新分类数据列表
      this.getCateList();
    },

    //监听对话框的关闭事件,重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>