import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  // 在路由中放子路由对象，访问home重定向到welcome
  {
    path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, { path: '/rights', component: Rights }, { path: '/roles', component: Roles }, { path: '/categories', component: Cate }, { path: '/params', component: Params }, { path: '/goods', component: GoodsList }, { path: '/goods/add', component: Add }, { path: '/orders', component: Order }, { path: '/reports', component: Report }]
  }
]

const router = new VueRouter({
  routes
})

// 挂载一个导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问哪个路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行  next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取token 对其进行判断
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token 强制跳转到登录界面
  if (!tokenStr) return next('/login')
  // 存在就直接放行
  next()
})

export default router