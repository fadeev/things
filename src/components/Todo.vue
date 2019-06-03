<template>
  <div>
    <div :class="['todo-list__item']">
      <div :class="['todo__list__main', {selected, 'todo__list__main_expanded': expanded}]" @click.stop="select" @dblclick.stop="expand">
        <div class="todo__calendar"><svg xmlns="http://www.w3.org/2000/svg" fill="#bdc0c2" width="12" height="12" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg></div>
        <div class="todo__list__main__title">
          <div class="todo__main__title__checkbox"><svg xmlns="http://www.w3.org/2000/svg" :fill="selected && !expanded ? '#a1b3cc' : '#c8cacd'" width="11" height="11" viewBox="0 0 24 24"><path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z"/></svg></div>
          <div class="todo__list__main__title__text" :contenteditable="expanded">{{todo.name || 'New Todo'}}</div>
        </div>
        <div class="todo__list__main__body" v-if="expanded">
          <div class="todo__list__main__body__notes">
            <resizable-textarea>
              <textarea rows="1" placeholder="Notes" class="todo__textarea">{{todo.notes}}</textarea>
            </resizable-textarea>
          </div>
        </div>
        <transition name="slide">
          <div class="todo__list__main__body" v-if="expanded && todo.tagList && todo.tagList.length > 0">
            <div class="todo__list__main__body__tag-list">
              <div class="todo__list__main__body__tag-list__item" v-for="tag in todo.tagList.map(tag => find(tagList, ['id', tag]))" :key="tag.id">
                {{tag.name}}
              </div>
              <div>
                <input placeholder="Tag" @keyup.enter="tagAdd({name: $event.target.value})" ref="tag-input" class="todo__list__main__body__tag-list__input" type="text" v-model="tagSearch" @click.stop="mode = 'button-tags'">
                <transition name="fade">
                  <popup-tags v-if="mode == 'button-tags'" :value="tagListFiltered()" @input="tagAdd($event); $refs['tag-input'].focus()"/>
                </transition>
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide">
          <div class="todo__list__main__body" v-if="expanded && todo.date">
            <div class="todo__list__main__body__date">
              <div class="todo__list__main__body__date__button">
                <svg v-if="todo.date == todayDate && !todo.evening" class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#f1ca00" width="14" height="14" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                <svg v-if="todo.date == todayDate && todo.evening" class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#a3bde2" width="14" height="14" viewBox="0 0 24 24"><path d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"/></svg>
                <svg v-if="todo.date && todo.date != todayDate && !todo.someday" class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#fd306c" width="14" height="14" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg>
                <svg v-if="todo.someday" class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#b5a96a" width="14" height="14" viewBox="0 0 24 24"><path d="M1 24h22v-12h-22v12zm8-9h6v2h-6v-2zm15-7v2h-24v-2l4.474-8h15.087l4.439 8z"/></svg>
                <div class="todo__list__main__body__date__text" @click.stop="mode = 'button-date'">
                  <div v-if="todo.date == todayDate && !todo.evening">Today</div>
                  <div v-if="todo.date == todayDate && todo.evening">This Evening</div>
                  <div v-if="todo.date && todo.date != todayDate && todo.someday">Someday</div>
                  <div v-if="todo.date && todo.date != todayDate && !todo.someday">{{todo.date}}</div>
                </div>
                <div class="todo__list__main__body__date__close" @click.stop="todo = {...todo, date: null, evening: null, someday: null}">✕</div>
              </div>
              <transition name="fade">
                <popup-date style="margin-top: 25px;" v-if="mode == 'button-date'" @input="todo = {...todo, ...$event}; mode = null"/>
              </transition>
            </div>
          </div>
        </transition>
        <div class="todo__list__toolbar" v-show="expanded">
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-date'}]"
               v-if="!todo.date && !todo.someday && !todo.evening"
               @click.stop="mode = 'toolbar-date'">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" width="14" height="14" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg>
              </div>
              <input placeholder="When" class="todo__list__toolbar__input"/>
            </div>
            <popup-date v-if="mode == 'toolbar-date'" @input="todo = {...todo, ...$event}; mode = null"/>
          </div>
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-tags'}]" v-if="!todo.taskList || todo.taskList.length <= 0" @click.stop="mode = 'toolbar-tags'">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" width="14" height="14" viewBox="0 0 24 24"><path d="M9.776 2l11.395 11.395-7.78 7.777-11.391-11.391v-7.781h7.776zm.829-2h-10.605v10.609l13.391 13.391 10.609-10.604-13.395-13.396zm-3.191 7.414c-.781.782-2.046.782-2.829.001-.781-.783-.781-2.048 0-2.829.782-.782 2.048-.781 2.829-.001.782.783.781 2.047 0 2.829z"/></svg>
              </div>
              <input placeholder="Tags" class="todo__list__toolbar__input"/>
            </div>
            <popup-tags :value="tagList" @input="$set(todo, 'tagList', [...$event.id]); mode = null" v-if="mode == 'toolbar-tags'"/>
          </div>
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-checklist'}]" @click.stop="mode = 'toolbar-checklist'">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" width="14" height="14" viewBox="0 0 24 24"><path d="M4 22h-4v-4h4v4zm0-12h-4v4h4v-4zm0-8h-4v4h4v-4zm3 0v4h17v-4h-17zm0 12h17v-4h-17v4zm0 8h17v-4h-17v4z"/></svg>
              </div>
              <input placeholder="Checklist" class="todo__list__toolbar__input"/>
            </div>
          </div>
          <div :class="['todo__list__toolbar__container', {'todo__list__toolbar__container_expanded': mode == 'toolbar-deadline'}]" @click.stop="mode = 'toolbar-deadline'">
            <div class="todo__list__toolbar__button">
              <div class="todo__list__toolbar__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" width="14" height="14" viewBox="0 0 24 24"><path d="M17 8.031l4-6.031h-16v-2h-2v24h2v-10h16l-4-5.969zm-12-4.031h12.273l-2.677 4.037 2.656 3.963h-12.252v-8z"/></svg>
              </div>
              <input placeholder="Deadline" class="todo__list__toolbar__input"/>
            </div>
            <div class="todo__list__toolbar__popup" style="right: -40px;" v-if="mode == 'toolbar-deadline'">
              <div class="todo__list__toolbar__popup__calendar" style="height: inherit;">
                <div class="todo__list__toolbar__popup__calendar__item__header" v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
                  {{day}}
                </div>
              </div>
              <div class="todo__list__toolbar__popup__calendar" style="height: 200px;">
                <div class="todo__list__toolbar__popup__calendar__item" v-for="(day, index) in dateCalendarThree(new Date().getFullYear())" :key="index">
                  <div v-if="day.day == 1" style="line-height: 1; font-size: 10px;">
                    <div>{{monthList[day.month-1].slice(0,3)}}</div>
                    <div>{{day.day}}</div>
                  </div>
                  <div v-else>{{day.day}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .todo-list__item { user-select: none; position: relative; }
  .todo__list__main.todo__list__main_expanded { transition: all .2s; background: #fff; padding-top: 10px; padding-bottom: 15px; box-shadow: 0 2px 5px 0 rgba(0,0,0,.1); }
  .todo__main__title__checkbox { position: absolute; left: 8px; }
  .todo__list__main__title { padding-left: 30px; }
  .todo__list__main__body { padding-left: 30px; padding-right: 10px; }
  .todo__list__main { padding: 5px 10px 5px 0; }
  .todo__calendar { position: absolute; left: -20px; opacity: 0; }
  .todo__calendar:hover { opacity: 1; }
  .todo__list__main__body__notes { margin: 10px 0; }
  .todo__textarea { padding-bottom: 15px; resize: none; width: 100%; border: none; font-size: inherit; font-family: inherit; line-height: inherit; outline: none; background-color: transparent; }
  .todo__list__main__title__text { outline: none; }

  .sortable-ghost { opacity: 1 !important; background-color: #f0f0f0; border-radius: 3px; }
  .sortable-ghost * { opacity: 0; }
  .sortable-fallback { background-color: #cee2fe; opacity: 1 !important; border-radius: 3px; }

  .selected { background-color: #cee2fe; border-radius: 3px; }

  .todo__list__toolbar { position: absolute; right: 0; bottom: 0; padding: 0 10px 15px; display: flex; }
  .todo__list__toolbar__container { overflow: hidden; width: 25px; transition: width .2s; margin: 0 3px; border-radius: 3px; }
  .todo__list__toolbar__container:hover { box-shadow: inset 0 0 0 1px #eeeff1, inset 0 0 0 1px #eeeff1; }
  .todo__list__toolbar__container:active { background-color: #eeeff1; }
  .todo__list__toolbar__container_expanded { width: 110px; }
  .todo__list__toolbar__container_expanded .todo__list__toolbar__button { background-color: #eeeff1; }
  .todo__list__toolbar__button { padding: 4px 6px; display: flex; justify-content: flex-start; align-items: center; }
  .todo__list__toolbar__icon { display: flex; align-items: center; justify-content: center; }
  .todo__list__toolbar__input { background-color: transparent; border: none; font-size: inherit; font-family: inherit; outline: none; color: rgb(153, 153, 153); padding: 0 5px; }

  .todo__list__toolbar__popup { box-shadow: 0 5px 10px 0 rgba(0,0,0,.2); z-index: 1000; padding: 6px 0; position: absolute; color: white; background-color: #2b323b; margin-top: 3px; margin-bottom: 10px; width: 230px; border-radius: 7px; }
  .todo__list__toolbar__popup__item { margin: 0 6px; display: flex; align-items: center; border-radius: 4px; padding: 3px 4px; }
  .todo__list__toolbar__popup__item:hover { background-color: #5d9cf5; }
  .window__sidebar__list__item__icon { padding-bottom: 1px; }
  .window__sidebar__list__item__text { margin: 0 5px; font-weight: 600; }
  .todo__list__toolbar__popup__calendar { height: 135px; overflow-y: scroll; display: grid; grid-template-columns: repeat(7, 1fr); width: 100%; margin: 4px 0; padding: 0 8px; box-sizing: border-box; font-size: 13px; font-weight: 600; }
  .todo__list__toolbar__popup__calendar__item { line-height: 1.5; border-radius: 3px; text-align: center; padding: 3px 0; }
  .todo__list__toolbar__popup__calendar__item:hover { background-color: #5d9cf5; }
  .todo__list__toolbar__popup__calendar__item__header { font-size: 11px; margin: 2px 0; text-align: center; color: #838990; font-weight: 600; }

  .todo__list__main__body__date { font-weight: 500; display: flex; }
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
  .todo__list__main__body__tag-list__item { border-radius: 1000px; background-color: #bce1d3; color: #298461; margin: 2px 4px 2px 0; font-size: 13px; font-weight: 600; padding: 1px 10px; }
  .todo__list__main__body__tag-list__input { font-family: inherit; font-size: inherit; border: none; background-color: transparent; outline: none; }

  .fade-enter-active { transition: all .1s; transform-origin: top; }
  .fade-enter { transform: scale(.9); opacity: .9; }
  .fade-enter-to { transform: scale(1); opacity: 1; }
</style>

<script>
  import ResizableTextarea from '@/components/ResizableTextarea.vue'
  import PopupDate from '@/components/PopupDate.vue'
  import PopupTags from '@/components/PopupTags.vue'
  import { range, chunk, flatten, filter, find, includes } from 'lodash'

  export default {
    components: { ResizableTextarea, PopupDate, PopupTags, },
    props: ['value', 'selected', 'expanded'],
    data() {
      return {
        todo: this.value,
        mode: null,
        tagSearch: null,
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
      monthList() {
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      },
      tagListLocal() {
        return this.todo.tagList.map(tag => find(this.tagList, ['id', tag]))
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
      async tagAdd(tag) {
        let inStore, id
        if (tag.name) {
          inStore = includes(this.tagList.map(tag => tag.name.toLowerCase()), tag.name.toLowerCase())
        }
        if (tag.id && notYetAdded) {
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
      log(a,b,c,d) { console.log(a,b,c,d) },
      find, includes, filter,
    },
  }
</script>
