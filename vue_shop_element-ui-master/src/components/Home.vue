<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 根据是否展开动态设置侧边栏宽度-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-botton" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域  router 开启路由模式-->
        <el-menu
          background-color="#333743"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-openeds="openeds"
          router
          :default-active="activePath"
        >
          <!-- unique-opened默认true，实现手风琴效果 -->
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本  一级菜单的名称-->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- :index="subItem.path + ''" 不拼接 / 也可以调整？-->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期函数，一加载的时候就要立即获取左侧菜单
  created() {
    this.getMenuList()
    // 组件被创建的时候，直接动态赋值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 开发规范 你以后请求到的数据 一定要在data给一个初始值 赋值给data里面的变量
      // 左侧菜单数据
      menulist: [],
      openeds: ['1'],
      // 图标对象-制定具体类名iconfont
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    logout() {
      // 清空token clear()删除所有的缓存里面的东西 要慎用 只有退出的时候才用clear 其他地方统一用单个删除
      window.sessionStorage.clear()
      //   重定向，跳转到登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单 get返回的是一个promise 使用await简化
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        // 获取数据失败（错误消息--保存在meta中）
        return this.$message.error(res.meta.msg)
      }
      // 获取数据成功
      console.log(res.data, 1111111111)
      this.menulist = res.data
    },
    toggleCollapse() {
      // 点击按钮切换菜单的折叠与展开
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      // 保存链接的激活状态
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  // 按钮居中-align-items属性定义项目在交叉轴
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-botton {
  //点击按钮条 下面可以折叠上去
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
