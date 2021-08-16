import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'

// 樣式重置
import "reset-css";

//導入全局樣式
import './styles.scss'
import http from './assets/js/http.js'  // 整理 axios 方法
Vue.prototype.$http = http;
Vue.prototype.$moment = moment;

// 引入根组件mixins
import mixins from './mixins/root.js'
Vue.use(ElementUI);

Vue.config.productionTip = false;

// var isAuthenticated = true;



new Vue({
  mixins: [mixins],
  router,
  store,
  render: h => h(App)
}).$mount('#app')













