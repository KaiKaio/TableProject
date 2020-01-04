import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import M from '../views/PhoneSmall.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/m',
    name: 'm',
    component: M
  },
]

const router = new VueRouter({
  routes
})

export default router
