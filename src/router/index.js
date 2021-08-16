import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'
import { setLocal } from '_util/utils.js'
import { getUserInfo } from "@/api"
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login.vue'),
  },
  {
    path: "/domain",
    name: "domain",
    component: () => import(/* webpackChunkName: "domain" */ '@/views/Domain/Domain.vue'),
    children: [
      {
        path: "home",
        name: "Home",  // 首页
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home/Home.vue'),
      },
      {
        path: "adRank",
        name: "AdRank", // 域名排行榜
        component: () => import(/* webpackChunkName: "adRank" */ '@/views/AdRank/AdRank.vue'),
      },
      {
        path: "dashboard",
        name: "dashboard", // 广告排行榜
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/dashboard.vue'),
      },
      {
        path: "domainRank",
        name: "DomainRank",  // 设定关键字
        component: () => import(/* webpackChunkName: "domainRank" */ '@/views/DomainRank/DomainRank.vue'),
      },
      {
        path: "settings",
        name: "Settings", //管理
        component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings/Settings.vue'),
      },
    ]
  },
  {
    path: "*",
    redirect: "/login"
  }
]

const router = new VueRouter({
  mode: 'hash',
  // base: process.env.BASE_URL,
  routes
})

//導航守衛
router.beforeEach((to, from, next) => {
  //判斷token是否失效


  let isLogin = false;
  if (to.name !== "Login") {

    getUserInfo({}).then((res) => {
      if (res.code == 200) {
        isLogin = true;
        setLocal('engine', res.data.user.engine);
      } else {
        next({ path: '/login' });
      }
    }).catch((err) => {
      setTimeout(() => {
        next({ path: '/login' });
      }, 2000);
      alert("請注意：由於您過於頻繁跳轉頁面，因此系統判定為惡意行為，即將導向登入頁，謝謝。");
    })
  }

  //在登入狀態下導到其他頁面則返回home頁
  if (to.path != "/domain"
    && to.path != "/domain/home"
    && to.path != "/domain/adRank"
    && to.path != "/domain/dashboard"
    && to.path != "/domain/domainRank"
    && to.path != "/domain/settings"
    && isLogin) {
    this.$router.push({ path: "/home" });
  }
  else next();
});


export default router
