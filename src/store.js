import Vue from 'vue'
import Vuex from 'vuex'

import uuidv1 from 'uuid/v1'
import find from 'lodash/find'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import findIndex from 'lodash/findIndex'

Vue.use(Vuex)

const folders = ["Inbox", "Today", "Upcoming", "Anytime", "Someday"]

export const store = new Vuex.Store({
  strict: true,
  state: {
    tags: ["Work", "Home", "Errands", "Hobby", "Hard"],
    todoSelected: null,
    todos: [
      {
        name: "Borrow Sarah's travel guide",
        deadline: "2018-08-20",
        list: "89",
        description: "Hello, World!",
        checklist: [
          {
            name: "Buy bread",
          },
          {
            name: "Buy butter",
            done: true
          },
          {
            name: "Apply butter to bread",
          },
        ],
        tags: ["Home", "Work", "Unicorns"],
        date: "2018-08-14",
        uuid: "1000000000000000000000",
      },
      {
        name: "Borrow Sarah's travel guide",
        tags: ["Work"],
        date: "Inbox",
        deadline: "2018-07-29",
        uuid: "1",
      },
      {
        name: "Finish expense report",
        tags: ["Work", "Hard"],
        date: "Inbox",
        list: "89",
        uuid: "2",
      },
      {
        name: "Power adapter",
        tags: ["Work", "Hard"],
        date: "2018-08-19",
        list: "510",
        uuid: "4",
      },
      {
        name: "Take a day trip",
        tags: ["Work", "Hard"],
        date: "2018-07-30",
        uuid: "5",
      },
      {
        name: "Take a cooking class",
        tags: ["Work", "Hard"],
        date: "2018-07-28",
        uuid: "6",
      },
      {
        name: "Book flights",
        tags: ["Work", "Hard"],
        list: "89",
        uuid: "7",
        date: "2018-08-19",
      },
      {
        name: "Confirm conference call for Wednesday",
        tags: ["Conference", "Work"],
        date: "2018-07-29",
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
      {
        name: "Book Flights",
        uuid: "00000",
        tags: ["Travel", "Fun"],
        list: "234",
        checklist: [
          {
            name: "London from June 3",
          },
          {
            name: "Paris from June 10",
          },
        ],
        date: "2018-08-14",
        heading: "1237768655472637",
      },
      {
        name: "Read about the metro",
        uuid: "123123453457686781",
        list: "234",
        description: "A description.",
        heading: "1237768655472637",
      },
      {
        name: "Borrow Sarah's travel guide",
        uuid: "12312345345768678222",
        list: "234",
        heading: "1237768655472637",
      },
      {
        name: "Book a hotel room",
        uuid: "123123453457686780926334222",
        list: "234",
        heading: "1237768655472637",
      },
      {
        name: "Power adapter",
        uuid: "1231234534576867822232132123",
        list: "234",
        tags: ["Errand"],
        description: "A description.",
        heading: "1237768655412313272637",
      },
      {
        name: "Extra camera battery",
        uuid: "12312345345768678222323",
        list: "234",
        tags: ["Errand", "Important"],
        description: "A description",
        heading: "1237768655412313272637",
      },
      {
        name: "Visit the Colosseum",
        uuid: "123123453457686782222131232323",
        list: "234",
        description: "A description",
        heading: "123776865111111000005472637",
      },
      {
        name: "Take a day trip to the Vatican",
        uuid: "1231235489858",
        list: "234",
        description: "A description",
        heading: "123776865111111000005472637",
      },
      {
        name: "Take a cooking class",
        checklist: [],
        tags: ["Fun"],
        description: "Description",
        deadline: "2018-01-01",
        date: "2018-08-14",
        uuid: "123123548912111111858",
        list: "234",
      },
    ],
    projects: [
      {
        name: "Vacation in Rome",
        uuid: "234",
        list: "89",
        notes: "We'll go from June 14-22 and stop through London on the way back to visit Jane and Paolo. Monti looks like a great place to stay. Maybe do a night out in Trastevere.",
      },
      {
        name: "Buy a New Car",
        uuid: "512",
        list: "89",
      },
      {
        name: "Throw Party for Eve",
        uuid: "511",
        list: "89",
      },
      {
        name: "Prepare Presentation",
        uuid: "510",
        list: "771",
      },
      {
        name: "Onboard James",
        uuid: "5292883",
        list: "771",
      },
      {
        name: "Attend Conference",
        uuid: "51081111",
        list: "771",
      },
      {
        name: "Order Team T-Shirts",
        uuid: "88888888888888823123123",
        list: "771",
      },
      {
        name: "Lean Basic Italian",
        uuid: "51027836725362",
        list: "9987654",
      },
      {
        name: "Run a Marathon",
        uuid: "51027836725362221323",
        list: "9987654",
      },
    ],
    areas: [
      {
        name: "Family",
        uuid: "89",
      },
      {
        name: "Work",
        uuid: "771",
      },
      {
        name: "Hobbies",
        uuid: "9987654"
      },
    ],
    headings: [
      {
        name: "Planning",
        list: "89",
        uuid: "1237768655472637",
      },
      {
        name: "Things to buy",
        list: "89",
        uuid: "1237768655412313272637",
      },
      {
        name: "Things to do",
        list: "89",
        uuid: "123776865111111000005472637",
      },
    ],
    dragging: null,
    selected: null,
    main: null,
  },
  getters: {
    todos: (state) => (folder) => {

    },
    todoById: (state) => (uuid) => {
      return find(state.todos, {uuid: uuid})
    },
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
  actions: {
    setMain({commit, state}, bool) {
      commit("setMain", bool)
    },
    todoSelect({commit, state}, t) {
      commit("todoSelect" , t)
    },
    todoUpdate({commit, state}, t) {
      let index = findIndex(state.todos, (x) => x.uuid == t.uuid)
      let todo = Object.assign({}, t)
      // commit("todoUpdate", {index, todo})
      return new Promise((resolve, reject) => {
        commit("todoUpdate", {index, todo})
        resolve();
      })
    },
    projectUpdate({commit, state}, p) {
      let index = findIndex(state.projects, (x) => x.uuid == p.uuid)
      let project = Object.assign({}, p)
      commit("projectUpdate", {index, project})
    },
    todoCreate({commit}, data) {
      if (data.date == "Anytime") data.date = null
      if (data.date == "Today") data.date = new Date().toISOString().substring(0,10)
      if (data.date == "Upcoming") data.date = new Date().toISOString().substring(0,10)
      if (data.date == "Inbox") data.date = "Inbox"
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
    listCreate({commit}, list) {
      let uuid = uuidv1().toString()
      let t = {uuid}
      return new Promise((resolve, reject) => {
        if (list == "project") commit("projectCreate", t)
        if (list == "area") commit("areaCreate", t)
        resolve(uuid);
      })
    },
    todoCreateInProject({commit}, data) {
      let uuid = uuidv1().toString()
      let todo = {uuid}
      commit("todoCreate", todo)
      commit("todoCreateInProject", {todo: todo, projectUuid: data.projectUuid})
    },
    areaUpdate({commit, state}, a) {
      let index = findIndex(state.areas, (x) => x.uuid == a.uuid)
      let area = Object.assign({}, a)
      commit("areaUpdate", {index, area})
    },
    draggingCreate({commit, state}, todo) {
      commit("draggingCreate", todo)
    },
    draggingDestroy({commit, state}) {
      commit("draggingDestroy")
    },
  },
  mutations: {
    todoSelect(state, t) {
      state.selected = t.uuid
    },
    tagCreate(state, tag) {
      state.tags.push(tag)
    },
    todoUpdate(state, data) {
      Vue.set(state.todos, data.index, data.todo)
     },
    projectUpdate(state, data) {
      Vue.set(state.projects, data.index, data.project)
    },
    areaUpdate(state, data) {
      Vue.set(state.areas, data.index, data.area)
    },
    todoCreate(state, todo) {
      if (!state.todos) state.todos = [];
      state.todos.push(todo)
    },
    todoCreateInProject(state, data) {
      let project = find(state.todos, {uuid: data.projectUuid})
      project.todos.push(data.todo.uuid.toString())
    },
    projectCreate(state, project) {
      state.projects.push(project)
    },
    areaCreate(state, area) {
      state.areas.push(area)
    },
    draggingCreate(state, todo) {
      state.dragging = todo
    },
    draggingDestroy(state) {
      state.dragging = null
    },
    setMain(state, bool) {
      state.main = bool
    }
  },
})