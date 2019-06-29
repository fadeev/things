<template lang="pug">
  div
    .container(v-if="value && value.length > 0")
      .item(
        v-for="tag in tagList"
        tabindex="0"
        @keydown.backspace="remove(tag)"
        :key="tag.id"
      ) {{tag.name}}
      div
        input.search(
          placeholder="Tag"
          ref="search"
          type="text"
          v-model="search"
          @keydown.backspace="backspace($event.target.value)"
          @keyup.enter="add({name: $event.target.value})"
        )
        transition(name="fade")
          popup-tags(:value="tagListFiltered()" @input="add($event); $refs['search'].focus()")
</template>

<style lang="stylus" scoped>
  .container
    margin 10px 0
    display flex
    flex-wrap: wrap

  .item
    border-radius 1000px
    background-color #bce1d3
    color #298461
    margin 2px 4px 2px 0
    font-size 13px
    font-weight 500
    padding 1px 10px

    &:focus
      background-color #bed7fb
      color #5081c6
      outline none

  .search
    font-family inherit
    font-size inherit
    border none
    background-color transparent
    outline none
</style>

<script>
  import { find, filter, includes } from 'lodash'
  import PopupTags from '@/components/PopupTags.vue'

  export default {
    components: { PopupTags, },
    props: {
      value: Array,
      tags: Array,
    },
    data: function() {
      return {
        search: null,
      }
    },
    computed: {
      tagList() {
        return this.value && this.value.map(tag => find(this.tags, ['id', tag]))
      },
    },
    methods: {
      remove(tag) {
        this.$emit('input', filter(this.value, t => t != tag.id))
      },
      async add(tag) {
        if (!tag) return
        this.search = null
        let inStore
        let id = tag.id
        if (tag.name) {
          inStore = includes(this.tags.map(tag => tag.name.toLowerCase()), tag.name.toLowerCase())
        }
        if (tag.id && !includes(this.value, id)) {
          id = tag.id
        }
        if (!tag.id && tag.name && inStore) {
          id = find(this.tags, (t) => t.name.toLowerCase() == tag.name.toLowerCase()).id
        }
        if (!tag.id && tag.name && !inStore) {
          id = (await this.$store.dispatch('entityCreate', {type: 'tag', name: tag.name})).id
        }
        if (!includes(this.value, id)) {
          this.$emit('input', [...this.value, id])
        }
      },
      backspace(value) {
        if (!value) this.$emit('input', this.value.slice(0,-1))
      },
      tagListFiltered() {
        return filter(this.tags, tag => {
          const notYetAdded = !includes(this.value, tag.id)
          const matchesSearch = tag.name && this.search && tag.name.toLowerCase().match(this.search.toLowerCase())
          return notYetAdded && matchesSearch
        })
      },
      find,
    }
  }
</script>
