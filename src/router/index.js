import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import User from "../components/user/User.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";
import List from "../components/goods/List.vue";
import Add from "../components/goods/Add.vue";
import Order from "../components/order/Order.vue";
Vue.use(VueRouter);

const routes = [{
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
        component: Home,
        redirect: "/welcome",
        children: [{
                path: "/welcome",
                component: Welcome,
            },
            {
                path: "/users",
                component: User,
            },
            {
                path: "/rights",
                component: Rights,
            },
            {
                path: "/roles",
                component: Roles,
            },
            {
                path: "/categories",
                component: Cate,
            },
            {
                path: "/params",
                component: Params,
            },
            {
                path: "/goods",
                component: List,
            },
            {
                path: "/goods/add",
                component: Add,
            },
            {
                path: "/orders",
                component: Order,
            },
        ],
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