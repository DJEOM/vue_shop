
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!--  表单区域-->
      <el-form ref="loginRef" :model="LoginForm" :rules="loginRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单绑定数据对象
      LoginForm:{
        username: 'admin',
        password: '123456'
      },
      // 登录表单验证规则
      loginRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置方法
    resetLoginRef() {
      this.$refs.loginRef.resetFields()
    },
    // 登录校验方法
    login() {
      this.$refs.loginRef.validate(async val=>{
        if(!val) return;
        // 获取数据data
        const {data:res} = await this.$http.post('login', this.LoginForm)
        if(res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('登录成功!')
        // 1.将登录成功后的token 保存到客户端的 sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 1.1项目中除了登录意外的其他API接口，必须登录后才能访问
        // 1.2 token只在当前网页打开期间生效
        // 2.通过编程式导航跳转到后台主页
        this.$router.push('/home')
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #fff;
    border-radius: 3px;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .btn {
    display: flex;
    justify-content: end;
  }
}
</style>