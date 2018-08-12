<template>
  <div>
    <div :class="{todo: true, full: full, compact: !full}" :style="{maxHeight: full ? 350 + local.checklist.length * 30 + 'px' : null}" @click.stop="activate(null)" @dblclick.stop="fullToggle()">
      <div class="block name">
        <div class="check space">
          <Icon :image="local.done ? 'box-check' : 'box-empty'" :color="local.done ? '#215abc': 'gray'" size="tiny"></Icon>
        </div>
        <div class="details">
          <div class="name">
            <Icon class="space" v-if="isToday() && !area" image="star" color="#fbcd43" size="tiny"></Icon>
            <input class="space" type="text" v-model="local.name">
            <Icon v-if="!full && local.checklist" class="space" image="checklist" color="#aaa" size="tiny"></Icon>
            <Icon v-if="!full && local.description" class="space" image="document" color="#aaa" size="tiny"></Icon>
            <div v-if="!full && local.tags" class="space tag" v-for="tag in local.tags" :key="tag">{{tag}}</div>
            <div v-if="!full && local.deadline" class="deadline">
              <Icon class="space" image="flag" color="#ff5b79" size="tiny"></Icon>
              <div>today</div>
            </div>
          </div>
          <div class="area" v-if="area && !full">{{local.list}}</div>
        </div>
      </div>
      <div class="block notes">
        <textarea v-model="local.description"></textarea>
      </div>
      <div class="block checklist">
        <div class="item" v-for="item in local.checklist" :key="item.name">
          <Icon class="space" image="project" color="#5a7ec7" size="tiny"></Icon>
          <div>
            <input type="text" v-model="item.name">
          </div>
          <Icon class="handle" image="handle" color="#aaa" size="tiny"></Icon>
        </div>
      </div>
      <div class="block tags">
        <div class="space item" v-for="item in local.tags" :key="item">
          {{item}}
        </div>
        <input type="text">
      </div>
      <div class="block date">
        <Icon class="space" :image="isToday() ? 'star' : 'calendar'" :color="isToday() ? '#fbcd43' : '#aaa'"></Icon>
        <div class="space">{{isToday() ? 'Today' : local.date}}</div>
        <div>🞩</div>
      </div>
      <div class="block date">
        <Icon class="space" image="flag" color="#aaa"></Icon>
        <div class="space">{{local.deadline}}</div>
        <div>🞩</div>
      </div>
      <div class="block toolbar">
        <div :class="{item: true, active: active == 'date'}" @click.stop="activate('date')">
          <Icon class="space" image="calendar" color="#bbb"></Icon>
          <input placeholder="Date" type="text">
          <div v-if="active == 'date'" class="menu">
            <div class="menu-item">
              <Icon class="space" image="star" color="#fbcd43"></Icon>
              <div>Today</div>
            </div>
            <div class="menu-item">
              <Icon class="space" image="evening" color="lightblue"></Icon>
              <div>This Evening</div>
            </div>
            <Cal></Cal>
            <div class="menu-item">
              <Icon class="space" image="drawer" color="#d2bd82"></Icon>
              <div>Someday</div>
            </div>
          </div>
        </div>
        <div :class="{item: true, active: active == 'tags'}" @click.stop="activate('tags')">
          <Icon class="space" image="tag" color="#bbb"></Icon>
          <input placeholder="Tag" type="text">
          <div v-if="active == 'tags'" class="menu">
            <div class="menu-item" v-for="tag in tags" :key="tag">
              {{tag}}
            </div>
          </div>
        </div>
        <div :class="{item: true, active: active == 'checklist'}" @click.stop="activate('checklist')">
          <Icon class="space" image="checklist" color="#bbb"></Icon>
          <input placeholder="Checklist" type="text">
        </div>
        <div :class="{item: true, active: active == 'deadline'}" @click.stop="activate('deadline')">
          <Icon class="space" image="flag" color="#bbb"></Icon>
          <input placeholder="Deadline" type="text">
          <div v-if="active == 'deadline'" class="menu">
            <Cal></Cal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  input, textarea { background: none; border: none; font-family: inherit; font-size: inherit; outline: none; }
  input { margin: 0; }

  .space { margin-right: 5px; }
  .todo { border-radius: 3px; overflow: hidden; padding: 20px; transition: padding .5s, max-height .5s, box-shadow .75s; }
  .compact { max-height: 50px; padding: 10px 20px; }
  .full { background: white; box-shadow: 0 1px 3px 1px rgba(0,0,0,.1); }

  .block { margin-left: 21px; margin-bottom: 15px; }
  
  .block.name { margin-left: 0; display: flex; align-items: center; }
  .block.checklist { margin-left: 16px; }
  .block.name .check { width: 16px; display: flex; align-items: flex-end; justify-content: center; }
  .block.name .details { display: flex; flex-direction: column; flex-grow: 1; }
  .block.name .details .name { display: flex; align-items: center; }
  .block.name .details .name .deadline { display: flex; margin-left: auto; color: #ff5b79; }
  .block.name .details .name .tag { align-items: center; font-size: 12px; color: rgba(0,0,0,.5); padding: 0 7px; border-radius: 1000px; margin: 0 2px; border: 1px solid rgba(0,0,0,.25); }
  .block.name .area { font-size: 10px; color: rgba(0,0,0,.5); }
  
  .block.notes textarea { width: 100%; }
  
  .block.checklist .item { align-items: center; display: flex; border-top: 1px solid rgba(0,0,0,.1); padding: 7px 5px; }
  .block.checklist .item:last-child { border-bottom: 1px solid rgba(0,0,0,.1); }
  .block.checklist .item .handle { margin-left: auto; }
  
  .block.tags { display: flex; }
  .block.tags .item { background: #bcdbd1; color: rgba(0,0,0,.4); font-weight: bold; padding: 0 10px; border-radius: 1000px; }
  
  .block.date { display: flex; align-items: center; }
  
  .block.toolbar { display: flex; justify-content: flex-end; }
  .block.toolbar .item { justify-content: center; position: relative; display: flex; align-items: center; padding: 7px 9px; border: 1px solid rgba(0,0,0,0); border-radius: 3px; margin: 0 1px; }
  .block.toolbar .item .space { margin-right: 0; transition: all .5s; }
  .block.toolbar .item.active .space { margin-right: 5px; }
  .block.toolbar .item input { width: 0; transition: all .5s; opacity: 0; }
  .block.toolbar .item.active input { width: 120px; opacity: 1; }
  .block.toolbar .item.active { background: rgba(0,0,0,.1); }
  .block.toolbar .item:hover { border-color: rgba(0,0,0,.1); }
  .block.toolbar .item.active:hover { border-color: rgba(0,0,0,0); }
  
  .menu { top: 40px; position: absolute; background: #272b35; border-radius: 9px; color: rgba(255,255,255,.9); padding: 7px; }
  .menu-item { display: flex; padding: 5px; border-radius: 4px; cursor: pointer; }
  .menu-item:hover { color: rgba(255,255,255,.9); background: #5391f4; }
</style>

<script>
  import { cloneDeep } from 'lodash'
  import Icon from "./TodoIcon.vue"
  import Cal from "./Cal.vue"

  export default {
    props: ["data", "area", "tags"],
    components: { Icon, Cal },
    data: function() {
      return {
        local: cloneDeep(this.data),
        buffer: {
          date: null,
        },
        active: null,
        full: true,
      }
    },
    watch: {
      local: {
        deep: true,
        handler(todoNew) {
          console.log("local changed")
        },
      },
    },
    methods: {
      fullToggle() {
        this.full = !this.full
      },
      isToday() {
        return this.local.date == new Date().toISOString().substring(0,10)
      },
      activate(button) {
        this.active = button
      },
    },
  }
</script>
