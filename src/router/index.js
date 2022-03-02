import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    // 设置默认路径为登录页
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: Login,
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个页面跳转而来
  // next 放行
  // 如果是登录页，放行
  if (to.path === "/login") return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token");
  // 如果没有获取到token，则返回登录页
  if (!tokenStr) return next("/login");
  next();
});
export default router;
