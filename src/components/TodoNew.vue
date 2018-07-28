<template>
  <div v-if="!data.done" :class="{new: true, full: full, compact: !full, selected: selected, done: done, leave: leave, fadeOut: fadeOut}" :style="{maxHeight: height()}" @click.stop="select" @dblclick.stop="fullToggle">
    <div class="row name">
      <div class="check" @click.prevent="todoComplete(true, data.uuid)">
        <svg v-if="!done" class="checkbox" xmlns="http://www.w3.org/2000/svg" fill="gray" width="12" height="12" viewBox="0 0 24 24"><path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z"/></svg>
        <svg v-if="done" class="checkbox" xmlns="http://www.w3.org/2000/svg" fill="#215abc" width="12" height="12" viewBox="0 0 24 24"><path d="M19 0h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-8.959 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591z"/></svg>
      </div>
      <input ref="name" type="text" placeholder="New To-Do" v-model="data.name" v-if="full" @keydown.enter="full = !full">
      <span v-if="!full" class="name">
        {{data.name || "New To-Do"}}
      </span>
      <svg v-if="!full && data.checklist" class="icon" xmlns="http://www.w3.org/2000/svg" fill="#bbb" width="12" height="12" viewBox="0 0 24 24"><path d="M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z"/></svg>
      <div class="tag" v-for="(tag, index) in data.tags" :key="index" v-if="!full">
        {{tag}}
      </div>
    </div>
    <div :class="{anim: true, on: full, off: !full}" :style="{maxHeight: full ? (350 + 50 * (data.checklist ? data.checklist.length : 0) + 'px') : '0px'}">
      <div class="row notes">
        <input type="text" placeholder="Notes" v-model="data.description">
      </div>
      <transition name="slide-from-left">
        <div class="row checklist" v-if="data.checklist && data.checklist.length > 0">
          <div :class="{item: true, active: item.active}" v-for="(item, index) in data.checklist" :key="index">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#5a7ec7" width="12" height="12" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
            <input type="text" v-model="item.name" ref="checklistItem" @keydown.enter="checklistItemNew" @keydown.delete="checklistDelete(index)">
          </div>
        </div>
      </transition>
      <transition name="slide-from-left">
        <div class="row tags" v-if="data.tags && data.tags.length > 0">
          <div class="tag" v-for="(tag, index) in data.tags" :key="index">
            {{tag}}
          </div>
          <div style="position: relative">
            <input type="text" ref="tagInput" v-model="tag" @keydown.enter="tagCreate(tag)" @keydown.delete="tagDelete($event)">
            <transition name="fade-in">
              <div class="menu" v-if="tag && tagsStore.length > 0">
                <div class="item" @click.stop="tagAdd(tag)" v-for="(tag, index) in tagsStore" :key="index">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 24 24"><path d="M9.776 2l11.395 11.395-7.78 7.777-11.391-11.391v-7.781h7.776zm.829-2h-10.605v10.609l13.391 13.391 10.609-10.604-13.395-13.396zm-3.191 7.414c-.781.782-2.046.782-2.829.001-.781-.783-.781-2.048 0-2.829.782-.782 2.048-.781 2.829-.001.782.783.781 2.047 0 2.829z"/></svg>
                  <span>{{tag}}</span>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </transition>
      <transition name="slide-from-left">
        <div class="row date" v-if="date && date != 'Inbox'">
          <svg v-if="date === new Date().toISOString().substring(0,10)" class="icon" xmlns="http://www.w3.org/2000/svg" fill="#fbcd43" width="16" height="16" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
          <svg v-if="date === 'This evening'" class="icon" xmlns="http://www.w3.org/2000/svg" fill="lightblue" width="16" height="16" viewBox="0 0 24 24"><path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"/></svg>
          <svg v-if="date === 'Someday'" class="icon" xmlns="http://www.w3.org/2000/svg" fill="#d2bd82" width="16" height="16" viewBox="0 0 24 24"><path d="M1.8 9l-.8-4h22l-.8 4h-2.029l.39-2h-17.122l.414 2h-2.053zm18.575-6l.604-2h-17.979l.688 2h16.687zm3.625 8l-2 13h-20l-2-13h24zm-8 4c0-.552-.447-1-1-1h-6c-.553 0-1 .448-1 1s.447 1 1 1h6c.553 0 1-.448 1-1z"/></svg>
          <strong>{{today(date)}}</strong>
          <span class="delete" @click.stop="dateDelete">🞩</span>
        </div>
      </transition>
      <div class="row parameters">
        <div :class="{button: true, active: active === 'date'}" v-if="showDate()" @click.stop="activate('date')">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#bbb" width="16" height="16" viewBox="0 0 24 24"><path d="M20 20h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm6 0h-4v4h4v-4zm-6-6h-4v4h4v-4zm16-8v22h-24v-22h3v1c0 1.103.897 2 2 2s2-.897 2-2v-1h10v1c0 1.103.897 2 2 2s2-.897 2-2v-1h3zm-2 6h-20v14h20v-14zm-2-7c0-.552-.447-1-1-1s-1 .448-1 1v2c0 .552.447 1 1 1s1-.448 1-1v-2zm-14 2c0 .552-.447 1-1 1s-1-.448-1-1v-2c0-.552.447-1 1-1s1 .448 1 1v2z"/></svg>
          <transition name="slide-from-left">
            <div v-if="active === 'date'">
              <input type="text" placeholder="Date" ref="dateSearch">
            </div>
          </transition>
          <transition name="fade-in">
            <div class="menu" v-if="active === 'date'">
              <div class="item" @click.stop="setDate(new Date().toISOString().substring(0,10))">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#fbcd43" width="16" height="16" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                <span>Today</span>
              </div>
              <div class="item" @click.stop="setDate('This Evening')">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="lightblue" width="16" height="16" viewBox="0 0 24 24"><path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"/></svg>
                <span>This evening</span>
              </div>
              <div class="item" @click.stop="setDate('Someday')">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#d2bd82" width="16" height="16" viewBox="0 0 24 24"><path d="M1.8 9l-.8-4h22l-.8 4h-2.029l.39-2h-17.122l.414 2h-2.053zm18.575-6l.604-2h-17.979l.688 2h16.687zm3.625 8l-2 13h-20l-2-13h24zm-8 4c0-.552-.447-1-1-1h-6c-.553 0-1 .448-1 1s.447 1 1 1h6c.553 0 1-.448 1-1z"/></svg>
                <span>Someday</span>
              </div>
            </div>
          </transition>
        </div>
        <div :class="{button: true, active: active === 'tags'}" v-if="!data.tags || data.tags.length <= 0" @click.stop="activate('tags')">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#bbb" width="16" height="16" viewBox="0 0 24 24"><path d="M9.776 2l11.395 11.395-7.78 7.777-11.391-11.391v-7.781h7.776zm.829-2h-10.605v10.609l13.391 13.391 10.609-10.604-13.395-13.396zm-3.191 7.414c-.781.782-2.046.782-2.829.001-.781-.783-.781-2.048 0-2.829.782-.782 2.048-.781 2.829-.001.782.783.781 2.047 0 2.829z"/></svg>
          <transition name="slide-from-left">
            <div v-if="active === 'tags'">
              <input type="text" ref="tagSearch" placeholder="Tags" v-model="tag" @keyup.enter="tagCreate(tag)">
            </div>
          </transition>
          <transition name="fade-in">
            <div class="menu" v-if="active === 'tags' && tagsStore && tagsStore.length > 0">
              <div class="item" @click.stop="tagAdd(tag)" v-for="(tag, index) in tagsStore" :key="index">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="white" width="16" height="16" viewBox="0 0 24 24"><path d="M9.776 2l11.395 11.395-7.78 7.777-11.391-11.391v-7.781h7.776zm.829-2h-10.605v10.609l13.391 13.391 10.609-10.604-13.395-13.396zm-3.191 7.414c-.781.782-2.046.782-2.829.001-.781-.783-.781-2.048 0-2.829.782-.782 2.048-.781 2.829-.001.782.783.781 2.047 0 2.829z"/></svg>
                <span>{{tag}}</span>
              </div>
            </div>
          </transition>
        </div>
        <div :class="{button: true, active: active === 'checklist'}" v-if="!data.checklist || data.checklist.length <= 0" @click.stop="activate('checklist')">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#bbb" width="16" height="16" viewBox="0 0 24 24"><path d="M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z"/></svg>
          <transition name="slide-from-left">
            <input v-if="active === 'checklist'" ref="checklistSearch" type="text" placeholder="Checklist" @keydown="checklistCreate($event)">
          </transition>
        </div>
        <div :class="{button: true, active: active === 'deadline'}" @click.stop="activate('deadline')">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="#bbb" width="16" height="16" viewBox="0 0 24 24"><path d="M17 8.031l4-6.031h-16v-2h-2v24h2v-10h16l-4-5.969zm-12-4.031h12.273l-2.677 4.037 2.656 3.963h-12.252v-8z"/></svg>
          <transition name="slide-from-left">
            <input v-if="active === 'deadline'" ref="deadlineSearch" type="date" placeholder="Deadline">
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .leave.new.compact { overflow: hidden; max-height: 0; padding-top: 0; padding-bottom: 0; }

  @keyframes bloop {
    0% { overflow: hidden; }
    99% { overflow: hidden; }
    100% { overflow: visible; }
  }

  * { font-family: "Roboto", sans-serif; }
  .anim { transition: all .25s; }
  .anim.off { max-height: 0; overflow: hidden; }
  .anim.on { max-height: 300px; }
  .check { transition: all .5s; }
  .check:active { transform: scale(1.2); }
  .compact.done .name { color: rgba(0,0,0,.25); }
  .new { transition: padding .5s, margin .5s, max-height .5s, background-color .5s; padding: 7px 20px; margin-left: 40px; margin-right: 40px; }
  .new.selected { background: rgba(0, 81, 255, .15); border-radius: 5px; }
  .new.compact { transition: padding .5s, margin .5s, max-height .5s, background-color 0s; cursor: pointer; user-select: none; max-height: 25px; }
  .new.full { transition: padding .5s, margin .5s, max-height .5s, background-color .5s; animation: .1s bloop forwards; background: white; max-height: 300px; box-shadow: 0 1px 3px 1px rgba(0,0,0,.1); padding: 20px; margin-left: 40px; margin-right: 40px; margin-bottom: 20px; margin-top: 20px; border-radius: 5px; }
  .new .row.name { margin-bottom: 10px; }
  .new .checkbox { margin-right: 10px; }
  .new input { border: none; outline: none; font-size: inherit; background: none; }
  .new .row { margin-left: 22px; margin-bottom: 15px; }
  .new .row.name { margin-left: 0; margin-bottom: 0; display: flex; align-items: center; }
  .new .row.name .icon { margin: 0 5px; }
  .new .row.name input { width: 80%; background: none; }
  .new .row.name .tag { font-size: 12px; color: rgba(0,0,0,.5); padding: 0 7px; border-radius: 1000px; margin: 0 2px; border: 1px solid rgba(0,0,0,.25); }
  .new .row.name .name { margin-right: 5px; }
  .new .row.notes { margin-top: 10px; }
  .new .row.parameters { display: flex; justify-content: flex-end; align-content: center; margin-bottom: 0; margin-top: 15px; }
  .new .row.parameters .button { transition: width .5s; position: relative; width: 20px; height: 20px; margin-right: 2px; display: flex; justify-content: center; border-radius: 3px; align-content: center; padding: 5px; border: 1px solid transparent; }
  .new .row.parameters .button:hover { border-color: rgba(0,0,0,.1); }
  .active { background: rgba(0,0,0,.1); border-color: transparent; }
  .new .row.parameters .button.active:hover { border-color: transparent; }
  .button input { background: none; border: none; width: 120px; }
  .new .row.parameters .button.active { width: 140px; }
  .active .icon { margin-right: 5px; }
  .menu { min-width: 150px; position: absolute; top: 40px; background: #272b35; color: white; border-radius: 5px; padding: 5px; }
  .menu .item { cursor: pointer; display: flex; align-items: center; padding: 3px 5px; border-radius: 2px; }
  .menu .item:hover { background: #5391f4; }
  .tags { display: flex; position: relative; }
  .tags .tag { margin-right: 5px; background: #bcdbd1; color: rgba(0,0,0,.4); font-weight: bold; padding: 0 10px; border-radius: 1000px; }
  .slide-from-left-enter { opacity: 0; height: 0; transform: translateX(10px); }
  .slide-from-left-enter-active { transition: all .5s; }
  .fade-in-enter { opacity: .5; }
  .fade-in-enter-active { transition: all 1s; }
  .row.checklist { margin-left: 16px; }
  .checklist .item { height: 20px; display: flex; align-items: center; border-top: 1px solid rgba(0,0,0,.1); padding: 7px; }
  .checklist .item:last-child { border-bottom: 1px solid rgba(0,0,0,.1); }
  .checklist .item:focus-within { background: rgba(0,0,0,.05); border-radius: 3px; border: 1px solid rgba(0,0,0,.1); padding-left: 6px; padding-right: 6px; }
  .checklist .item:focus-within + .item { border-top: none; }
  .icon { margin-right: 5px; }
  .checklist .item input { background: none; border: none; width: 100%; }
  .row.date { display: flex; align-items: center; }
  .row.date .delete { color: rgba(0,0,0,.5); margin: 0 5px; cursor: pointer; }

  .fadeOut { animation: fade-out 1s forwards; }

  @keyframes fade-out {
    0% { opacity: 1; }
    80% { transform: scale(1); }
    100% { opacity: 0; transform: scale(.95); }
  }
</style>

<script>
  import {store} from "../store.js"
  import includes from "lodash/includes"
  import map from "lodash/map"
  import lowerCase from "lodash/lowerCase"
  import filter from "lodash/filter"
  import cloneDeep from "lodash/cloneDeep"

  export default {
    props: ["dat", "selected"],
    data: function() {
      return {
        date: null,
        tags: null,
        tag: null,
        checklist: null,
        deadline: null,
        active: false,
        full: null,
        done: null,
        leave: null,
        fadeOut: null,
        data: cloneDeep(this.dat),
      }
    },
    mounted() {
      this.date = this.data.date
    },
    watch: {
      data: {
        deep: true,
        handler(todoNew) {
          store.dispatch("todoUpdate", todoNew)
        },
      },
      full(o, n) {
        if (n) {
          if (this.date) {
            this.data.date = this.date
          }
          // this.$set(this.data, "date", null)
          // if (this.date === "Today") {
          //   this.data.date = new Date().toISOString().substring(0,10)
          // } else {
          //   this.data.date = this.$nextTickdate
          // }
        }
      }
    },
    computed: {
      tagsStore() {
        return filter(store.state.tags, (tag) => {
          let match = lowerCase(tag).indexOf(lowerCase(this.tag)) !== -1;
          let exist = includes(map(this.tags, lowerCase), lowerCase(tag));
          return match && !exist
        })
      },
    },
    methods: {
      activate(param) {
        this.active = param;
        this.$nextTick(() => {
          this.$refs.tagSearch && this.$refs.tagSearch.focus()
          this.$refs.deadlineSearch && this.$refs.deadlineSearch.focus()
          this.$refs.dateSearch && this.$refs.dateSearch.focus()
          this.$refs.checklistSearch && this.$refs.checklistSearch.focus()
        })
      },
      dateDelete() {
        this.date = null;
        this.active = null
      },
      tagAdd(tag) {
        if (!this.data.tags) this.$set(this.data, 'tags', [])
        this.data.tags = [...this.data.tags, tag];
        this.tag = null;
        this.$nextTick(() => {
          this.active = null
          if (this.$refs.tagInput) this.$refs.tagInput.focus()
        })
      },
      tagCreate(tag) {
        let exist = includes(map(this.tagsStore, lowerCase), lowerCase(tag));
        let already = includes(map(this.data.tags, lowerCase), lowerCase(tag));
        if (!exist) {
          this.tagAdd(tag)
        }
        if (!already)
          store.commit("tagCreate", tag)
      },
      tagDelete(e) {
        if (!this.tag || this.tag === "") { this.data.tags.pop() }
      },
      checklistCreate(e) {
        this.active = null
        this.$set(this.data, "checklist", [])
        this.data.checklist = [...this.data.checklist, {name: e.key}]
        this.$nextTick(() => {
          this.$refs.checklistItem[0].focus()
        })
      },
      checklistItemNew() {
        if (!this.data.checklist) this.$set(this.data, "checklist", [])
        this.data.checklist = [...this.data.checklist, {name: null}]
        this.$nextTick(() => {
          this.$refs.checklistItem[this.$refs.checklistItem.length-1].focus()
        })
      },
      checklistDelete(index) {
        let item = this.$refs.checklistItem
        let name = this.data.checklist[index].name
        if (!name || name.length <= 0) {
          this.data.checklist.splice(index,1)
          if (item[index-1] && this.data.checklist.length >= 1) item[index-1].focus()
        }
      },
      fullToggle() {
        if (this.full && this.data.date != this.date) {
          this.fadeOut = true
          setTimeout(() => {
            this.data.date = this.date
          }, 1000)
        }
        this.full = !this.full
        this.$nextTick(() => {
          if (this.$refs["name"]) this.$refs["name"].focus()
          this.$emit("full")
        })
      },
      select() {
        this.$emit("select", this.data.uuid)
        if (this.full) {
          this.active = null
        }
      },
      todoComplete(bool, uuid) {
        this.full = false;
        this.done = true;
        setTimeout(() => {
          this.leave = true
        }, 1000)
        setTimeout(() => {
          this.$set(this.data, "done", true)
        }, 1500)
      },
      setDate(date) {
        this.date = date
        this.active = false;
        // this.$set(this.data, "date", null)
        // if (date === "Today") {
        //   this.data.date = new Date().toISOString().substring(0,10)
        // } else {
        //   this.data.date = date
        // }
      },
      showDate() {
        if (this.date == "Inbox" || this.date == "Inbox" || !this.date) return true
        if (this.date == "Someday" || this.date == "Someday") return false;
        return true;
      },
      today(date) {
        return date === new Date().toISOString().substring(0,10) ? "Today" : date
      },
      height() {
        if (!this.leave) {
          if (this.full) {
            return (350 + 50 * (this.data.checklist ? this.data.checklist.length : 0)) + "px"
          } else {
            return "30px"
          }
        } else {
          return "0px"
        }
      },
      deselect() {
        if (this.full && this.data.date != this.date) {
          this.fadeOut = true
          setTimeout(() => {
            this.data.date = this.date
          }, 1000)
        }
        this.full = false;
        this.$emit("full")
      },
    },
  }
</script>