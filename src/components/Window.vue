<template>
  <div class="window">
    <div class="sidebar" id="bloop">
      <div class="list">
        <router-link to="/" tag="div" class="item">
          <Icon image="inbox"></Icon>
          <span>Inbox</span>
          <span class="count">{{countInbox >= 1 ? countInbox : null}}</span>
        </router-link>
      </div>
      <div class="list">
        <router-link to="/today" tag="div" class="item">
          <Icon image="today"></Icon>
          <span>Today</span>
          <span class="count">{{count >= 1 ? count : null}}</span>
        </router-link>
        <router-link to="/upcoming" tag="div" class="item">
          <Icon image="upcoming"></Icon>
          <span>Upcoming</span>
        </router-link>
        <router-link to="/anytime" tag="div" class="item">
          <Icon image="anytime"></Icon>
          <span>Anytime</span>
        </router-link>
        <router-link to="/someday" tag="div" class="item">
          <Icon image="someday"></Icon>
          <span>Someday</span>
        </router-link>
      </div>
      <div class="list">
        <Container>
          <Draggable v-for="area in areas" :key="area.uuid" class="area">
            <router-link v-if="area.uuid" :to="`/area/${area.uuid}`" tag="div" :ref="`area-${area.uuid}`">
              <Container @mouseup.native="draggingUpdate(area)" @mouseover.native="mouseOver(area)" @mouseleave.native="mouseLeave(area)" :class="{item: true, hover: areaHover == area.uuid}">
                <Icon image="area"></Icon>
                <span>{{area.name || "New Area"}}</span>
              </Container>
            </router-link>
            <Container @drag-start="dragStart($event, area.projects)" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
              <Draggable v-for="project in area.projects" :key="project.uuid">
                <router-link :to="`/project/${project.uuid}`" tag="div">
                  <Container @mouseup.native="draggingUpdate(project)" class="item" @mouseover.native="mouseOver(project)" @mouseleave.native="mouseLeave(project)" :class="{item: true, hover: areaHover == project.uuid}">
                    <Icon image="project"></Icon>
                    <span>{{project.name || "New Project"}}</span>
                  </Container>
                </router-link>
              </Draggable>
            </Container>
          </Draggable>
        </Container>
      </div>
    </div>
    <div :class="{main: true, white: white}" @click="deselect">
      <div class="workspace">
        <router-view :key="$route.fullPath" ref="folder"></router-view>
      </div>
    </div>
    <div class="toolbar">
      <div class="left">
        <div class="button">
          <svg @click.stop="newListMenuToggle" xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
          <transition name="fade">
            <div v-if="newListMenu" class="menu" ref="menu">
              <div class="item" @click.stop="newListCreate('project')">
                <Icon image="project" color="white"></Icon>
                New Project
              </div>
              <div class="item" @click.stop="newListCreate('area')">
                <Icon image="area" color="white"></Icon>
                New Area
              </div>
            </div>
          </transition>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M12 9c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1zm0-2c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-9 4c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm18 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-9-6c.343 0 .677.035 1 .101v-3.101c0-.552-.447-1-1-1s-1 .448-1 1v3.101c.323-.066.657-.101 1-.101zm9 4c.343 0 .677.035 1 .101v-7.101c0-.552-.447-1-1-1s-1 .448-1 1v7.101c.323-.066.657-.101 1-.101zm0 10c-.343 0-.677-.035-1-.101v3.101c0 .552.447 1 1 1s1-.448 1-1v-3.101c-.323.066-.657.101-1 .101zm-18-10c.343 0 .677.035 1 .101v-7.101c0-.552-.447-1-1-1s-1 .448-1 1v7.101c.323-.066.657-.101 1-.101zm9 6c-.343 0-.677-.035-1-.101v7.101c0 .552.447 1 1 1s1-.448 1-1v-7.101c-.323.066-.657.101-1 .101zm-9 4c-.343 0-.677-.035-1-.101v3.101c0 .552.447 1 1 1s1-.448 1-1v-3.101c-.323.066-.657.101-1 .101z"/></svg>
        </div>
      </div>
      <div class="right">
        <div class="button" @click="todoCreate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
        <div class="button" @click.stop="todoDate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z"/></svg>
          <div v-if="calendar" class="menu cal">
            <Cal @date="setDate($event)"></Cal>
          </div>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .area { margin-bottom: 15px; }
  .menu { transition: all .25s; color: rgba(255,255,255,.9); min-width: 150px; position: absolute; top: -70px; left: 10px; background: #272b35; border-radius: 5px; padding: 5px; }
  .menu .item { cursor: pointer; display: flex; align-items: center; padding: 3px 5px; border-radius: 2px; }
  .menu .item:hover { background: #5391f4; }

  .menu.cal { left: inherit; top: inherit; right: inherit; bottom: 40px; }

  .window { display: flex; height: 100vh; font-weight: 400; font-family: "Roboto", sans-serif; color: rgba(0,0,0,.75); }
  .sidebar { background: rgb(245, 246, 247); width: 250px; flex-shrink: 0; overflow-y: hidden; }
  .sidebar .list { margin: 20px; }
  .sidebar .list .item { overflow: hidden; border: 2px solid transparent; border-radius: 5px; padding: 3px; cursor: pointer; user-select: none; margin-bottom: 5px; display: flex; align-items: center; }
  .main { transition: background-color .5s; overflow-y: scroll; background: rgb(251, 250, 251); display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; }
  .workspace { margin-bottom: 100px; padding-top: 60px; }
  .workspace > .new { margin-left: 40px; margin-right: 40px; margin-bottom: 0; }
  .workspace > .new.full { margin-bottom: 20px; }
  .main .title { font-size: 1.5em; font-weight: bold; display: flex; align-items: center; }
  .main .timeline { padding: 10px; border-radius: 5px; background: rgba(0,0,0,.05); color: rgba(0,0,0,.5); }
  .main .tags { display: flex; }
  .main .tags .tag { color: rgba(0,0,0,.35); font-weight: bold; border-radius: 1000px; padding: 0 10px; margin-right: 5px; }
  .main .tags .tag.selected { background: rgba(0,0,0,.25); color: white; }
  .main .todos .todo { margin-bottom: 10px; }
  .main .todos .todo svg { margin-right: 10px; }
  .icon { margin-right: 5px; }
  .row.title  { margin: 0 60px 30px; font-size: 1.5em; font-weight: bold; display: flex; align-items: center; }
  .icon { margin-right: 5px; }

  .count { font-weight: bold; color: rgba(0,0,0,.5); margin-left: auto; margin-right: 5px; }

  .router-link-exact-active { background: rgba(0,0,0,.05); }

  .toolbar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; border-top: 1px solid rgba(0,0,0,.1); }
  .toolbar .button { cursor: pointer; }
  .toolbar .left { background: rgba(245, 246, 247, .85); flex-shrink: 0; align-items: center; display: flex; flex-basis: 250px; padding: 10px 25px; box-sizing: border-box; flex-direction: row; justify-content: space-between; }
  .toolbar .right { background: rgba(255,255,255,.85); align-items: center; display: flex; flex-grow: 1; flex-direction: row; box-sizing: border-box; justify-content: center; }
  .toolbar .right .button { display: flex; justify-content: center; align-items: flex-end; position: relative; padding: 5px 40px; }
  .toolbar .right .button:hover { border-color: rgba(0,0,0,.1); border-radius: 4px; }
  .toolbar .right .button:active { background: rgba(0,0,0,.1); border-color: transparent; }

  .fade-in-enter-active { transition: opacity .5s; }
  .fade-in-enter { opacity: 0; }
  .fade-in-enter-to { opacity: 1; }
  .main.white { background: white; }

  .fade-enter { opacity: .8; }
  .fade-enter-to { opacity: 1; }
  .fade-leave { opacity: 1; transform: scale(1); }
  .fade-leave-to { opacity: 0; transform: scale(.95) translateY(2px); }

  .red { background: red}

  .sidebar .list .item.hover { border-color: #40a3f0; }
</style>

<script>
  import TodoNew from "./TodoNew.vue"
  import Icon from "./Icon.vue"
  import Cal from "./Cal.vue"
  import { groupBy, sortBy, cloneDeep } from 'lodash'
  import { EventBus } from "../event-bus.js"
  import { Container, Draggable } from "vue-smooth-dnd";

  export default {
    components: { TodoNew, Icon, Cal, Container, Draggable },
    data() {
      return {
        white: true,
        newListMenu: null,
        calendar: null,
        areaHover: null,
      }
    },
    mounted() {
      EventBus.$on("whiteUpdate", bool => {
        this.white = bool
      })
      EventBus.$on("todoUnfold", () => {
        this.$nextTick(() => {
          this.white = document.querySelectorAll(".full").length <= 0
        })
      })
    },
    methods: {
      mouseOver(area) {
        if (this.$store.state.dragging && area) this.areaHover = area.uuid
      },
      mouseLeave(area) {
        this.areaHover = null
      },
      setDate(date) {
        let todo = cloneDeep(this.$store.getters.todoById(this.$store.state.selected))
        todo.date = date
        this.$store.dispatch("todoUpdate", todo)
      },
      todoDate() {
        this.calendar = !this.calendar
      },
      dragStart(event, list) {
        if (event.isSource) {
          this.$store.dispatch("draggingCreate", list[event.payload])
        }
      },
      dragEnd(event) {
        if (this.$store.state.dragging) {
          this.$store.dispatch("projectUpdate", this.$store.state.dragging).then(() => {
            this.$store.dispatch("draggingDestroy")
          })
        }
      },
      draggingUpdate(project) {
        if (project && project.uuid && this.$store.state.dragging) {
          this.$store.dispatch("draggingCreate", {...this.$store.state.dragging, list: project.uuid})
        }
      },
      deselect() {
        EventBus.$emit("todoDeselect")
        this.$refs['folder'].deselect()
        this.newListMenu = false
      },
      todoCreate() {
        this.$refs["folder"].todoCreate()
      },
      newListCreate(list) {
        this.newListMenu = false;
        this.$store.dispatch("listCreate", list).then(uuid => {
          this.$nextTick(() => {
            this.$router.push(`/${list}/${uuid}`)
          })
        })
      },
      newListMenuToggle() {
        this.newListMenu = !this.newListMenu
      },
    },
    computed: {
      count() {
        return this.$store.getters.todoFolder("Today").filter(todo => !todo.done).length
      },
      countInbox() {
        return this.$store.getters.todoFolder("Inbox").filter(todo => !todo.done).length
      },
      projects() {
        return this.$store.state.projects;
      },
      areas() {
        let areas = [...this.$store.state.areas, {uuid: false}]
        return sortBy(areas.map(area => {
          let projects = this.$store.state.projects.filter(project => {
            return (project.list ? project.list : false) == area.uuid
          })
          return {...area, projects}
        }), area => {
          return area.uuid == false ? 0 : 1
        })
        //return groupBy(this.$store.state.projects, "list")
        // return mapKeys(groupBy(this.$store.state.projects, "list"), (value, key) => {
        //   let k = find(this.$store.state.areas, {uuid: key})
        //   return k ? k.name : null
        // })
      },
    },
  }
</script>