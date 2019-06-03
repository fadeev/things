<template>
  <div>
    <div :class="['area__container', {'area__container_expanded': expanded}]" @click="expanded = null; selected = null">
      <div class="heading__title">
        <svg class="heading__title__icon" xmlns="http://www.w3.org/2000/svg" fill="#59b591" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0l-11 6v12.131l11 5.869 11-5.869v-12.066l-11-6.065zm7.91 6.646l-7.905 4.218-7.872-4.294 7.862-4.289 7.915 4.365zm-16.91 1.584l8 4.363v8.607l-8-4.268v-8.702zm10 12.97v-8.6l8-4.269v8.6l-8 4.269z"/></svg>
        <div class="heading__title__input">
          <span class="heading__title__input__text" contenteditable spellcheck="false">{{area.name}}</span>
          <svg class="heading__title__input__icon" xmlns="http://www.w3.org/2000/svg" fill="#9299a4" width="20" height="20" viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
        </div>
      </div>
      <div class="area__project-list">
        <draggable @start="dragging = true" @end="dragging = false" group="project" :value="projectList" @input="entityMoved($event, area)" animation="150" force-fallback="true" delay="100">
          <transition-group :name="!dragging ? 'flip' : ''">
            <div class="area__project-list__item"
                v-for="project in projectList"
                :key="project.id"
                @dblclick="$router.push(`/project/${project.id}`)"
                @click.stop="selected = project.id">
              <div class="area__project-list__item__icon icon__calendar">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#bdc0c2" width="12" height="12" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg>
              </div>
              <div :class="['area__project-list__item__main', {'selected': selected == project.id}]">
                <div class="area__project-list__item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#1b61c2" width="14" height="14" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
                </div>
                <div class="area__project-list__item__name">{{project.name}}</div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="area__todo-list">
        <draggable animation="150" force-fallback="true" delay="100">
          <Todo :class="['area__todo-list__item', {'area__todo-list__item_expanded': expanded == todo.id}]"
                :value="todo"
                v-for="todo in todoList"
                :key="todo.id"
                @select="select"
                @expand="expand"
                :expanded="expanded == todo.id"
                :selected="selected == todo.id"/>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .area__container { overflow-y: scroll; overflow-x: hidden; margin-left: 1px; width: 100%; padding: 75px 6% 50px; box-sizing: border-box; height: 100vh; transition: background-color .2s; }
  .area__container_expanded { background-color: #fafafa; }
  .area__project-list, .area__todo-list { margin-top: 30px; padding: 0 25px; }
  .area__project-list__item { user-select: none; position: relative; }
  .area__project-list__item__main { display: flex; padding: 5px 0; width: 100%; border-radius: 3px; }
  .area__project-list__item__icon { width: 27px; display: flex; justify-content: center; align-items: center; }
  .area__project-list__item__name { font-weight: 600; }
  // .area__todo-list__item { margin-bottom: 5px; }
  .icon__calendar { opacity: 0; position: absolute; height: 100%; left: -25px; }
  .icon__calendar:hover { opacity: 1; }
  .selected { background-color: #cee2fe; border-radius: 3px; }
  .sortable-ghost { opacity: 1 !important; background-color: #f0f0f0; border-radius: 3px; }
  .sortable-ghost * { opacity: 0; }
  .sortable-fallback { background-color: #cee2fe; opacity: 1 !important; border-radius: 3px; }
  .area__todo-list__item { transition: margin .2s; }
  .area__todo-list__item_expanded { margin: 30px 0; }
</style>

<script>
  import { find, findIndex, sortBy } from 'lodash'
  import draggable from "vuedraggable"
  import Todo from "@/components/Todo.vue"

  export default {
    components: { draggable, Todo, },
    data: function() {
      return {
        selected: null,
        expanded: null,
        dragging: null,
      }
    },
    computed: {
      area: {
        get() {
          return find(this.$store.state.entityList, {id: this.$route.params.id})
        },
      },
      projectList() {
        return sortBy(this.$store.state.entityList.filter(entity => {
          return entity.type == 'project' && entity.areaId == this.area.id
        }), ['order'])
      },
      todoList() {
        return this.$store.state.entityList.filter(entity => {
          return entity.type == 'todo'
        })
      },
    },
    methods: {
      entityMoved(list, target) {
        list.forEach(entity => {
          this.$store.dispatch('entityUpdate', {
            ...entity,
            order: findIndex(list, ['id', entity.id]),
            areaId: target && target.id,
            // children: undefined
          })
        })
      },
      select(entity) {
        this.selected = entity && entity.id
      },
      expand(entity) {
        this.expanded = entity && entity.id
      },
    }
  }
</script>
