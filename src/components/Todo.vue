<template>
  <div>
    <div :class="['todo__list__item']">
      <div :class="['todo__list__main', {selected, 'todo__list__main_expanded': expanded}]"
           @click.stop="select"
           @dblclick.stop="expand">
        <div class="todo__calendar">
          <base-icon fill="#bdc0c2" width="12" height="12" image="calendar-4-svg"/>
        </div>
        <div class="todo__list__main__title">
          <div class="todo__main__title__checkbox">
            <base-icon image="checkbox-11-svg"
                       :fill="selected && !expanded ? '#a1b3cc' : '#c8cacd'"
                       width="11"
                       height="11"/>
          </div>
          <base-icon class="todo__list__main__title__icon"
                     v-if="todo.date == todayDate && !expanded && showTodayIcon"
                     fill="#f1ca00"
                     image="star-3-svg"
                     style="margin-left: 0;"
                     width="13"
                     height="13"/>
          <div tabindex="0"
               class="todo__list__main__title__text"
               :contenteditable="expanded"
               placeholder="New Todo"
               @blur="todo.name = $event.target.innerText">
            {{!todo.name || todo.name == '' ? 'New Todo' : todo.name}}
          </div>
          <base-icon class="todo__list__main__title__icon"
                     v-if="todo.notes && !expanded"
                     :fill="selected && !expanded ? '#a1b3cc' : '#c8cacd'"
                     image="file-3-svg"
                     width="10"
                     height="10"/>
          <base-icon class="todo__list__main__title__icon"
                     v-if="todo.checklist && !expanded"
                     :fill="selected && !expanded ? '#a1b3cc' : '#c8cacd'"
                     image="menu-2-svg"
                     width="10"
                     height="10"/>
          <div class="todo__list__main__title__tag-list" v-if="!expanded">
            <div class="todo__list__main__title__tag-list__item" v-for="tag in tagListLocal" :key="tag.id">
              {{tag.name}}
            </div>
          </div>
          <base-icon class="todo__list__main__title__icon"
                     v-if="todo.deadline && !expanded"
                     :fill="selected && !expanded ? '#a1b3cc' : '#c8cacd'"
                     image="flag-7-svg"
                     style="margin-left: auto;"
                     width="12"
                     height="12"/>
        </div>
        <transition-expand>
          <div v-if="expanded">
            <todo-notes class="todo__list__main__body" v-model="todo.notes"/>
            <transition name="slide">
              <todo-checklist style="padding: 0 35px" v-model="todo.checklist"/>
            </transition>
            <transition name="slide">
              <div class="todo__list__main__body" v-if="expanded && todo.tagList && todo.tagList.length > 0">
                <div class="todo__list__main__body__tag-list">
                  <div class="todo__list__main__body__tag-list__item"
                       v-for="tag in todo.tagList.map(tag => find(tagList, ['id', tag]))"
                       tabindex="0"
                       @keydown.backspace="tagRemove(tag)"
                       :key="tag.id">
                    {{tag.name}}
                  </div>
                  <div>
                    <input placeholder="Tag"
                           ref="tag-input"
                           class="todo__list__main__body__tag-list__input"
                           type="text"
                           v-model="tagSearch"
                           @keyup.backspace="!$event.target.value ? todo.tagList.pop() : null"
                           @keyup.enter="$event.target.value ? tagAdd({name: $event.target.value}) : null"
                           @click.stop="mode = 'button-tags'">
                    <transition name="fade">
                      <popup-tags v-if="mode == 'button-tags'"
                                  :value="tagListFiltered()"
                                  @input="tagAdd($event); $refs['tag-input'].focus()"/>
                    </transition>
                  </div>
                </div>
              </div>
            </transition>
            <transition name="slide">
              <div class="todo__list__main__body" v-if="expanded && todo.date">
                <div class="todo__list__main__body__date">
                  <div class="todo__list__main__body__date__button" @click.stop="mode = 'button-date'">
                    <base-icon v-if="todo.date == todayDate && !todo.evening"
                               image="star-3-svg"
                               fill="#f1ca00"
                               width="14"
                               height="14"/>
                    <base-icon v-if="todo.date == todayDate && todo.evening"
                               fill="#a3bde2"
                               width="14"
                               height="14"
                               image="weather-114-svg"/>
                    <base-icon v-if="todo.date && todo.date != todayDate && !todo.someday"
                               fill="#fd306c"
                               width="14"
                               height="14"
                               image="calendar-4-svg"/>
                    <base-icon v-if="todo.someday"
                               fill="#b5a96a"
                               width="14"
                               height="14"
                               image="archive-11-svg"/>
                    <div class="todo__list__main__body__date__text">
                      <div v-if="todo.date == todayDate && !todo.evening">Today</div>
                      <div v-if="todo.date == todayDate && todo.evening">This Evening</div>
                      <div v-if="todo.date && todo.date != todayDate && todo.someday">Someday</div>
                      <div v-if="todo.date && todo.date != todayDate && !todo.someday">{{todo.date}}</div>
                    </div>
                    <div class="todo__list__main__body__date__close"
                        @click.stop="todo = {...todo, date: null, evening: null, someday: null}">✕</div>
                  </div>
                  <transition name="fade">
                    <popup-date style="margin-top: 25px;"
                                v-if="mode == 'button-date'"
                                @input="todo = {...todo, ...$event}; mode = null"/>
                  </transition>
                </div>
              </div>
            </transition>
            <transition name="slide">
              <div class="todo__list__main__body" v-if="expanded && todo.deadline">
                <div class="todo__list__main__body__date">
                  <div class="todo__list__main__body__date__button" @click.stop="mode = 'button-deadline'">
                    <base-icon image="calendar-4-svg" width="12" height="12"/>
                    <div class="todo__list__main__body__date__text">
                      <div>Deadline: {{todo.deadline}}</div>
                    </div>
                    <div class="todo__list__main__body__date__close" @click.stop="todo = {...todo, deadline: null}">✕</div>
                  </div>
                  <transition name="fade">
                    <popup-deadline style="margin-top: 25px;"
                                    v-if="mode == 'button-deadline'"
                                    @input="$set(todo, 'deadline', $event); mode = null"/>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
        </transition-expand>
        <div class="todo__list__toolbar" v-if="expanded">
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-date'}]"
              v-if="!todo.date && !todo.someday && !todo.evening"
              @click.stop="toolbarClick('toolbar-date')">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <base-icon image="calendar-4-svg" fill="#aaa" width="14" height="14"/>
              </div>
              <input placeholder="When" ref="toolbar-date" class="todo__list__toolbar__input"/>
            </div>
            <popup-date v-if="mode == 'toolbar-date'" @input="todo = {...todo, ...$event}; mode = null"/>
          </div>
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-tags'}]"
              v-if="!todo.tagList || todo.tagList.length <= 0"
              @click.stop="toolbarClick('toolbar-tags')">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <base-icon image="tag-2-svg" fill="#aaa" width="14" height="14"/>
              </div>
              <input placeholder="Tags" ref="toolbar-tags" class="todo__list__toolbar__input"/>
            </div>
            <popup-tags :value="tagList"
                        @input="$set(todo, 'tagList', [...$event.id]); mode = null"
                        v-if="mode == 'toolbar-tags'"/>
          </div>
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-checklist'}]"
              @click.stop="toolbarClick('toolbar-checklist')"
              v-if="!todo.checklist || (todo.checklist && todo.checklist.length <= 0)">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <base-icon image="menu-2-svg" fill="#aaa" width="14" height="14"/>
              </div>
              <input placeholder="Checklist"
                    ref="toolbar-checklist"
                    @input="checklistAdd($event.target.value); mode = null"
                    class="todo__list__toolbar__input"/>
            </div>
          </div>
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-deadline'}]"
              @click.stop="toolbarClick('toolbar-deadline')"
              v-if="!todo.deadline">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <base-icon image="flag-8-svg" fill="#aaa" width="14" height="14"/>
              </div>
              <input placeholder="Deadline" ref="toolbar-deadline" class="todo__list__toolbar__input"/>
            </div>
            <div v-if="mode == 'toolbar-deadline'">
              <popup-deadline style="right: -40px;" @input="$set(todo, 'deadline', $event)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .todo__list__item { user-select: none; position: relative; transition: all .35s; }
  .todo__list__main.todo__list__main_expanded { transition: all .35s; padding-top: 20px; padding-bottom: 50px; background: #fff; box-shadow: 0 1px 5px 0 rgba(0,0,0,.15); }
  .todo__main__title__checkbox { position: absolute; transition: all .35s; left: 8px; padding: 3px 0; }
  .todo__list__main_expanded .todo__main__title__checkbox { left: 18px; }
  .todo__list__main__title { transition: all .35s; padding-left: 30px; padding-right: 8px; display: flex; align-items: center; }
  .todo__list__main_expanded .todo__list__main__title { padding-left: 40px; padding-right: 40px; }
  .todo__list__main__body { transition: all .35s; padding-left: 30px; padding-right: 30px; }
  .todo__list__main_expanded .todo__list__main__body { padding-left: 40px; padding-right: 40px; }
  .todo__list__main { padding: 5px 10px 5px 0; }
  .todo__calendar { position: absolute; left: -20px; opacity: 0; }
  .todo__calendar:hover { opacity: 1; }
  .todo__list__main__body__notes { margin: 10px 0; }
  .todo__textarea { padding: 0 0 15px 0; resize: none; width: 100%; }
  .todo__list__main__title__text { outline: none; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
  .todo__list__main__title__text:empty:before{ color: #777; content: attr(placeholder); display: block; }
  .todo__list__main__title__icon { margin: 0 3px; }

  .todo__list__main__title__tag-list { display: flex; }
  .todo__list__main__title__tag-list__item { color: rgba(0,0,0,.3); font-size: 11px; border: 1px solid rgba(0,0,0,.2); border-radius: 1000px; padding: 0 7px; margin: 0 2px; }

  .sortable-ghost { opacity: 1 !important; background-color: #f0f0f0; border-radius: 3px; }
  .sortable-ghost * { opacity: 0; }
  .sortable-fallback { background-color: #cee2fe; opacity: 1 !important; border-radius: 3px; }

  .selected { background-color: #cee2fe; border-radius: 3px; }

  .todo__list__toolbar { position: absolute; right: 0; bottom: 0; padding: 0 10px 15px; display: flex; }
  .todo__list__toolbar__container { overflow: hidden; width: 25px; transition: width .35s; margin: 0 3px; border-radius: 3px; }
  .todo__list__toolbar__container:hover { box-shadow: inset 0 0 0 1px #eeeff1, inset 0 0 0 1px #eeeff1; }
  .todo__list__toolbar__container:active { background-color: #eeeff1; }
  .todo__list__toolbar__container_expanded { width: 110px; }
  .todo__list__toolbar__container_expanded .todo__list__toolbar__button { background-color: #eeeff1; }
  .todo__list__toolbar__button { padding: 4px 6px; display: flex; justify-content: flex-start; align-items: center; }
  .todo__list__toolbar__icon { display: flex; align-items: center; justify-content: center; }
  .todo__list__toolbar__input { width: 100%; background-color: transparent; border: none; font-size: inherit; font-family: inherit; outline: none; color: rgb(153, 153, 153); padding: 0 5px; }

  .todo__list__toolbar__popup { box-shadow: 0 5px 10px 0 rgba(0,0,0,.2); z-index: 1000; padding: 6px 0; position: absolute; color: white; background-color: #2b323b; margin-top: 3px; margin-bottom: 10px; width: 230px; border-radius: 7px; }
  .todo__list__toolbar__popup__item { margin: 0 6px; display: flex; align-items: center; border-radius: 4px; padding: 3px 4px; }
  .todo__list__toolbar__popup__item:hover { background-color: #5d9cf5; }

  .todo__list__main__body__date { min-height: 1em; margin: 10px 0; font-weight: 500; display: flex; }
  .todo__list__main__body__date__button { display: flex; align-items: center; padding: 0 0 0 3px; border-radius: 4px; }
  .todo__list__main__body__date__button:hover { box-shadow: inset 0 0 0 1px #eeeff1, inset 0 0 0 1px #eeeff1; }
  .todo__list__main__body__date__button:hover .todo__list__main__body__date__close { opacity: 1; }
  .todo__list__main__body__date__text { margin: 0 5px 0; }
  .todo__list__main__body__date__close { font-size: 11px; padding: 3px 6px; border-radius: 4px; opacity: 0; }
  .todo__list__main__body__date__close:hover { background-color: #eeeff1; }

  .slide-enter-active { transition: transform .35s, opacity .5s; }
  .slide-enter { transform: translateX(50px); opacity: 0; }
  .slide-enter-to { transform: translateX(0px); opacity: 1; }

  .todo__list__main__body__tag-list { margin: 10px 0; display: flex; flex-wrap: wrap; }
  .todo__list__main__body__tag-list__item { border-radius: 1000px; background-color: #bce1d3; color: #298461; margin: 2px 4px 2px 0; font-size: 13px; font-weight: 500; padding: 1px 10px; }
  .todo__list__main__body__tag-list__input { font-family: inherit; font-size: inherit; border: none; background-color: transparent; outline: none; }
  .todo__list__main__body__tag-list__item:focus { background-color: #bed7fb; color: #5081c6; outline: none; }

  .fade-enter-active { transition: all .1s; transform-origin: top; }
  .fade-enter { transform: scale(.9); opacity: .9; }
  .fade-enter-to { transform: scale(1); opacity: 1; }
</style>

<script>
  import { range, chunk, flatten, filter, find, includes } from 'lodash'
  import uuidv1 from 'uuid/v1'
  import draggable from "vuedraggable"
  import TransitionExpand from '@/components/TransitionExpand.vue'
  import ResizableTextarea from '@/components/ResizableTextarea.vue'
  import PopupDate from '@/components/PopupDate.vue'
  import PopupTags from '@/components/PopupTags.vue'
  import PopupDeadline from '@/components/PopupDeadline.vue'
  import BaseIcon from '@/components/BaseIcon.vue'
  import TodoNotes from '@/components/TodoNotes.vue'
  import TodoChecklist from '@/components/TodoChecklist.vue'

  export default {
    components: {
      ResizableTextarea,
      PopupDate,
      PopupTags,
      PopupDeadline,
      draggable,
      BaseIcon,
      TransitionExpand,
      TodoNotes,
      TodoChecklist,
    },
    props: {
      value: Object,
      selected: Boolean,
      expanded: Boolean,
      showTodayIcon: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        todo: this.value,
        mode: null,
        tagSearch: null,
        tagSelected: null,
      }
    },
    watch: {
      expanded(newValue, collapsing) {
        if (collapsing) this.entityUpdate(this.todo)
      },
    },
    computed: {
      todayDate() {
        return new Date().toISOString().slice(0,10)
      },
      tagList() {
        return this.$store.state.entityList.filter(entity => entity.type == 'tag')
      },
      tagListLocal() {
        return this.todo.tagList && this.todo.tagList.map(tag => find(this.tagList, ['id', tag]))
      },
    },
    methods: {
      entityUpdate(todo) {
        this.$store.dispatch('entityUpdate', todo)
      },
      tagListFiltered() {
        return filter(this.tagList, tag => {
          const notYetAdded = !includes(this.todo.tagList, tag.id)
          const matchesSearch = tag.name && this.tagSearch && tag.name.toLowerCase().match(this.tagSearch.toLowerCase())
          return notYetAdded && matchesSearch
        })
      },
      tagRemove(tag) {
        this.todo.tagList = filter(this.todo.tagList, t => t != tag.id)
      },
      async tagAdd(tag) {
        this.tagSearch = null
        let inStore
        let id = tag.id
        if (tag.name) {
          inStore = includes(this.tagList.map(tag => tag.name.toLowerCase()), tag.name.toLowerCase())
        }
        if (tag.id && !includes(this.todo.tagList, id)) {
          id = tag.id
        }
        if (!tag.id && tag.name && inStore) {
          id = find(this.tagList, (t) => t.name.toLowerCase() == tag.name.toLowerCase()).id
        }
        if (!tag.id && tag.name && !inStore) {
          id = (await this.$store.dispatch('entityCreate', {type: 'tag', name: tag.name})).id
        }
        if (!includes(this.todo.tagList, id)) {
          this.todo.tagList = [...this.todo.tagList, id]
        }
      },
      select() {
        if (this.expanded) {
          if (this.mode) this.mode = null
          return
        }
        this.$emit('select', this.todo)
        this.$emit('expand', null)
      },
      expand() {
        this.mode = null
        if (this.expanded) return
        this.$emit('expand', this.todo)
      },
      checklistAdd(title) {
        this.$set(this.todo, 'checklist', [{title, id: uuidv1()}])
        this.$nextTick(() => this.$refs[`checklist-${0}`][0].focus())
      },
      // checklistPush(index) {
      //   this.todo.checklist.splice(index+1, 0, {id: uuidv1()})
      //   this.$nextTick(() => this.$refs[`checklist-${index+1}`][0].focus())
      // },
      // checklistFocus(index, event) {
      //   const cursorPosition = event.target.selectionStart
      //   console.log(event)
      //   event.preventDefault()
      //   const sibling = this.$refs[`checklist-${index}`]
      //   if (sibling && sibling[0]) {
      //     sibling[0].focus()
      //     sibling[0].selectionStart = cursorPosition
      //     sibling[0].selectionEnd = cursorPosition
      //   }
      // },
      // checklistBackspace(item, event, index) {
      //   const prevChecklist = this.$refs[`checklist-${index-1}`] && this.$refs[`checklist-${index-1}`][0]
      //   if (event.target.value == "") {
      //     this.$set(this.todo, 'checklist', this.todo.checklist.filter(c => c.id != item.id))
      //     prevChecklist && prevChecklist.focus()
      //     event.preventDefault()

      //   }
      // },
      // checklistMoved(list) {
      //   this.todo.checklist = list
      // },
      toolbarClick(mode) {
        const input = this.$refs[mode]
        if (input) input.focus()
        this.mode = mode
      },
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
      find, includes, filter,
    },
  }
</script>
