<template>
  <div>
    <div :class="{leave: leave, selected: selected, todo: true, full: full, compact: !full}" :style="{maxHeight: full ? 350 + (local.checklist ? local.checklist.length : 0) * 37 + 'px' : null}" @click.stop="select(); activate(null)" @dblclick.stop="fullToggle(!full)">
      <div class="block name">
        <div class="check space" @click.stop="todoDone()">
          <Icon :image="buffer.done ? 'box-check' : 'box-empty'" :color="buffer.done ? '#215abc': 'gray'" size="tiny"></Icon>
        </div>
        <div class="details">
          <div class="name">
            <Icon class="space" v-if="isToday() && (area === null)" image="star" color="#fbcd43" size="tiny"></Icon>
            <!-- <div v-if="hasDate() && !isToday() && !area">{{dateDayMonth()}}</div> -->
            <div class="space" v-if="!full">{{local.name || "New Todo"}}</div>
            <input ref="todoName" placeholder="New Todo" v-if="full" class="space" type="text" v-model="local.name" @keydown.enter="fullToggle(false)">
            <Icon v-if="!full && local.checklist" class="space" image="checklist" color="#aaa" size="tiny"></Icon>
            <Icon v-if="!full && local.description" class="space" image="document" color="#aaa" size="tiny"></Icon>
            <div v-if="!full && local.tags" class="space tag" v-for="tag in local.tags" :key="tag">{{tag}}</div>
            <div v-if="!full && local.deadline" class="deadline">
              <Icon class="space" image="flag" color="#ff5b79" size="tiny"></Icon>
              <div>today</div>
            </div>
          </div>
          <transition name="fold-small">
            <div class="area" v-if="area && !full">{{local.list}}</div>
          </transition>
        </div>
      </div>
      <div class="block notes">
        <textarea v-model="local.description" placeholder="Notes"></textarea>
      </div>
      <div class="block checklist" v-if="hasChecklist()">
        <Container @drop="checklistDrop" lock-axis="y" drag-handle-selector=".handle">
          <Draggable class="item" v-for="(item, index) in local.checklist" :key="index+item.name">
            <div @click.stop="checklistDone(item, index)">
              <Icon class="check space" :image="item.done ? 'check' : 'project'" :color="item.done ? '#aaa' : '#5a7ec7'" size="tiny"></Icon>
            </div>
            <input :class="{done: item.done}" type="text" ref="checklistItem" :value="item.name" @input="checklistInput(item, index, $event)" @keydown.enter="checklistNew(item, index, $event)" @keydown.delete="checklistDelete(item, index, $event)">
            <Icon class="handle space" image="handle" color="#aaa" size="tiny"></Icon>
          </Draggable>
        </Container>
      </div>
      <transition name="fade-right">
        <div v-if="local.tags">
          <div class="block tags">
            <div class="space item" v-for="item in local.tags" :key="item">
              {{item}}
            </div>
            <input type="text" v-model="temp.tag" @keyup.enter="tagCreate(temp.tag)" @keydown.delete="tagDelete()">
          </div>
        </div>
      </transition>
      <transition name="fade-right">
        <div v-if="hasDate()">
          <div class="block date">
            <Icon class="space" :image="isToday() ? 'star' : 'calendar'" :color="isToday() ? '#fbcd43' : '#aaa'"></Icon>
            <div @click.stop="active = (active == 'date-change' ? null : 'date-change')" class="date space">{{isToday() ? "Today" : buffer.date || local.date}}</div>
            <div @click.stop="setDate(false)" class="button">
              <Icon image="cross" size="tiny"></Icon>
            </div>
            <transition name="fade-in">
              <div class="menu" v-if="active == 'date-change'">
                <Cal @date="setDate($event)"></Cal>
              </div>
            </transition>
          </div>
        </div>
      </transition>
      <transition name="fade-right">
        <div v-if="local.deadline">
          <div class="block date">
            <Icon class="space" image="flag" color="#aaa"></Icon>
            <div @click.stop="active = (active == 'deadline-change' ? null : 'deadline-change')" class="date space">{{local.deadline}}</div>
            <div @click.stop="local.deadline = null" class="button">
              <Icon image="cross" size="tiny"></Icon>
            </div>
            <transition name="fade-in">
              <div class="menu" v-if="active == 'deadline-change'">
                <Cal @date="setDeadline()"></Cal>
              </div>
            </transition>
          </div>
        </div>
      </transition>
      <transition name="fold">
        <div v-if="!hasDate() || !local.tags || !hasChecklist() || !local.deadline">
          <div class="block toolbar">
            <div v-if="!hasDate()" :class="{item: true, active: active == 'date'}" @click.stop="activate('date')">
              <Icon class="space" image="calendar" color="#bbb"></Icon>
              <input placeholder="Date" ref="dateInput" type="text">
              <transition name="fade-in">
                <div v-if="active == 'date'" class="menu">
                  <div class="menu-item" @click.stop="setDate(dateToday)">
                    <Icon class="space" image="star" color="#fbcd43"></Icon>
                    <div>Today</div>
                  </div>
                  <!-- <div class="menu-item">
                    <Icon class="space" image="evening" color="lightblue"></Icon>
                    <div>This Evening</div>
                  </div> -->
                  <Cal @date="setDate($event)"></Cal>
                  <div class="menu-item" @click.stop="setDate('Someday')">
                    <Icon class="space" image="drawer" color="#d2bd82"></Icon>
                    <div>Someday</div>
                  </div>
                </div>
              </transition>
            </div>
            <div v-if="!local.tags" :class="{item: true, active: active == 'tags'}" @click.stop="activate('tags')">
              <Icon class="space" image="tag" color="#bbb"></Icon>
              <input placeholder="Tag" type="text" ref="tagInput" v-model="temp.tag" @keyup.enter="tagCreate(temp.tag)">
              <transition name="fade-in">
                <div v-if="active == 'tags'" class="menu">
                  <div @click.stop="tagCreate(tag)" class="menu-item" v-for="tag in tags" :key="tag">
                    {{tag}}
                  </div>
                </div>
              </transition>
            </div>
            <div v-if="!hasChecklist()" :class="{item: true, active: active == 'checklist'}" @click.stop="activate('checklist')">
              <Icon class="space" image="checklist" color="#bbb"></Icon>
              <input placeholder="Checklist" ref="checklistInput" type="text" @input="checklistCreate($event)">
            </div>
            <div v-if="!local.deadline" :class="{item: true, active: active == 'deadline'}" @click.stop="activate('deadline')">
              <Icon class="space" image="flag" color="#bbb"></Icon>
              <input placeholder="Deadline" ref="deadlineInput" type="text">
              <transition name="fade-in">
                <div v-if="active == 'deadline'" class="menu">
                  <Cal @date="local.deadline = $event ; activate(null)"></Cal>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
  .fade-right-enter-active { transition: opacity .5s, transform 1s, max-height 1s; }
  .fade-right-enter { opacity: 0; transform: translateX(10px); max-height: 0; }
  .fade-right-enter-to { opacity: 1; transform: translateX(0); max-height: 50px; }
  .fade-right-leave-active { transition: opacity .5s, transform 1s, max-height 1s; }
  .fade-right-leave { opacity: 1; max-height: 50px; }
  .fade-right-leave-to { opacity: 0; max-height: 0px; }

  .fade-in-enter-active { transform-origin: top center; transition: opacity .25s, transform .25s; }
  .fade-in-enter { opacity: 0; transform: scale(.9); }
  .fade-in-enter-to { opacity: 1; transform: scale(1); }
  .fade-in-leave-active { transform-origin: top center; transition: opacity .25s, transform .5s; }
  .fade-in-leave { opacity: 1; transform: scale(1); }
  .fade-in-leave-to { opacity: 0; transform: scale(0); }

  .fold-enter-active { transition: opacity .5s, max-height 1s; }
  .fold-enter { opacity: 0; max-height: 0; }
  .fold-enter-to { opacity: 1; max-height: 50px; }
  .fold-leave-active { transition: opacity 0s, max-height 1s; }
  .fold-leave { opacity: 0; max-height: 50px; }
  .fold-leave-to { opacity: 0; max-height: 0px; }

  .fold-small-enter-active { transition: opacity .5s, max-height .5s; }
  .fold-small-enter { opacity: 0; max-height: 0; }
  .fold-small-enter-to { opacity: 1; max-height: 15px; }
  .fold-small-leave-active { transition: opacity .5s, max-height .5s; }
  .fold-small-leave { opacity: 1; max-height: 15px; }
  .fold-small-leave-to { opacity: 0; max-height: 0px; }

  input, textarea { background: none; border: none; font-family: inherit; font-size: inherit; outline: none; }
  input { margin: 0; }

  .leave { animation: fold .5s forwards; }

  @keyframes fold {
    0% { max-height: 40px; }
    100% { max-height: 0px; padding-top: 0; padding-bottom: 0; opacity: 0; }
  }

  .space { margin-right: 5px; }

  .todo { border-radius: 5px; padding: 20px; transition: padding .5s, max-height .5s, box-shadow .25s, margin .5s; }
  .compact { cursor: pointer; user-select: none; max-height: 40px; padding: 5px 20px; overflow: hidden; transition: padding .5s, max-height .5s, box-shadow .25s, margin .5s; }
  .full { margin: 10px 0; background: white; animation: overflow .5s forwards; box-shadow: 0 2px 7px -1px rgba(0,0,0,.15); }

  @keyframes overflow {
    0% { overflow: hidden; }
    99% { overflow: hidden; }
    100% { overflow: visible; }
  }

  .block { margin-left: 21px; padding-bottom: 10px; }
  
  .block.name { margin-left: 0; display: flex; align-items: center; height: 40px; }
  .block.checklist { margin-left: 16px; }
  .block.name .details { user-select: none; }
  .block.name .check { width: 16px; display: flex; align-items: flex-end; justify-content: center; }
  .block.name .details { display: flex; flex-direction: column; flex-grow: 1; }
  .block.name .details .name { display: flex; align-items: center; }
  .block.name .details .name input { flex-grow: 1; }
  .block.name .details .name .deadline { display: flex; margin-left: auto; color: #ff5b79; }
  .block.name .details .name .tag { align-items: center; font-size: 12px; color: rgba(0,0,0,.5); padding: 0 7px; border-radius: 1000px; margin: 0 2px; border: 1px solid rgba(0,0,0,.25); }
  .block.name .area { font-size: 10px; color: rgba(0,0,0,.5); }
  
  .block.notes textarea { width: 100%; padding: 0; }
  
  .block.checklist .item { height: 37px; align-items: center; display: flex; border: 1px solid rgba(0,0,0,0); border-top-color: rgba(0,0,0,.1); padding: 7px 5px; }
  .block.checklist .item:last-child { border-bottom: 1px solid rgba(0,0,0,.1); }
  .block.checklist .item:focus-within { background: rgba(0,0,0,.05); border: 1px solid rgba(0,0,0,.1); border-radius: 3px; }
  .block.checklist .item:focus-within + .item { border-top-color: rgba(0,0,0,0); }
  .block.checklist .item input { flex-grow: 1; }
  .block.checklist .item input.done { color: #aaa; }
  .block.checklist .item .handle { margin-left: auto; cursor: pointer; }
  
  .block.tags { display: flex; }
  .block.tags .item { background: #bcdbd1; color: rgba(0,0,0,.4); font-weight: bold; padding: 0 10px; border-radius: 1000px; }
  
  .block.date { position: relative; display: flex; align-items: center; }
  .block.date .date { border: 1px solid rgba(0,0,0,0); border-radius: 3px; padding: 1px 3px; }
  .block.date .date:hover { border-color: rgba(0,0,0,.1); cursor: pointer; }
  .block.date .button:hover { cursor: pointer; }

  .block.toolbar { padding-bottom: 0px; display: flex; justify-content: flex-end; }
  .block.toolbar .item { justify-content: center; position: relative; display: flex; align-items: center; padding: 7px 9px; border: 1px solid rgba(0,0,0,0); border-radius: 3px; margin: 0 1px; }
  .block.toolbar .item .space { margin-right: 0; transition: all .5s; }
  .block.toolbar .item.active .space { margin-right: 5px; }
  .block.toolbar .item input { width: 0; transition: all .5s; opacity: 0; }
  .block.toolbar .item.active input { width: 120px; opacity: 1; }
  .block.toolbar .item.active { background: rgba(0,0,0,.1); }
  .block.toolbar .item:hover { border-color: rgba(0,0,0,.1); }
  .block.toolbar .item.active:hover { border-color: rgba(0,0,0,0); }
  
  .menu { min-width: 150px; z-index: 100; margin-bottom: 50px; top: 40px; position: absolute; background: #272b35; border-radius: 9px; color: rgba(255,255,255,.9); padding: 7px; }
  .menu-item { display: flex; padding: 5px; border-radius: 4px; cursor: pointer; }
  .menu-item:hover { color: rgba(255,255,255,.9); background: #5391f4; }

  .block.checklist .item.smooth-dnd-ghost { background: #d9e5ff; border-color: rgba(0,0,0,0); border-radius: 3px; }

  .compact.selected { background: #d9e5ff; }
</style>

<script>
  import { cloneDeep } from 'lodash'
  import Icon from "./TodoIcon.vue"
  import Cal from "./Cal.vue"
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

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  export default {
    props: ["data", "area", "tags", "selected"],
    components: { Icon, Cal, Container, Draggable },
    data: function() {
      return {
        local: cloneDeep(this.data),
        buffer: {
          date: null,
          done: null,
        },
        temp: {
          tag: null,
          checklist: cloneDeep(this.data.checklist),
        },
        active: null,
        full: null,
        leave: null,
      }
    },
    computed: {
      dateToday() {
        return new Date().toISOString().substring(0,10)
      }
    },
    watch: {
      local: {
        deep: true,
        handler(todoNew) {
          this.$emit("update", todoNew)
        },
      },
    },
    methods: {
      dateDayMonth() {
        let date = this.local.date.split('-')
        let month = months[date[1]]
        let day = date[2]
        return `${day} ${month}`
      },
      select() {
        this.$emit("select", this.local.uuid)
      },
      setDeadline() {
        this.$set(this.local, 'deadline', null)
      },
      hasChecklist() {
        return this.local.checklist && this.local.checklist.length >= 1
      },
      checklistCreate(event) {
        this.$set(this.local, "checklist", [{name: event.target.value}])
        this.$nextTick(() => {
         this.$refs["checklistItem"][0].focus()
        })
        event.preventDefault()
      },
      checklistNew(item, index, event) {
        this.local.checklist = [...this.local.checklist.slice(0, index+1), {name: ""}, ...this.local.checklist.slice(index+1)]
        this.$nextTick(() => {
          this.$refs["checklistItem"][index+1].focus()
        })
      },
      checklistDone(item, index) {
        let checklist = cloneDeep(this.local.checklist)
        checklist[index] = {...item, done: !checklist[index].done}
        this.local.checklist = checklist
        this.$emit("update", this.local)
      },
      checklistDelete(item, index, event) {
        if (event.target.value.length <= 0) {
          this.local.checklist = [...this.local.checklist].filter((e, i) => i != index)
          this.$nextTick(() => {
            if (this.$refs["checklistItem"][index-1]) {
              this.$refs["checklistItem"][index-1].focus()
            }
          })
        }
      },
      checklistDrop(item) {
        this.local.checklist = applyDrag(this.local.checklist, item)
      },
      todoDone() {
        this.$set(this.buffer, "done", !this.buffer.done)
        if (this.buffer.done) {
          this.full = false
          setTimeout(() => {
            this.todoLeave()
          }, 1000)
          setTimeout(() => {
            this.$set(this.local, "done", true)
          }, 2000)
        }
      },
      todoLeave() {
        this.leave = true
      },
      checklistInput(item, index, event) {
        this.local.checklist[index] = {...item, name: event.target.value}
        this.$emit("update", this.local)
      },
      tagCreate(tag) {
        if (this.local.tags && this.local.tags.filter(t => t == tag).length > 0) return
        if (!this.local.tags || this.local.tags == []) {
          this.$set(this.local, 'tags', [tag])
          return
        }
        if (tag && tag != "") {
          this.local.tags = [...this.local.tags, tag]
          this.temp.tag = null
        }
      },
      tagDelete() {
        if (!this.temp.tag || this.temp.tag === "") {
          this.local.tags = this.local.tags.slice(0,-1)
          if (this.local.tags.length == 0) this.local.tags = null
        }
      },
      hasDate() {
        if (this.buffer.date === null) {
          if (this.local.date) return true
          return false
        }
        if (this.buffer.date === false) return false
        if (this.buffer.date) return true
        return false
      },
      setDate(date) {
        this.buffer.date = date
        this.activate(null)
      },
      fullToggle(bool) {
        this.full = bool
        this.$nextTick(() => {
          if (bool && this.$refs["todoName"]) this.$refs["todoName"].focus()
        })
        if (this.buffer.date != null) {
          setTimeout(() => {
            this.todoLeave()
          }, 1000)
          setTimeout(() => {
            if (this.buffer.date != null) {
              this.local.date = this.buffer.date
            }
          }, 2000)
        }
        this.$emit("unfold", bool)
      },
      isToday() {
        return (this.buffer.date || this.local.date) == this.dateToday
      },
      activate(state) {
        this.active = state
        let input = this.$refs[`${state}Input`]
        if (state && input) input.focus()
      },
    },
  }
</script>
