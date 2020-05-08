<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    if (this._isMobile()) {
      this.$router.push('/m')
    } else {
      this.$router.push('/')
    }
  },

  methods: {
    // 判断PC Or 手机
    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
  }
}
</script>

<style>
* {
  font-family: "Microsoft YaHei";
  margin: 0;
  padding: 0;
  font-size: 12px;
  line-height: 12px;
}
</style>