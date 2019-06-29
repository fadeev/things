<template lang="pug">
  div
    .container
      textarea(
        rows="2"
        placeholder="Notes"
        class="textarea"
        :value="value"
        @input="$emit('input', $event.target.value)"
      )
</template>

<script>
  export default {
    props: {
      value: String,
    },
  }
</script>

<style lang="stylus" scoped>
  .container
    margin 10px 0

  .textarea
    padding 0 0 15px 0
    resize none
    width 100%
</style>
