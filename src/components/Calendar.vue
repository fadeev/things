<template>
  <div>
    <div class="row title">
      <div><Icon image="upcoming" :large="true"></Icon></div>
      <div>Upcoming</div>
    </div>
    <div class="row day" v-for="(dayTodos, date) in todos" :key="date">
      <div class="header">
        <div class="number">{{date.split('-')[2]}}</div>
        <div class="day-of-week">{{day(date)}}</div>
      </div>
      <TodoNew :data="todo" v-for="(todo, index) in dayTodos" :key="index"></TodoNew>
    </div>
  </div>
</template>

<style scoped>
  .row.title { margin: 0 60px 30px; font-size: 1.5em; font-weight: bold; display: flex; align-items: center; }
  .day .header { margin: 30px 60px 10px; display: flex; align-items: baseline; }
  .day .number { font-size: 36px; font-weight: bold; margin-right: 5px; }
  .day .day-of-week { flex-grow: 1; color: rgba(0,0,0,.35); font-weight: bold; border-top: 1px solid rgba(0,0,0,.15); padding-top: 4px; }
</style>

<script>
  import groupBy from 'lodash/groupBy'

  import Icon from './Icon.vue'
  import TodoNew from './TodoNew.vue'

  export default {
    components: { TodoNew, Icon },
    computed: {
      todos() {
        return groupBy(this.$store.getters.todoFolder("Upcoming"), "date")
      },
    },
    methods: {
      day(date) {
        let week = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday', 'Sunday']
        return week[(new Date(date).getDay() - 1)]
      }
    },
  }
</script>
