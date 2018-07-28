import Vue from 'vue'
import Vuex from 'vuex'

import uuidv1 from 'uuid/v1'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import findIndex from 'lodash/findIndex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  state: {
    tags: ["Work", "Home", "Errands", "Hobby", "Hard"],
    todoSelected: null,
    todos: [
      {
        name: "Borrow Sarah's travel guide",
        tags: ["Work"],
        date: "Inbox",
        deadline: "2018-07-23",
        uuid: "1",
      },
      {
        name: "Finish expense report",
        tags: ["Work", "Hard"],
        date: "Inbox",
        uuid: "2",
      },
      {
        name: "Power adapter",
        tags: ["Work", "Hard"],
        date: "2017-02-02",
        uuid: "4",
      },
      {
        name: "Take a day trip",
        tags: ["Work", "Hard"],
        date: "Someday",
        uuid: "5",
      },
      {
        name: "Take a cooking class",
        tags: ["Work", "Hard"],
        date: "Someday",
        uuid: "6",
      },
      {
        name: "Book flights",
        tags: ["Work", "Hard"],
        date: "Inbox",
        uuid: "7",
      },
      {
        name: "Confirm conference call for Wednesday",
        tags: ["Conference", "Work"],
        uuid: "3",
        checklist: [
          {
            name: "Book flights",
          },
          {
            name: "Read about the metro",
          },
        ],
      },
    ],
    projects: [
      {
        name: "First Project",
        uuid: "234",
      },
    ],
    areas: [
      {
        name: "Area 51",
        uuid: "89",
      },
    ],
  },
  actions: {
    todoUpdate({commit, state}, t) {
      let index = findIndex(state.todos, (x) => x.uuid == t.uuid)
      let todo = Object.assign({}, t)
      commit("todoUpdate", {index, todo})
    },
    projectUpdate({commit, state}, p) {
      let index = findIndex(state.projects, (x) => x.uuid == p.uuid)
      let project = Object.assign({}, p)
      commit("projectUpdate", {index, project})
    },
    todoCreate({commit}, data) {
      if (data.date == "Anytime") data.date = null
      if (data.date == "Today") data.date = new Date().toISOString().substring(0,10)
      let uuid = uuidv1().toString()
      let todo = {...data, uuid}
      return new Promise((resolve, reject) => {
        commit("todoCreate", todo)
        resolve(uuid);
      })
    },
    projectCreate({commit}, data) {
      let uuid = uuidv1().toString()
      let todo = {uuid}
      return new Promise((resolve, reject) => {
        commit("projectCreate", todo)
        resolve(uuid);
      })
    },
    todoCreateInProject({commit}, data) {
      let uuid = uuidv1().toString()
      let todo = {uuid}
      commit("todoCreate", todo)
      commit("todoCreateInProject", {todo: todo, projectUuid: data.projectUuid})
      // return new Promise((resolve, reject) => {
      //   if (data.projectUuid) {
      //     // console.log('projectUuid', data.projectUuid)
      //     // console.log("commit", data, projectUuid)
      //   } else {
      //     commit("todoCreate", todo)
      //   }
      //   resolve(uuid);
      // })
    },
  },
  getters: {
    tags: (state) => {
      return uniq(flatten(state.todos.map(todo => todo.tags)).concat(state.tags))
    },
    projects: (state) => {
      return state.todos.filter(todo => {
        return todo.todos
      })
    },
    todosByProject: (state) => (projectUuid) => {
      let project = Object.assign({}, find(state.todos, {uuid: projectUuid}))
      project.todos = project.todos.map(uuid => {
        return find(state.todos, {uuid: uuid})
      })
      return project.todos
    },
    projectGet: (state) => (uuid) => {
      return find(state.todos, {uuid: uuid})
      // if (pr) {
      //   let project = Object.assign({}, pr)
      //   if (project && project.todos) {
      //     project.todos = project.todos.map(uuid => {
      //       return find(state.todos, {uuid: uuid})
      //     })
      //   }
      //   return project
      // } else {
      //   return false
      // }
    },
    todoFolder: (state) => (folder) => {
      return state.todos.filter(todo => {
        switch (folder) {
          case "Inbox":
            return todo.date && todo.date === "Inbox"
          case "Today":
            return todo.date === new Date().toISOString().substring(0,10)
          case "Anytime":
            return !todo.date || todo.date !== "Someday"
              && todo.date !== "Inbox"
              && !(todo.date && todo.date.match(/^(\d{4})-0?(\d+)-0?(\d+)$/))
          case "Someday":
            return todo.date && todo.date === "Someday"
          case "Upcoming":
            return todo.date && todo.date.match(/^(\d{4})-0?(\d+)-0?(\d+)$/);
          default:
            return true;
        }
      })
    },
  },
  mutations: {
    tagCreate(state, tag) {
      state.tags.push(tag)
    },
    todoUpdate(state, data) {
      Vue.set(state.todos, data.index, data.todo)
     },
    projectUpdate(state, data) {
      Vue.set(state.projects, data.index, data.project)
    },
    todoCreate(state, todo) {
      if (!state.todos) state.todos = [];
      state.todos.push(todo)
    },
    todoCreateInProject(state, data) {
      // if (!state.todos) state.todos = [];
      // state.todos.push({uuid: data.todo.uuid.toString()})
      
      let project = find(state.todos, {uuid: data.projectUuid})
      project.todos.push(data.todo.uuid.toString())

      // state.todos.forEach((e) => {
      //   if (e.uuid == data.projectUuid) e.todos = e.todos.push(2)
      // })

      // console.log("project", project)
      // let project = find(state.todos, {uuid: data.projectUuid})
      // console.log("project", project)
      // let x = project.todos
      // console.log("x", x)
      // x.push(4)
      // console.log("x", x)
      // project.todos = x
      // console.log("project.todos", project.todos)

      // if (project) {
      //   project.todos.push(123)
      // }
    },
    projectCreate(state, project) {
      state.projects.push(project)
    }
  },
})