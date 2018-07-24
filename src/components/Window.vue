<template>
  <div class="window">
    <div class="sidebar">
      <div class="list">
        <router-link to="/" tag="div" class="item">
          <Icon image="inbox"></Icon>
          <span>Inbox</span>
        </router-link>
        <router-link to="/today" tag="div" class="item">
          <Icon image="today"></Icon>
          <span>Today</span>
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
      <div class="toolbar">
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M12 9c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1zm0-2c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-9 4c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm18 0c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-9-6c.343 0 .677.035 1 .101v-3.101c0-.552-.447-1-1-1s-1 .448-1 1v3.101c.323-.066.657-.101 1-.101zm9 4c.343 0 .677.035 1 .101v-7.101c0-.552-.447-1-1-1s-1 .448-1 1v7.101c.323-.066.657-.101 1-.101zm0 10c-.343 0-.677-.035-1-.101v3.101c0 .552.447 1 1 1s1-.448 1-1v-3.101c-.323.066-.657.101-1 .101zm-18-10c.343 0 .677.035 1 .101v-7.101c0-.552-.447-1-1-1s-1 .448-1 1v7.101c.323-.066.657-.101 1-.101zm9 6c-.343 0-.677-.035-1-.101v7.101c0 .552.447 1 1 1s1-.448 1-1v-7.101c-.323.066-.657.101-1 .101zm-9 4c-.343 0-.677-.035-1-.101v3.101c0 .552.447 1 1 1s1-.448 1-1v-3.101c-.323.066-.657.101-1 .101z"/></svg>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="workspace">
        <router-view :key="$route.fullPath"></router-view>
        <!-- <div class="title">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#fbcd43" width="24" height="24" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
          <span>Today</span>
        </div>
        <div class="timeline">
          <div>08:30 Quora</div>
          <div>11:00 Marketing</div>
          <div>12:00 FlashSticks</div>
          <div>18:00 Scott Woods</div>
        </div>
        <div class="tags">
          <div class="tag selected">All</div>
          <div class="tag" v-for="tag in $store.state.tags" :key="tag">
            {{tag}}
          </div>
        </div>
        <TodoNew :selected="todo.uuid == selected" @select="select" :data="todo" :ref="todo.uuid" v-for="(todo, index) in $store.state.todos" :key="index"></TodoNew>
      </div>
      <div class="toolbar">
        <div class="button" @click="todoCreate">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z"/></svg>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
        </div>
        <div class="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="16" height="16" viewBox="0 0 24 24"><path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"/></svg>
        </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
  .window { display: flex; height: 100vh; font-family: "Roboto", sans-serif; color: rgba(0,0,0,.8); }
  .sidebar { background: rgba(0,0,0,.05); flex-basis: 250px; display: flex; flex-direction: column; justify-content: space-between; }
  .toolbar { align-items: center; height: 25px; padding: 10px 20px; border-top: 1px solid rgba(0,0,0,.1); color: rgba(0,0,0,.75); }
  .sidebar .toolbar { display: flex; justify-content: space-between; }
  .sidebar .list { margin: 20px; }
  .sidebar .list .item { cursor: pointer; user-select: none; margin-bottom: 10px; display: flex; align-items: center; }
  .main { background: rgba(0,0,0,.02); display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1; }
  .toolbar { display: flex; justify-content: center; }
  .toolbar .button { display: flex; }
  .main .toolbar .button { display: flex; padding: 5px 40px; border: 1px solid rgba(0,0,0,0); }
  .main .toolbar .button:hover { border-color: rgba(0,0,0,.1); border-radius: 4px; }
  .main .toolbar .button:active { background: rgba(0,0,0,.1); border-color: transparent; }
  .workspace { padding-top: 60px; }
  /* .workspace > * { margin: 0 60px 20px; } */
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
</style>

<script>
  import { store } from "../store.js"
  import TodoNew from "./TodoNew.vue"
  import Icon from "./Icon.vue"

  export default {
    components: { TodoNew, Icon },
    data() {
      return {
        selected: null,
      }
    },
    methods: {
      todoCreate() {
        store.dispatch("todoCreate").then((uuid) => {
          this.$nextTick(() => {
            console.log(this.$refs[uuid][0].fullToggle())
          })
        })
      },
      select(e) {
        this.selected = e
      },
    },
  }
</script>