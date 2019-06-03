import Vue from 'vue'
import Router from 'vue-router'
import Window from './views/Window.vue'
import Inbox from './views/Inbox.vue'
import Today from './views/Today.vue'
import Upcoming from './views/Upcoming.vue'
import Anytime from './views/Anytime.vue'
import Someday from './views/Someday.vue'
import Logbook from './views/Logbook.vue'
import Trash from './views/Trash.vue'
import Area from './views/Area.vue'
import Project from './views/Project.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Window',
      component: Window,
      children: [
        { path: '', redirect: '/today', },
        { path: 'inbox', component: Inbox, },
        { path: 'today', component: Today, },
        { path: 'upcoming', component: Upcoming, },
        { path: 'anytime', component: Anytime, },
        { path: 'someday', component: Someday, },
        { path: 'logbook', component: Logbook, },
        { path: 'trash', component: Trash, },
        { path: 'area/:id', component: Area, },
        { path: 'project/:id', component: Project, },
      ],
    },
  ]
})
