import Vue from 'vue'
import Vuex from 'vuex'
import { findIndex } from 'lodash'
import uuidv1 from 'uuid/v1'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    entityList: [
      // AREAS
      {
        id: 'a7685e81-4783-4600-9756-053678b4f702',
        type: 'area',
        name: 'Family',
      },
      {
        id: '8583288f-79f6-418e-b51c-7e57f91fd762',
        type: 'area',
        name: 'Work',
      },
      {
        id: '8583288f-79f6-418e-b61c-7e57f91fd862',
        type: 'area',
        name: 'Hobbies',
      },
      // PROJECTS
      {
        id: '9c3255cd-f203-43bf-a9b7-28a206f1a9a4',
        type: 'project',
        name: 'Vacation in Rome',
        notes: 'This project shows you everything you need to know to hit the ground running. Don’t hesitate to play around in it – you can always create a new one from the help menu.',
        areaId: 'a7685e81-4783-4600-9756-053678b4f702',
      },
      {
        id: '9c3155ad-f203-42bf-a9b7-28a206f1a9a4',
        type: 'project',
        name: 'Buy a New Car',
        notes: 'This project shows you everything you need to know to hit the ground running. Don’t hesitate to play around in it – you can always create a new one from the help menu.',
        areaId: 'a7685e81-4783-4600-9756-053678b4f702',
      },
      {
        id: '9c3155ad-f203-42bf-a9b7-39a206f1a9a4',
        type: 'project',
        name: 'Throw Party',
        areaId: 'a7685e81-4783-4600-9756-053678b4f702',
      },
      {
        id: '79d8850d-1212-444a-b2ce-b2aca2764bed',
        type: 'project',
        name: 'Presentation',
        areaId: '8583288f-79f6-418e-b51c-7e57f91fd762',
      },
      {
        id: '79d8850d-1313-444a-b2ce-b2aca2764bed',
        type: 'project',
        name: 'Onboard James',
        areaId: '8583288f-79f6-418e-b51c-7e57f91fd762',
      },
      {
        id: '19d8850d-1313-444a-b2ce-b2aca2764bed',
        type: 'project',
        name: 'Project 1',
      },
      {
        id: '29d8850d-1313-444a-b2ce-b2aca2764bed',
        type: 'project',
        name: 'Project 2',
      },
      {
        id: '39d8850d-1313-444a-b2ce-b2aca2764bed',
        type: 'project',
        name: 'Project 3',
      },
      // TODOS
      {
        id: 'a97fbee7-6614-4baa-a670-f9142c35b365',
        type: 'todo',
        name: 'Double-click this to-do',
        notes: 'You’re looking at a to-do! Complete it by clicking the checkbox on the left. Completed to-dos are collected at the bottom of your project.',
        projectId: '9c3255cd-f203-43bf-a9b7-28a206f1a9a4',
        headingId: '7a138735-d927-46bb-90f4-2b2a4f48a315'
      },
      {
        id: '20e3a148-0229-47a1-9fc4-e3de0aad4515',
        type: 'todo',
        name: 'Create a new to-do',
        notes: "",
        projectId: '9c3255cd-f203-43bf-a9b7-28a206f1a9a4',
        headingId: '7a138735-d927-46bb-90f4-2b2a4f48a315'
      },
      // HEADINGS
      {
        id: '7a138735-d927-46bb-90f4-2b2a4f48a315',
        type: 'heading',
        name: 'Learn the basics',
      },
      {
        id: '29687a49-9d0b-4a0c-8ffe-7b4f927a8110',
        type: 'heading',
        name: 'Tune your setup',
      },
      // TAGS
      {
        id: '29687a49-9d0b-4a0c-8ffe-7b4f127a8110',
        type: 'tag',
        name: 'Errand',
      },
      {
        id: '29687a49-9d0b-4a0c-8ffe-7b4f937a8110',
        type: 'tag',
        name: 'Home',
      },
      {
        id: '29687a49-9d0b-4a0c-8ffe-2b4f927a8110',
        type: 'tag',
        name: 'Office',
      },
      {
        id: '29687a49-9d0b-4a0c-8ffe-2b4f927a8120',
        type: 'tag',
        name: 'Important',
      },
      {
        id: '29687a49-9d0b-4a0c-8ffe-2b4f927a8010',
        type: 'tag',
        name: 'Pending',
      },
    ],
  },
  mutations: {
    entityUpdate(state, entity) {
      const index = findIndex(state.entityList, ['id', entity.id])
      Vue.set(state.entityList, index, entity)
    },
    entityCreate(state, entity) {
      state.entityList.push(entity)
    },
  },
  actions: {
    entityUpdate({commit}, entity) {
      commit('entityUpdate', entity)
    },
    entityCreate({commit}, newEntity) {
      const entity = {...newEntity, id: uuidv1()}
      commit('entityCreate', entity)
      return entity
    },
  }
})
