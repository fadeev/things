<template>
  <div>
    <div :class="['area__container', {'area__container_expanded': expanded}]" @click="expanded = null; selected = null">
      <div class="heading__title">
        <base-icon class="heading__title__icon" image="cube-2-svg" fill="#59b591" width="24" height="24"/>
        <div class="heading__title__input">
          <span class="heading__title__input__text" contenteditable spellcheck="false">{{area.name}}</span>
          <base-icon image="menu-7-svg" class="heading__title__input__icon" fill="#9299a4" width="20" height="20"/>
        </div>
      </div>
      <div class="area__project-list">
        <draggable @start="dragging = true"
                   @end="dragging = false"
                   @input="entityMoved($event, area)"
                   :value="projectList"
                   group="project"
                   animation="150"
                   force-fallback="true"
                   delay="100">
          <transition-group :name="!dragging ? 'flip' : ''">
            <div class="area__project-list__item"
                 v-for="project in projectList"
                 :key="project.id"
                 @dblclick="$router.push(`/project/${project.id}`)"
                 @click.stop="selected = project.id">
              <div class="area__project-list__item__icon icon__calendar">
                <base-icon image="calendar-4-svg" fill="#bdc0c2" width="12" height="12"/>
              </div>
              <div :class="['area__project-list__item__main', {'selected': selected == project.id}]">
                <div class="area__project-list__item__icon">
                  <base-icon image="circle-2-svg" fill="#1b61c2" width="14" height="14"/>
                </div>
                <div class="area__project-list__item__name">{{project.name}}</div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="area__todo-list">
        <draggable animation="150" force-fallback="true" delay="100">
          <Todo v-for="todo in todoList"
                @select="select"
                @expand="expand"
                :class="['area__todo-list__item', {'area__todo-list__item_expanded': expanded == todo.id}]"
                :value="todo"
                :key="todo.id"
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
  import BaseIcon from '@/components/BaseIcon.vue'

  export default {
    components: { draggable, Todo, BaseIcon, },
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
