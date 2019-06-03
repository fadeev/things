<template>
  <div>
    <div :class="['area__container', {'area__container_expanded': expanded}]" @click="expanded = null; selected = null">
      <div class="background" v-if="todoList.length <= 0">
        <div class="background__image">
          <svg xmlns="http://www.w3.org/2000/svg" fill="#f5f6f6" width="84" height="84" viewBox="0 0 24 24"><path d="M21 0h-18l-3 13 2 11h20l2-11-3-13zm-16.409 2h14.818l2.308 10h-4.717l-2.25 3h-5.5l-2.25-3h-4.7170000000000005l2.308-10z"/></svg>
        </div>
      </div>
      <div class="heading__title">
        <svg class="heading__title__icon" xmlns="http://www.w3.org/2000/svg" fill="#1b94d2" width="24" height="24" viewBox="0 0 24 24"><path d="M21 0h-18l-3 13 2 11h20l2-11-3-13zm-16.409 2h14.818l2.308 10h-4.717l-2.25 3h-5.5l-2.25-3h-4.7170000000000005l2.308-10z"/></svg>
        <div class="heading__title__input">
          <span class="heading__title__input__text">Inbox</span>
        </div>
      </div>
      <div class="area__todo-list">
        <draggable animation="150" force-fallback="true" delay="100">
          <Todo :class="['area__todo-list__item', {'area__todo-list__item_expanded': expanded == todo.id}]"
                v-for="todo in todoList"
                :value="todo"
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
  .area__todo-list { margin-top: 30px; padding: 0 25px; }
  .area__todo-list__item { transition: margin .2s; }
  .area__todo-list__item_expanded { margin: 30px 0; }
  .background { position: absolute; top: 0; left: 0; right: 0; bottom: 0; box-sizing: border-box; z-index: -1000; }
  .background__image { display: flex; justify-content: center; align-items: center; height: 100%; }
</style>

<script>
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
      todoList() {
        const today = new Date().toISOString().slice(0,10)
        return this.$store.state.entityList.filter(entity => {
          return entity.type == 'todo' && entity.inbox && !entity.date && !entity.someday && !entity.evening
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
    },
  }
</script>
