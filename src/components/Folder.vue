<template>
  <div>
    <div class="row title">
      <div><Icon :image="folder" :large="true"></Icon></div>
      <div>{{folder}}</div>
    </div>
    <div class="row tags">
      <div :class="{tag: true, selected: !tagSelected}" @click="tagSelected = null">
        All
      </div>
      <div :class="{tag: true, selected: tag == tagSelected}" @click="tagSelected = tag" v-for="(tag, index) in tagsLocal" :key="index">
        {{tag}}
      </div>
    </div>
    <div class="row todos">
      <transition-group name="fade">
        <TodoNew :selected="todo.uuid == selected" @select="selected = $event" :data="todo" :ref="todo.uuid" v-for="(todo, index) in todos" :key="index"></TodoNew>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
  .row.title { margin: 0 60px 30px; font-size: 1.5em; font-weight: bold; display: flex; align-items: center; }
  .row.tags { margin: 0 60px 30px; display: flex; }
  .row.tags .tag { border: 1px solid transparent; cursor: pointer; color: rgba(0,0,0,.35); font-weight: bold; border-radius: 1000px; padding: 0 10px; margin-right: 5px; }
  .row.tags .tag.selected { background: rgba(0,0,0,.25); color: white; }
  .row.tags .tag.selected:hover { border-color: rgba(0,0,0,0); }
  .row.tags .tag:hover { border-color: rgba(0,0,0,.25); }

  .fade-leave-active { transition: all 1s .5s; opacity: 0; }
</style>

<script>
  import includes from 'lodash/includes'
  import uniq from 'lodash/uniq'
  import flatten from 'lodash/flatten'

  import TodoNew from "./TodoNew.vue"
  import Icon from './Icon.vue'

  export default {
    components: { TodoNew, Icon },
    props: ["folder"],
    data() {
      return {
        selected: null,
        tagSelected: null,
      }
    },
    computed: {
      todos() {
        return this.$store.getters.todoFolder(this.folder).filter(todo => {
          return this.tagSelected ? includes(todo.tags, this.tagSelected) : true
        })
      },
      tags() {
        return this.$store.getters.tags
      },
      tagsLocal() {
        return uniq(flatten(this.todos.map(todo => todo.tags)))
      },
    },
  }
</script>
