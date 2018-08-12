<template>
  <div class="calendar">
    <div class="month">
      <div class="arrow" @click="monthGo(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>
      </div>
      <div class="name">{{month(dateThis.getMonth()+1).name}}</div>
      <div class="arrow" @click="monthGo(+1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="white" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>
      </div>
    </div>
    <div class="header">
      <div class="day" v-for="(day, index) in daysOfWeek" :key="index">{{day}}</div>
    </div>
    <div class="week" v-for="(week, index) in dateCalendar(dateThis.getFullYear(), dateThis.getMonth()+1)" :key="index">
      <div @click="setDate(day.year, day.month, day.day)" :class="{day: true, clickable: day.day}" v-for="(day, index) in week" :key="index">
        {{day.day}}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .calendar { margin: 10px 0; }
  .calendar .header { margin-bottom: 5px; font-size: 13px; display: flex; color: rgba(255,255,255,.5); }
  .calendar .header .day { width: 30px; text-align: center; }
  .calendar .week { display: flex; }
  .calendar .week .day { width: 30px; padding: 3px 0; text-align: center; }
  .calendar .week .day.clickable:hover { background: #5391f4; cursor: pointer; border-radius: 3px; }
  .calendar .month { display: flex; justify-content: space-between; margin: 5px; }
  .calendar .month .arrow { cursor: pointer; }
</style>

<script>
  import { range, chunk, padStart } from 'lodash'

  export default {
    data: function() {
      return {
        dateThis: new Date(),
      }
    },
    computed: {
      daysOfWeek() {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      }
    },
    methods: {
      monthGo(d) {
        this.dateThis = new Date(this.dateThis.getFullYear(), this.dateThis.getMonth()+d, this.dateThis.getDate())
      },
      monthNow() {
        return new Date().getMonth()+1
      },
      month(number) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let date = new Date()
        return {name: months[number-1], number: number}

      },
      dateCalendar(year, month) {
        let cal = range(1, new Date(year, month-1, 0).getDate()+1).map(day => {
          return {year, month, day, dow: new Date(year, month-1, day).getDay()}
        })
        let buffer = range(0, cal[0].dow).map(dow => {
          return {day: null, dow: dow}
        })
        return chunk(buffer.concat(cal), 7)
      },
      setDate(yyyy, mm, dd) {
        this.$emit("date", `${yyyy}-${padStart(mm, 2, '0')}-${padStart(dd, 2, '0')}`)
      }
    }
  }
</script>
