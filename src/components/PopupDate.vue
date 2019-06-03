<template>
  <div class="todo__list__toolbar__popup">
    <div class="todo__list__toolbar__popup__item" @click.stop="$emit('input', {date: todayDate, evening: false, someday: false})">
      <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#f1ca00" width="16" height="16" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
      <div class="window__sidebar__list__item__text">Today</div>
    </div>
    <div class="todo__list__toolbar__popup__item" @click.stop="$emit('input', {date: todayDate, evening: true, someday: false})">
      <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#a3bde2" width="16" height="16" viewBox="0 0 24 24"><path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"/></svg>
      <div class="window__sidebar__list__item__text">This Evening</div>
    </div>
    <div class="todo__list__toolbar__popup__calendar" style="height: inherit;">
      <div class="todo__list__toolbar__popup__calendar__item__header" v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
        {{day}}
      </div>
    </div>
    <div class="todo__list__toolbar__popup__calendar">
      <div class="todo__list__toolbar__popup__calendar__item"
           v-for="(day, index) in dateCalendarThree(new Date().getFullYear(), 6)"
           @click.stop="$emit('input', {date: `${day.year}-${day.month}-${day.day}`, evening: false, someday: false})"
           :key="index">
        {{day.day}}
      </div>
    </div>
    <div class="todo__list__toolbar__popup__item" @click.stop="$emit('input', {date: true, evening: false, someday: true})">
      <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#b5a96a" width="16" height="16" viewBox="0 0 24 24"><path d="M1 24h22v-12h-22v12zm8-9h6v2h-6v-2zm15-7v2h-24v-2l4.474-8h15.087l4.439 8z"/></svg>
      <div class="window__sidebar__list__item__text">Someday</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .todo__list__toolbar__popup { box-shadow: 0 5px 10px 0 rgba(0,0,0,.2); z-index: 1000; padding: 6px 0; color: white; background-color: #2b323b; margin-top: 3px; margin-bottom: 10px; width: 230px; border-radius: 7px; }
  .todo__list__toolbar__popup__item { margin: 0 6px; display: flex; align-items: center; border-radius: 4px; padding: 3px 4px; }
  .todo__list__toolbar__popup__item:hover { background-color: #5d9cf5; }
  .window__sidebar__list__item__icon { padding-bottom: 1px; }
  .window__sidebar__list__item__text { margin: 0 5px; font-weight: 600; }
  .todo__list__toolbar__popup__calendar { height: 135px; overflow-y: scroll; display: grid; grid-template-columns: repeat(7, 1fr); width: 100%; margin: 4px 0; padding: 0 8px; box-sizing: border-box; font-size: 13px; font-weight: 600; }
  .todo__list__toolbar__popup__calendar__item { line-height: 1.5; border-radius: 3px; text-align: center; padding: 3px 0; }
  .todo__list__toolbar__popup__calendar__item:hover { background-color: #5d9cf5; }
  .todo__list__toolbar__popup__calendar__item__header { font-size: 11px; margin: 2px 0; text-align: center; color: #838990; font-weight: 600; }
</style>

<script>
  import { range, chunk, flatten, filter } from 'lodash'
  
  export default {
    computed: {
      todayDate() {
        return new Date().toISOString().slice(0,10)
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
