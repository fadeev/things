import Vue from 'vue'
import Vuex from 'vuex'

import uuidv1 from 'uuid/v1'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tags: ["Work", "Home", "Errands", "Hobby", "Hard"],
    // todos: null,
    todos: [
      {
        name: "Borrow Sarah's travel guide",
        tags: ["Vacation"],
        date: "2018-07-23",
        deadline: "2018-07-23",
        uuid: 1,
      },
      {
        name: "Finish expense report",
        tags: ["Work", "Hard"],
        date: "2018-08-25",
        uuid: 2,
      },
      {
        name: "Power adapter",
        tags: ["Work", "Hard"],
        date: "2018-07-23",
        uuid: 4,
      },
      {
        name: "Take a day trip",
        tags: ["Work", "Hard"],
        date: "Someday",
        uuid: 5,
      },
      {
        name: "Take a cooking class",
        tags: ["Work", "Hard"],
        date: "Someday",
        uuid: 6,
      },
      {
        name: "Book flights",
        tags: ["Work", "Hard"],
        date: "Inbox",
        uuid: 7,
      },
      {
        name: "Confirm conference call for Wednesday",
        tags: ["Conference", "Work"],
        uuid: 3,
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
  },
  actions: {
    todoUpdate({commit}, todo) {
      commit("todoUpdate", todo)
    },
    todoCreate({commit}) {
      let uuid = uuidv1()
      return new Promise((resolve, reject) => {
        commit("todoCreate", uuid)
        resolve(uuid);
      })
    }
  },
  getters: {
    tags: (state) => {
      return uniq(flatten(state.todos.map(todo => todo.tags)).concat(state.tags))
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
    todoUpdate(state, todo) {
      let old = find(state.todos, {uuid: todo.uuid})
      old = todo
    },
    todoCreate(state, uuid) {
      if (!state.todos) state.todos = [];
      state.todos.push({uuid: uuid})
    },
  },
})