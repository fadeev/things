<template lang="pug">
  div
    .container(style="width: iniitial")
      .item(v-for="tag in value" :key="tag.id")
        base-icon(image="tag-2-svg" fill="#ccc" width="14" height="14" )
        .text(
          style="font-weight: 400"
          @dblclick.stop=""
          @click.stop="$emit('input', tag)"
        ) {{tag.name}}
</template>

<style lang="stylus" scoped>
  .container
    max-height 180px
    overflow-y scroll
    z-index 1000
    box-shadow 0 5px 10px 0 rgba(0,0,0,.2)
    z-index 1000
    padding 6px 0
    position absolute
    color: white
    background-color #2b323b
    margin-top 3px
    margin-bottom 10px
    border-radius 7px

  .item
    margin 0 6px
    display flex
    align-items center
    border-radius 4px
    padding 3px 4px

    &:hover
      background-color #5d9cf5
  
  .text
    margin 0 5px
    font-weight 600
</style>

<script>
  import BaseIcon from '@/components/BaseIcon.vue'

  export default {
    components: {
      BaseIcon,
    },
    props: ['value'],
  }
</script>
