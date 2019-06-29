<template>
  <div class="todo__list__toolbar__popup">
    <div class="todo__list__toolbar__popup__calendar" style="height: inherit;">
      <div class="todo__list__toolbar__popup__calendar__item__header" v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
        {{day}}
      </div>
    </div>
    <div class="todo__list__toolbar__popup__calendar" style="height: 200px;">
      <div class="todo__list__toolbar__popup__calendar__item"
            v-for="(day, index) in dateCalendarThree(new Date().getFullYear())"
            @click="$emit('input', `${day.year}-${day.month}-${day.day}`)"
            :key="index">
        <div v-if="day.day == 1" style="line-height: 1; font-size: 10px;">
          <div>{{monthList[day.month-1].slice(0,3)}}</div>
          <div>{{day.day}}</div>
        </div>
        <div v-else>{{day.day}}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .todo__list__toolbar__popup { box-shadow: 0 5px 10px 0 rgba(0,0,0,.2); z-index: 1000; padding: 6px 0; position: absolute; color: white; background-color: #2b323b; margin-top: 3px; margin-bottom: 10px; width: 230px; border-radius: 7px; }
  .todo__list__toolbar__popup__calendar { height: 135px; overflow-y: scroll; display: grid; grid-template-columns: repeat(7, 1fr); width: 100%; margin: 4px 0; padding: 0 8px; box-sizing: border-box; font-size: 13px; font-weight: 600; }
  .todo__list__toolbar__popup__calendar__item { line-height: 1.5; border-radius: 3px; text-align: center; padding: 3px 0; }
  .todo__list__toolbar__popup__calendar__item:hover { background-color: #5d9cf5; }
  .todo__list__toolbar__popup__calendar__item__header { font-size: 11px; margin: 2px 0; text-align: center; color: #838990; font-weight: 600; }
</style>

<script>
  import { range, flatten, filter } from 'lodash'
  
  export default {
    computed: {
      monthList() {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      },
    },
    methods: {
      dateCalendarThree(year, onMonth) {
        let cal = flatten(range(1,13).map(month => {
          return range(0, new Date(year, month, 0).getDate()).map(day => {
            return {
              year,
              month: String(month).padStart(2,0),
              day: String(day+1).padStart(2,0),
              dow: new Date(year, month-1, day).getDay(),
            }
          })
        }))
        cal = onMonth ? cal.filter(d => d.month == onMonth) : cal
        let buffer = range(0, cal[0].dow).map(dow => {
          return {day: null, dow: dow}
        })
        return [...buffer, ...cal]
      },
    }
  }
</script>