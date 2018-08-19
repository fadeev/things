import Vue from 'vue'
import VueRouter from 'vue-router'

import { store } from "./store.js"

import App from './App.vue'

import Folder from './components/Folder.vue'

Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/inbox', exact: true },
    { path: '/inbox', component: Folder, props: {folder: "Inbox"} },
    { path: '/today', component: Folder, props: {folder: "Today"}},  
    { path: '/upcoming', component: Folder, props: {folder: "Upcoming"} },  
    { path: '/anytime', component: Folder, props: {folder: "Anytime"} },  
    { path: '/someday', component: Folder, props: {folder: "Someday"}},
    { path: '/project/:uuid', component: Folder, props: true},
    { path: '/area/:uuid', component: Folder, props: true},
  ],
})

router.beforeEach((to, from, next) => {
  store.dispatch("setMain", true)
  next()
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
