import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(contentmenu)

import axios from 'axios'
const service = axios.create({ 
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'http://www.dooor.cn/api',
});
Vue.prototype.$axios = service

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
