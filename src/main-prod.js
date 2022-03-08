import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入icon图标
import "./assets/fonts/iconfont.css";
import "./assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// 导入Nprogress中的js和css
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// 导入axios
import axios from "axios";
// 设置根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 添加请求拦截器
// 在request拦截器中，显示进度条：Nprogress.start()
axios.interceptors.request.use((config) => {
    console.log(config);
    // 为请求头添加token
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});

// 在response拦截器中，隐藏进度条：Nprogress.done()
axios.interceptors.response.use((config) => {
    NProgress.done();
    return config;
});

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);
// 注册富文本编辑器
Vue.use(VueQuillEditor);

Vue.filter("dateFormat", function(originVal) {
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + "").padStart(2, "0");
    const d = (dt.getDate() + "").padStart(2, "0");
    const hh = (dt.getHours() + "").padStart(2, "0");
    const mm = (dt.getMinutes() + "").padStart(2, "0");
    const ss = (dt.getSeconds() + "").padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");