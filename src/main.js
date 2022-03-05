import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入icon图标
import "./assets/fonts/iconfont.css";
import "./assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";

// 导入axios
import axios from "axios";
// 设置根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 添加请求拦截器
axios.interceptors.request.use((config) => {
    console.log(config);
    // 为请求头添加token
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);
new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");