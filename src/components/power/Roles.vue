<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdBottom', in1 == 0 ? 'bdTop' : '', 'vcenter']"
              v-for="(item1, in1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[in2 == 0 ? '' : 'bdTop', 'vcenter']"
                  v-for="(item2, in2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, in3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表
      rolesList: [],
      // 默认隐藏对话框
      setRightVisible: false,
      //   所有权限的数据
      rightslist: [],
      //   树形控件中的数据
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中的节点ID值数组
      defKeys: [105, 116],
      roleId: '',
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },

    // 删除对应权限
    async removeRight(role, rightId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
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
      // 发起请求，完成删除操作
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败!");
      }
      this.$message.success("删除权限成功!");

      // 重新赋值给权限列表, 防止列表刷新
      role.children = res.data;
    },

    // 分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限列表
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败!");
      }
      this.rightslist = res.data;
      //   console.log(this.rightslist);
      // 获取三级节点的id
      this.getLeafKeys(role, this.defKeys);

      //   弹出对话框
      this.setRightVisible = true;
    },

    // 获取三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 当前节点不包含children属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      //通过递归获取,获取所有三级权限的id
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        ` roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败!");
      }
      this.$message.success("分配权限成功!");
      this.getRolesList();
      this.setRightVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
  // font-size: 14px;
}
.bdTop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>