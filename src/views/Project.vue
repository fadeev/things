<template>
  <div>
    <div :class="['project__container', {'project__container_expanded': expanded}]" @click="expanded = null; selected = null">
      <div class="heading__title">
        <base-icon class="heading__title__icon" image="circle-2-svg" fill="#1b61c2" width="21" height="21"/>
        <div class="heading__title__input">
          <span class="heading__title__input__text" contenteditable spellcheck="false" @blur="projectNameUpdate($event.target.innerText)">
            {{project.name}}
          </span>
          <!-- <base-icon class="heading__title__input__icon" image="menu-7-svg" fill="#9299a4" width="20" height="20"/> -->
        </div>
      </div>
      <div class="project__body">
        <resizable-textarea>
          <textarea rows="1" placeholder="Notes" class="project__notes" :value="project.notes" @input="projectNotesUpdate($event.target.value)"></textarea>
        </resizable-textarea>
      </div>
      <div style="margin: 0 20px;">
        <draggable @start="dragging = true" @end="dragging = false" animation="150" delay="100" force-fallback="true" group="heading" :value="headingList" @input="headingMoved($event)">
          <todo v-for="todo in todoListWithoutHeading"
                :key="todo.id"
                :class="['area__todo-list__item', {'drag': dragging, 'area__todo-list__item_expanded': expanded == todo.id}]"
                @select="select"
                @expand="expand"
                :value="todo"
                :expanded="expanded == todo.id"
                :selected="selected == todo.id"/>
        </draggable>
      </div>
      <draggable @start="dragging = true" @end="dragging = false" animation="150" delay="100" force-fallback="true" group="heading" :value="headingList" @input="headingMoved($event)">
        <div class="project__heading" v-for="heading in headingList" :key="heading.id">
          <div :class="['project__heading__title', {'project__heading__title_selected': heading.id == selected}]"
               @click.stop="selected = heading.id">
            <div class="project__heading__title__text">
              {{heading.name}}
            </div>
          </div>
          <draggable animation="150" delay="100" force-fallback="true" group="todo" :value="todoListByHeading(heading.id)" @input="todoMoved($event, heading)">
            <todo v-for="todo in todoListByHeading(heading.id)"
                  :key="todo.id"
                  :class="['area__todo-list__item', {'drag': dragging, 'area__todo-list__item_expanded': expanded == todo.id}]"
                  @select="select"
                  @expand="expand"
                  :value="todo"
                  :expanded="expanded == todo.id"
                  :selected="selected == todo.id"/>
          </draggable>
        </div>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .project__container { transition: background-color .2s; margin-left: 1px; width: 100%;  padding: 75px 6% 50px; box-sizing: border-box; overflow-y: scroll; box-sizing: border-box; height: 100vh; }
  .project__container_expanded { background-color: #fafafa; }
  .heading__title { margin-bottom: 10px; }
  .project__body { padding: 0 30px 0; }
  .project__notes { width: 100%; resize: none; margin-bottom: 2.5em; }
  .heading__title__icon { padding-left: 0; }
  .project__heading { margin: 30px 20px 0; position: relative; }
  .project__heading__title { padding: 4px 8px 0 8px; color: #1b61c2; border-radius: 3px; font-weight: 700; margin: 0 10px 7px; }
  .project__heading__title__text { padding-bottom: 7px; box-shadow: inset 0 -1px 0 0 #eee; }
  .project__heading__title_selected { background-color: #cee2fe; }
  .project__heading__title_selected .project__heading__title__text { box-shadow: none; }
  .area__todo-list__item { transition: margin .35s; margin: 0 10px; }
  .area__todo-list__item_expanded { margin: 30px 0; }
  .sortable-drag { opacity: 1 !important; }
  .sortable-ghost { opacity: 1 !important; background-color: #f0f0f0; border-radius: 3px; }
  .sortable-ghost * { opacity: 0; }
  .sortable-fallback { background-color: #fff; opacity: 1 !important; border-radius: 3px; }
</style>

<script>
  import { find, sortBy, findIndex } from 'lodash'
  import BaseIcon from '@/components/BaseIcon.vue'
  import Todo from '@/components/Todo.vue'
  import ResizableTextarea from '@/components/ResizableTextarea.vue'
  import draggable from "vuedraggable"

  export default {
    components: { BaseIcon, ResizableTextarea, draggable, Todo, },
    data: function() {
      return {
        selected: null,
        expanded: null,
        dragging: null,
      }
    },
    computed: {
      project() {
        return find(this.$store.state.entityList, ['id', this.$route.params.id])
      },
      headingList() {
        return sortBy(this.$store.state.entityList.filter(entity => {
          return entity.type == 'heading' && entity.projectId == this.project.id
        }), ['order'])
      },
      todoListWithoutHeading() {
        return sortBy(this.$store.state.entityList.filter(entity => {
          return entity.type == 'todo' && entity.projectId == this.project.id && !entity.headingId
        }), ['order'])        
      },
    },
    methods: {
      todoListByHeading(headingId) {
        return sortBy(this.$store.state.entityList.filter(entity => {
          return entity.type == 'todo' && entity.headingId == headingId
        }), ['order'])
      },
      select(entity) {
        this.selected = entity && entity.id
      },
      expand(entity) {
        this.expanded = entity && entity.id
      },
      projectNameUpdate(name) {
        this.$store.dispatch('entityUpdate', {...this.project, name})
      },
      projectNotesUpdate(notes) {
        this.$store.dispatch('entityUpdate', {...this.project, notes})
      },
      todoMoved(list, target) {
        list.forEach(entity => {
          this.$store.dispatch('entityUpdate', {
            ...entity,
            order: findIndex(list, ['id', entity.id]),
            headingId: target && target.id,
          })
        })
      },
      headingMoved(list, target) {
        list.forEach(entity => {
          this.$store.dispatch('entityUpdate', {
            ...entity,
            order: findIndex(list, ['id', entity.id]),
          })
        })
      },
    }
  }
</script>
