<template lang="pug">
  - var draggable = {
  -   direction: "vertical",
  -   handle: ".handle",
  -   animation: "150",
  -   delay: "100",
  - }
  div
    .checklist(v-if="value && value.length > 0")
      draggable(force-fallback="true" :value="value" @input="moved($event)")&attributes(draggable)
        .item(tabindex="0" v-for="(item, index) in value" :key="item.id")
          .icon(v-if="!item.done" @click.stop="done(item, true)")
            base-icon(fill="#1d63c3" width="10" height="10" image="circle-2-svg")
          .icon(v-else @click.stop="done(item, false)")
            base-icon(fill="#aaa" width="10" height="10" image="check-mark-15-svg")
          input.text(
            :style="{color: item.done ? '#aaa' : '#000'}"
            :ref="`checklist-${index}`"
            :value="item.title"
            @keydown.backspace="backspace(item, $event, index)"
            @keyup.enter="push(index)" @keydown.down="focus(index+1, $event)"
            @keydown.up="focus(index-1, $event)"
            @input="change(item, $event.target.value)"
          )
          .handle(style="justify-self: end; margin-left: auto")
            base-icon(image="menu-thin-svg" fill="#777" width="12" height="12")
</template>

<style lang="stylus" scoped>
  border = 1px solid #e3e4e7

  .checklist
    margin 10px 0
  .item
    margin-left 6px
    outline none
    display flex
    border-top border
    border-left 1px solid transparent
    border-bottom 1px solid transparent
    border-right 1px solid transparent
    align-items center
    padding 6px
    padding-left 0

    &:last-child
      border-bottom border

    &:focus-within
      background-color #f4f5f6
      border-radius 3px
      margin-left 0
      padding-left 6px
      border-left border
      border-right border
      border-bottom border

    &:focus-within + .item
      border-top 1px solid transparent

    &.sortable-chosen.sortable-drag
      padding-left 6px
      border 1px solid #c8ddfa

    &.sortable-ghost
      padding-left 6px
      border 1px solid transparent
      padding-left 6px
      margin-left 0

    &.sortable-ghost + .item
      border-top 1px solid transparent

  .icon
    margin-right 10px
    transition all .2s

    &:active
      transform scale(1.1)

  .text
    outline none
    width 100%

  .handle
    opacity 0

    &:hover
      opacity 1

  .item:focus-within .handle
    opacity 1

  .item.sortable-drag .handle
    opacity 1

  .sortable-ghost
    opacity 1 !important
    background-color #f0f0f0
    border-radius 3px

  .sortable-ghost *
    opacity 0

  .sortable-fallback
    background-color #cee2fe
    opacity 1 !important
    border-radius 3px
</style>

<script>
  import BaseIcon from "@/components/BaseIcon.vue"
  import draggable from "vuedraggable"
  import uuidv1 from 'uuid/v1'
  import { cloneDeep, findIndex } from 'lodash'

  export default {
    components: { BaseIcon, draggable, },
    props: {
      value: Array,
    },
    methods: {
      push(index) {
        const before = this.value.slice(0, index+1)
        const after = this.value.slice(index+1)
        const newItem = {id: uuidv1()}
        this.$emit('input', [...before, newItem, ...after])
        this.$nextTick(() => this.$refs[`checklist-${index+1}`][0].focus())
      },
      focus(index, event) {
        const cursorPosition = event.target.selectionStart
        event.preventDefault()
        const sibling = this.$refs[`checklist-${index}`]
        if (sibling && sibling[0]) {
          sibling[0].focus()
          sibling[0].selectionStart = cursorPosition
          sibling[0].selectionEnd = cursorPosition
        }
      },
      backspace(item, event, index) {
        const prevChecklist = this.$refs[`checklist-${index-1}`] && this.$refs[`checklist-${index-1}`][0]
        if (event.target.value == "") {
          this.$emit('input', this.value.filter(c => c.id != item.id))
          prevChecklist && prevChecklist.focus()
          event.preventDefault()

        }
      },
      moved(list) {
        this.$emit('input', list)
      },
      done(item, done) {
        const index = findIndex(this.value, {id: item.id})
        const before = this.value.slice(0, index)
        const after = this.value.slice(index+1)
        this.$emit('input', [...before, {...item, done}, ...after])
      },
      change(item, title) {
        const index = findIndex(this.value, {id: item.id})
        const before = this.value.slice(0, index)
        const after = this.value.slice(index+1)
        this.$emit('input', [...before, {...item, title}, ...after])
      },
    }
  }
</script>
