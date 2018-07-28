<template>
  <div @click.stop="deselect">
    <div class="row title">
      <div><Icon :image="folder ? folder : 'project'" :large="true"></Icon></div>
      <div v-if="!project && folder">{{folder}}</div>
      <div v-if="project">
        <input type="text" v-model="project.name" placeholder="New Project">
      </div>
    </div>
    <div v-if="project" class="row notes">
      <input type="text" v-model="project.notes" placeholder="Notes">
    </div>
    <div class="row tags">
      <div :class="{tag: true, selected: !tagSelected}" @click="tagSelected = null">
        All
      </div>
      <div :class="{tag: true, selected: tag == tagSelected}" @click="tagSelected = tag" v-for="(tag, index) in tagsLocal" :key="index">
        {{tag}}
      </div>
    </div>
    <div v-if="folder != 'Upcoming'" class="row todos">
      <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid" v-for="todo in todos" :key="todo.uuid"></TodoNew>
    </div>
    <div v-if="folder === 'Upcoming'" class="row day" v-for="(dayTodos, date) in todos" :key="date">
      <div class="header">
        <div class="number">{{date.split('-')[2]}}</div>
        <div class="day-of-week">{{day(date)}}</div>
      </div>
      <TodoNew :dat="todo" v-for="(todo, index) in dayTodos" :key="index"></TodoNew>
    </div>
  </div>
</template>

<style scoped>
  .row.title { margin: 0 60px 10px; font-size: 1.5em; font-weight: bold; display: flex; align-items: center; }
  .row.title input { padding: 0; border: none; background: none; font-size: 1em; font-weight: bold; font-family: "Roboto"; outline: none; }
  .row.notes { margin: 0 60px 30px; }
  .row.notes input { font-size: 1em; background: none; border: none; padding: none; outline: none; }
  .row.tags { margin: 20px 60px 30px; display: flex; }
  .row.tags .tag { border: 1px solid transparent; cursor: pointer; color: rgba(0,0,0,.35); font-weight: bold; border-radius: 1000px; padding: 0 10px; margin-right: 5px; }
  .row.tags .tag.selected { background: rgba(0,0,0,.25); color: white; }
  .row.tags .tag.selected:hover { border-color: rgba(0,0,0,0); }
  .row.tags .tag:hover { border-color: rgba(0,0,0,.25); }

  .fade-leave-active { transition: all 1s .5s; opacity: 0; }
  .day .header { margin: 30px 60px 10px; display: flex; align-items: baseline; }
  .day .number { font-size: 36px; font-weight: bold; margin-right: 5px; }
  .day .day-of-week { flex-grow: 1; color: rgba(0,0,0,.35); font-weight: bold; border-top: 1px solid rgba(0,0,0,.15); padding-top: 4px; }
  .news { color: red; font-size: 20px;}
  .white { background: white; }
</style>

<script>
  import { Route } from 'vue-router'

  import includes from 'lodash/includes'
  import uniq from 'lodash/uniq'
  import flatten from 'lodash/flatten'
  import omitBy from 'lodash/omitBy'
  import isNil from 'lodash/isNil'
  import cloneDeep from 'lodash/cloneDeep'
  import find from 'lodash/find'
  import some from 'lodash/some'
  import groupBy from 'lodash/groupBy'
  import forOwn from 'lodash/forOwn'

  import TodoNew from "./TodoNew.vue"
  import Icon from './Icon.vue'
  import { EventBus } from '../event-bus.js'

  export default {
    components: { TodoNew, Icon },
    props: ["folder", "selectedtodo"],
    data() {
      return {
        selected: null,
        tagSelected: null,
        white: null,
        project: cloneDeep(find(this.$store.state.projects, {uuid: this.$route.params.uuid})),
      }
    },
    mounted() {
      let uuid = this.$route.params.uuid
      let project = find(this.$store.state.projects, {uuid: uuid})
      let area = find(this.$store.state.areas, {uuid: uuid})
      if (uuid && !(project || area)) this.$router.push("/")
    },
    watch: {
      project: {
        deep: true,
        handler(value) {
          this.$store.dispatch("projectUpdate", value)
        }
      },
    },
    computed: {
      area() {
        return find(this.$store.state.areas, {uuid: this.$route.params.uuid})
      },
      // projectStore() {
      //   return find(this.$store.state.projects, {uuid: this.$route.params.uuid})
      // },
      todos() {
        let tag = this.tagSelected
        if (this.folder === 'Upcoming') {
          return groupBy(this.$store.getters.todoFolder("Upcoming"), "date")
        } else {
          if (tag) {
            return this.todosAll.filter(todo => {
              return includes(todo.tags, tag)
            })
          } else {
            return this.todosAll
          }
        }
      },
      todosAll() {
        return this.$store.getters.todoFolder(this.folder).filter(todo => {
          return todo.project == this.$route.params.uuid
        })
      },
      tagsLocal() {
        return omitBy(uniq(flatten(this.todosAll.map(todo => todo.tags))), isNil)
      },
    },
    methods: {
      whiteUpdate() {
        // let white = false;
        let arr = [];
        forOwn(this.$refs, (v, k) => {
          if (v[0]) arr.push(v[0].full)
        })
        // this.white = !some(arr)
        EventBus.$emit("whiteUpdate", !some(arr))
      },
      select(e) {
        this.selected = e
      },
      deselect() {
        forOwn(this.$refs, (todo, uuid) => todo.forEach((element) => element.deselect()))
        this.selected = false;
      },
      todoCreate() {
        let project = this.$route.params.uuid ? {project: this.$route.params.uuid} : false 
        let date = this.folder ? {date: this.folder} : false
        this.$store.dispatch("todoCreate", {...project, ...date}).then(uuid => {
          this.$nextTick(() => {
            this.$refs[uuid][0].fullToggle()
          })
        })
      },
      day(date) {
        let week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday']
        return week[(new Date(date).getDay() - 1)]
      }
    },
  }
</script>
