// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui'
import {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// Vue.use(Message)
Vue.prototype.$Message = Message

var axios = require('axios')
// axios.defaults.baseURL = 'http://192.168.227.136:8001'
// axios.defaults.baseURL = localStorage.address
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
// Vue.use(request)

/*
用动态路由，判断用户是否登录跳转登录页面还是主页面，判断管理员权限，判断页面是否存在，不存在跳转404页面，
beforeEach函数有三个参数：
to:router即将进入的路由对象
from:当前导航即将离开的路由
next:Function,进行管道中的一个钩子，如果执行完了，则导航的状态就是 confirmed （确认的）；否则为false，终止导航。
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.address && store.state.isLogin) {
      next()
    } else {
      next({
        path: '/config',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
