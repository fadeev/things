<template>
  <div>
    <Container @mouseup.native="test($event)" group-name="proj" class="item">
      <Icon image="project"></Icon>
      <span>{{project.name || "New Project"}}</span>
    </Container>
  </div>
</template>

<style scoped>
  .item { overflow: hidden; border-radius: 5px; padding: 5px; cursor: pointer; user-select: none; margin-bottom: 5px; display: flex; align-items: center; }
</style>


<script>
  import Icon from "./Icon.vue"
  import { Container, Draggable } from "vue-smooth-dnd";

  export default {
    components: { Container, Draggable, Icon, },
    props: [ "project" ],
    methods: {
      test(x) {
        this.$store.dispatch("draggingCreate", {...this.$store.state.dragging, list: this.project.uuid})
        // let y = {...this.$store.state.dragging}
        // // if (this.$store.state.dragging)
        //   setTimeout(() => {
        //     this.$store.dispatch("todoUpdate", {...y, list: this.project.uuid})
        //   }, 500)
      },
    },
  }
</script>