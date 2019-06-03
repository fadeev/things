<template>
  <div class="todo__list__toolbar__popup" style="width: initial;">
    <div class="todo__list__toolbar__popup__item" v-for="tag in value" :key="tag.id">
      <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#ccc" width="14" height="14" viewBox="0 0 24 24"><path d="M9.776 2l11.395 11.395-7.78 7.777-11.391-11.391v-7.781h7.776zm.829-2h-10.605v10.609l13.391 13.391 10.609-10.604-13.395-13.396zm-3.191 7.414c-.781.782-2.046.782-2.829.001-.781-.783-.781-2.048 0-2.829.782-.782 2.048-.781 2.829-.001.782.783.781 2.047 0 2.829z"/></svg>
      <div class="window__sidebar__list__item__text"
           style="font-weight: 400;"
           @dblclick.stop=""
           @click.stop="$emit('input', tag)">
        {{tag.name}}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .todo__list__toolbar__popup { z-index: 1000; box-shadow: 0 5px 10px 0 rgba(0,0,0,.2); z-index: 1000; padding: 6px 0; position: absolute; color: white; background-color: #2b323b; margin-top: 3px; margin-bottom: 10px; width: 230px; border-radius: 7px; }
  .todo__list__toolbar__popup__item { margin: 0 6px; display: flex; align-items: center; border-radius: 4px; padding: 3px 4px; }
  .todo__list__toolbar__popup__item:hover { background-color: #5d9cf5; }
  .window__sidebar__list__item__text { margin: 0 5px; font-weight: 600; }
</style>

<script>
  export default {
    props: ['value'],
  }
</script>
