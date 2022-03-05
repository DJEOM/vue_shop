<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!--表格区域  -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: lightgreen"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opera" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateFormVisible"
        width="50%"
        >
        <!-- 添加表单对话框 -->
            <el-form :model="addCateForm" :rules="addCateFormRoles" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <!-- 父级分类 -->
                <el-form-item label="父级分类" placeholder="请选择">
                    <!-- 下拉菜单 options用于指定数据源  props--配置对象-->
                    <el-cascader
                    expand-trigger="hover"
                    v-model="selectedKeys"
                    :options="parentCateList"
                    :props="cascaderProps"
                    @change="parentCateChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateFormVisible = false">确 定</el-button>
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
                    pagesize: 5
                },
                // 商品分类的数据列表
                cateList:  [],
                // 总数据条数
                total: 0,
                // 为table指定列的定义
                columns: [
                    {
                    label: '分类名称',
                    prop: 'cat_name',
                    },
                    {
                    label: '是否有效',
                    // 将当前列定义为模板列
                    type: 'template',
                    // 表示当前列的模板名称
                    template: 'isok'
                    },
                    {
                    label: '排序',
                    // 将当前列定义为模板列
                    type: 'template',
                    // 表示当前列的模板名称
                    template: 'order'
                    },
                     {
                    label: '操作',
                    // 将当前列定义为模板列
                    type: 'template',
                    // 表示当前列的模板名称
                    template: 'opera'
                    }
                ],
                // 控制添加分类对话框的显示与隐藏
                addCateFormVisible: false,
                // 添加分类的表单数据对象
                addCateForm: {
                    cat_name: '',
                    cat_id: 0,
                    cat_level : 0
                },
                // 添加分类表单的验证规则
                addCateFormRoles: {
                    cat_name: [
                        { required: true, message: "请输入分类名称", trigger: "blur" },
                    ]
                },
                // 父级分类的数据对象
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 选中的父级分类的id数组
                selectedKeys: []
                    
                
            }
        },
        created () {
            this.getCateList();
        },
        methods: {
            async getCateList() {
              const {data:res} = await this.$http.get('categories', { params: this.queryInfo})
              if(res.meta.status !== 200){
                  return this.$message.error('获取商品分类失败')
              }
            //   console.log(res.data);
            // 数据列表赋值
            this.cateList = res.data.result
            this.total = res.data.total
            },
            // 监听pagesize的变化
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            // 监听pagenum的变化
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getCateList()
            },
            // 点击按钮，展示添加分类的对话框
            showAddCateDialog(){
                // 添加分类对话框弹出前，先获取父级分类列表数据
                this.getParentCateList()
                this.addCateFormVisible = true
            },
            // 获取父级分类的数据列表
            async getParentCateList(){
                const {data:res} = await this.$http.get('categories', {params: {type:2}})
                if(res.meta.status !== 200) {
                    return this.$message.error('获取父级分类数据失败!')
                }
                console.log(res.data);
                this.parentCateList = res.data
            },
            // 选择级联列表发生改变时触发的函数
            parentCateChange(){
                console.log(this.selectedKeys);
            }
        },
    }
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
}
.el-cascader {
    width: 100px;
}
</style>