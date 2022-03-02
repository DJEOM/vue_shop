<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
    export default {
        methods: {
            // 退出按钮的点击事件
            logout() {
                // 1.清空token
                window.sessionStorage.clear()
                // 2.跳转到登录页
                this.$router.push('/login')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>