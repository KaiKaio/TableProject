import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/m',
    name: 'm',
    component: () => import('@/views/PhoneSmall.vue')
  },
]



const router = new VueRouter({
  mode: 'hash',
  routes,
})

//注册一个全局前置守卫,确保要调用 next 方法，否则钩子就不会被 resolved

let flag = false

router.beforeEach((to, from, next) => {
  if(to.query.font && flag === false) {
    store.state.queryFont = to.query.font
    flag = true
  } else {
    next()
  }

  next()
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


export default router
