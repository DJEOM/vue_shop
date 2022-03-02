<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <!-- 左侧 -->
            <div class="left">
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <!-- 右侧 -->
        <el-button type="info" @click="logout">退出</el-button>
        </el-header>

        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 侧边菜单栏 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eef" unique-opened :collapse="isCollapse" collapse-transition>
                    <!-- 一级菜单 -->
                    <el-submenu :index="value.id + ''" v-for="value in menulist" :key="value.id">
                        <!-- 一级菜单模板 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[value.id]"></i>
                            <!-- 文本 -->
                            <span>{{value.authName}}</span>
                        </template>

                            <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.id + '' " v-for="subItem in value.children" :key="subItem.id">
                               <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>


                        <!-- 内容主体 -->
                        <el-main>Main</el-main>
                    </el-container>
    </el-container>
</template>

<script>
    export default {
        // 将获取的菜单挂载到页面上
        data() {
            return {
                // 左侧菜单数据
                menulist: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao',
                },
                // 不折叠
                isCollapse: false
            }
        },
        created () {
            this.getMenuList();
        },
        methods: {
            // 退出按钮的点击事件
            logout() {
                // 1.清空token
                window.sessionStorage.clear()
                // 2.跳转到登录页
                this.$router.push('/login')
            },
            // 获取所有菜单
            async getMenuList(){
                const {data:res} = await this.$http.get('menus')
                if(res.meta.status !== 200) return this.$message.error('res.meta.msg')
                // 状态码正确 将数据传给左侧菜单栏
                this.menulist = res.data
                console.log(res)
            },
            // 点击按钮，切换菜单的折叠与展开
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            }

            
        },
    }
</script>

<style lang="scss" scoped>
.home-container {
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    .left{
       display: flex;
       align-items: center;
       img {
           margin-right: 15px;
       }
    }
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>