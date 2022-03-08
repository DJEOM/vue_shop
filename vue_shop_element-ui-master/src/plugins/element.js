import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// // 导入弹框提示组件
// import { Message } from 'element-ui'
import { Button, Message, Form, FormItem, Input, Container, Header, Aside, Main, MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 需要全局挂载-->vue的原型对象上 每一个组件都可以使用this
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
