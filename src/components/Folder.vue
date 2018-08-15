<template>
  <div @click.stop="deselect">
    <div class="row title">
      <div v-if="folder"><Icon :image="folder" :large="true"></Icon></div>
      <div v-if="project"><Icon :image="'project'" color="#3c76cc" :large="true"></Icon></div>
      <div v-if="area"><Icon :image="'area'" :large="true"></Icon></div>
      <div v-if="!project && folder">{{folder}}</div>
      <div v-if="project">
        <input type="text" v-model="project.name" placeholder="New Project">
      </div>
      <div v-if="area">
        <input type="text" v-model="area.name" placeholder="New Area">
      </div>
    </div>
    <div v-if="project" class="row notes">
      <textarea type="text" v-model="project.notes" placeholder="Notes"></textarea>
    </div>
    <div v-if="area" class="row notes">
      <textarea type="text" v-model="area.notes" placeholder="Notes"></textarea>
    </div>
    <div class="row tags">
      <div :class="{tag: true, selected: !tagSelected}" @click="tagSelected = null">All</div>
      <div :class="{tag: true, selected: tag == tagSelected}" @click="tagSelected = tag" v-for="(tag, index) in tags" :key="index">{{tag}}</div>
    </div>
    <div v-if="folder == 'Inbox'">
      <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid" v-for="todo in todosFolder" :key="todo.uuid"></TodoNew>
    </div>
    <div v-if="folder == 'Today'">
      <!-- <Container @drag-start="dragStart($event, tagFilter(excludeProjects(todosFolder)))" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
        <Draggable v-for="todo in tagFilter(excludeProjects(todosFolder))" :key="todo.uuid">
          <TodoNew :area="true" @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid"></TodoNew>
        </Draggable>
      </Container> -->
      <div style="margin: 0 40px">
        <Container @drag-start="dragStart($event, tagFilter(excludeProjects(todosFolder)))" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
          <Draggable v-for="todo in tagFilter(excludeProjects(todosFolder))" :key="todo.uuid">
            <Todo :data="todo" :tags="['Home', 'Work']" :area="true" @update="todoUpdate($event)" @unfold="whiteUpdate"></Todo>
          </Draggable>
        </Container>
      </div>
      <div v-for="(todos, project) in filterBy($store.state.projects, tagFilter(todosFolder))" :key="project">
        <div class="row project">
          <Icon image="project"></Icon>
          <div>{{project}}</div>
        </div>
        <Container @drag-start="dragStart($event, todos)" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
          <Draggable v-for="todo in todos" :key="todo.uuid">
            <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid"></TodoNew>
          </Draggable>
        </Container>
      </div>
    </div>
    <div v-if="folder == 'Upcoming'">
      <div class="row day" v-for="dayTodos in groupByDate(tagFilter(todosFolder))" :key="dayTodos.date">
        <div class="header">
          <div class="number">{{dayTodos.date.split('-')[2]}}</div>
          <div class="day-of-week">{{day(dayTodos.date)}}</div>
        </div>
        <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid" v-for="todo in dayTodos.todos" :key="todo.uuid"></TodoNew>
      </div>
    </div>
    <div v-if="folder == 'Someday' || folder == 'Anytime'">
      <Container @drag-start="dragStart($event, tagFilter(todosFolder.filter(t => !t.list)))" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
        <Draggable  v-for="todo in tagFilter(todosFolder.filter(t => !t.list))" :key="todo.uuid">
          <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid"></TodoNew>
        </Draggable>
      </Container>
      <div v-for="(todos, project) in filterBy($store.state.projects, tagFilter(todosFolder))" :key="project">
        <div class="row project">
          <Icon image="project"></Icon>
          <div>{{project}}</div>
        </div>
        <Container @drag-start="dragStart($event, todos)" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
          <Draggable v-for="todo in todos" :key="todo.uuid">
            <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid"></TodoNew>
          </Draggable>
        </Container>
      </div>
      <div v-for="(todos, project) in filterBy($store.state.areas, tagFilter(todosFolder))" :key="project">
        <div class="row project">
          <Icon image="project"></Icon>
          <div>{{project}}</div>
        </div>
        <Container @drag-start="dragStart($event, todos)" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
          <Draggable v-for="todo in todos" :key="todo.uuid">
            <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid"></TodoNew>
          </Draggable>
        </Container>
      </div>
    </div>
    <div v-if="insideList(this.$store.state.projects)">
      <div v-for="todos in projectGroup(tagFilter(todosProject))" :key="todos.heading ? todos.heading.uuid : 0">
        <div v-if="todos.heading" class="heading">{{todos.heading.name}}</div>
        <TodoGroup :data="todos" ref="group"></TodoGroup>
      </div>
    </div>
    <div v-if="insideList(this.$store.state.areas)">
      <div v-for="project in projects($route.params.uuid)" :key="project.uuid">
        <div class="row project">
          <Icon image="project"></Icon>
          <div>{{project.name}}</div>
        </div>
      </div>
      <Container @drag-start="dragStart($event, tagFilter(todosArea))" @drag-end="dragEnd($event)" :get-child-payload="(i) => i">
        <Draggable v-for="todo in tagFilter(todosArea)" :key="todo.uuid">
          <TodoNew @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :ref="todo.uuid"></TodoNew>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<style scoped>
  .row.project { margin: 20px 58px 10px; display: flex; align-items: center; font-weight: bold; border-bottom: 1px solid rgba(0,0,0,.15); padding-bottom: 10px; }
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

  textarea { font-family: inherit; font-size: inherit; border: none; background: none; height: 4em; overflow: hidden; display: block; width: 100%; outline: none; }

  .smooth-dnd-ghost .new { background: rgba(204,221,253,1); border: none; border-radius: 3px; }
  .smooth-dnd-container .smooth-dnd-draggable-wrapper { overflow: visible; }

  .heading { margin: 20px 60px 10px; color: #3c76cc; font-weight: bold; border-bottom: 1px solid rgba(0,0,0,.1); padding-bottom: 5px; }
</style>

<script>
  import { Route } from 'vue-router'

  import { map, includes, orderBy, uniq, flatten, keys, value, omitBy, isNil, cloneDeep, find, some, groupBy, forOwn, mapKeys, mapValues, values, sortBy, omit } from 'lodash'

  import TodoNew from "./TodoNew.vue"
  import Todo from "./Todo.vue"
  import TodoGroup from './TodoGroup.vue'
  import Icon from './Icon.vue'
  import { EventBus } from '../event-bus.js'

  import { Container, Draggable } from "vue-smooth-dnd"

  export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult
    if (removedIndex === null && addedIndex === null) return arr
    const result = [...arr]
    let itemToAdd = payload
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0]
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd)
    }
    return result
  };

  export default {
    components: { TodoNew, Todo, TodoGroup, Icon, Container, Draggable },
    props: ["folder", "selectedtodo"],
    data() {
      return {
        selected: null,
        tagSelected: null,
        white: null,
        project: cloneDeep(find(this.$store.state.projects, {uuid: this.$route.params.uuid})),
        area: cloneDeep(find(this.$store.state.areas, {uuid: this.$route.params.uuid})),
      }
    },
    beforeRouteLeave(to, from, next) {
      this.deselect()
      this.$nextTick(() => {
        next()
      })
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
      area: {
        deep: true,
        handler(value) {
          this.$store.dispatch("areaUpdate", value)
        }
      }
    },
    computed: {
      todosAll() {
        return this.$store.getters.todoFolder(this.folder).filter(todo => {
          return todo.list == this.$route.params.uuid
        })
      },
      todosProject() {
        return this.$store.state.todos.filter(todo => {
          return todo.list == this.$route.params.uuid
        })
      },
      todosFolder() {
        return this.$store.getters.todoFolder(this.folder)
      },
      todosArea() {
        let list = this.$store.state.areas.map(item => item.uuid)
        return this.$store.state.todos.filter(todo => {
          return includes(list, todo.list) && todo.list == this.$route.params.uuid
        })
      },
      tags() {
        let source = this.$route.params.uuid ? this.todosProject : this.todosFolder
        return omitBy(uniq(flatten(source.map(todo => todo.tags))), isNil)
      },
    },
    methods: {
      todoUpdate(todo) {
        this.$store.dispatch("todoUpdate", todo)
      },
      // dragEnter(list) {
      //   if (this.$store.state.dragging && list) {
      //     this.$store.dispatch("draggingCreate", {...this.$store.state.dragging, heading: list.uuid})
      //   }
      //   if (list == null) {
      //     this.$store.dispatch("draggingCreate", omit({...this.$store.state.dragging}, "heading"))
      //   }
      // },
      // dragLeave(list) {
      //   if (this.$store.state.dragging) {
      //     this.$store.dispatch("draggingCreate", omit({...this.$store.state.dragging}, "heading"))
      //   }
      // },
      // onDrop(event, list) {
      //   // if (event.removedIndex) {
      //   //   this.$store.dispatch("draggingCreate", list[event.removedIndex])
      //   // }
      //   if (event.removedIndex) {
      //     // let todo = list[event.removedIndex]
      //     // this.$store.dispatch("draggingDestroy").then(() => {
      //     //   this.$store.dispatch("draggingCreate", todo).then(() => {
      //     //     this.$store.dispatch("todoUpdate", omit({...todo}, "heading"))
      //     //   })
      //     // })
      //   }
      //   if (event.addedIndex != null) {
      //     // let todo = list ? {...this.$store.state.dragging, heading: list.uuid} : omit({...this.$store.state.dragging}, "heading")
      //     // this.$store.dispatch("todoUpdate", todo).then(() => {
      //     //   this.$store.dispatch("draggingDestroy")
      //     // })
      //     // console.log(event, list, todo)
      //     //this.$store.dispatch("todoUpdate", omit({...todo}, "heading"))
      //   }
      //   // this.$store.dispatch("draggingDestroy")
      // },
      projectGroup(todos) {
        return sortBy(values(mapValues(groupBy(todos, "heading"), (value, key) => {
          return {todos: value, heading: find(this.$store.state.headings, {uuid: key})}
        })), heading => {
          return heading.heading ? 1 : 0
        })
      },
      getChildPayloadTodos() {
        return (index) => {
          return [index]
        }
      },
      shouldAcceptDrop() {
        return true
      },
      dragStart(event, source) {
        if (event.isSource) {
          this.$store.dispatch("draggingCreate", source[event.payload])
        }
      },
      dragEnd() {
        if (this.$store.state.dragging) {
          this.$store.dispatch("todoUpdate", this.$store.state.dragging).then(() => {
            this.$store.dispatch("draggingDestroy")
          })
        }
      },
      projects(uuid) {
        return this.$store.state.projects.filter(project => project.area == uuid)
      },
      tagFilter(todos) {
        return todos.filter(todo => {
          return this.tagSelected ? includes(todo.tags, this.tagSelected) : true
        })
      },
      insideList(list) {
        return includes(list.map(item => item.uuid), this.$route.params.uuid)
      },
      excludeProjects(todos) {
        let list = this.$store.state.projects.map(item => item.uuid)
        return todos.filter(todo => !includes(list, todo.list))
      },
      filterBy(source, todos) {
        let list = source.map(item => item.uuid)
        return mapKeys(groupBy(todos.filter(todo => { return todo.list && includes(list, todo.list) }), "list"), (value, key) => {
          return find(source, {uuid: key}).name
        })
      },
      groupByDate(todos) {
        return sortBy(map(groupBy(todos, "date"), (v, k) => {
          return {date: k, todos: v}
        }), ["date"])
      },
      whiteUpdate() {
        let array = [];
        forOwn(this.$refs, (v, k) => {
          if (v[0]) array.push(v[0].full)
        })
        EventBus.$emit("whiteUpdate", !some(array))
      },
      select(e) {
        this.selected = e
      },
      deselect() {
        forOwn(this.$refs, (todo, uuid) => todo.forEach((element) => {
          if (element.deselect) element.deselect()
        }))
        this.selected = false;
      },
      todoCreate() {
        console.log("todoCreate")
        let list = this.$route.params.uuid ? {list: this.$route.params.uuid} : false 
        let date = this.folder ? {date: this.folder} : false
        this.$store.dispatch("todoCreate", {...list, ...date}).then(uuid => {
          this.$nextTick(() => {
            if (this.$refs[uuid]) this.$refs[uuid][0].fullToggle(true)
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
