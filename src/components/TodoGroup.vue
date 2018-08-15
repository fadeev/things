<template>
  <div>
    <Container @drop="(e) => onDrop(dat.heading ? dat.heading.uuid : null, e)" group-name="todo" :get-child-payload="getChildPayload()">
      <Draggable style="overflow: visible" v-for="todo in dat.todos" :key="todo.uuid">
        <TodoNew :stay="true" :area="false" @full="whiteUpdate" :selected="todo.uuid == selected" @select="select" :dat="todo" :key="todo.uuid" :ref="todo.uuid"></TodoNew>
      </Draggable>
    </Container>
  </div>
</template>

<style scoped>

</style>

<script>
  import TodoNew from './TodoNew.vue'
  import { Container, Draggable } from "vue-smooth-dnd"
  import { includes, uniq, flatten, omitBy, isNil, cloneDeep, find, some, groupBy, forOwn, mapKeys, mapValues, values, sortBy, omit } from 'lodash'
  import { EventBus } from '../event-bus.js'

  export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult
    if (removedIndex === null && addedIndex === null) return arr
    const result = [...arr]
    let itemToAdd = payload
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0]
    }
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd)
    }
    return result
  };

  export default {
    components: { TodoNew, Container, Draggable },
    props: ["data"],
    data() {
      return {
        dat: cloneDeep(this.data),
        selected: null,
      }
    },
    methods: {
      getChildPayload: function() {
        return index => {
          return this.dat.todos[index]
        }
      },
      whiteUpdate() {
        let array = [];
        forOwn(this.$refs, (v, k) => {
          if (v[0]) array.push(v[0].full)
        })
        EventBus.$emit("whiteUpdate", !some(array))
      },
      deselect() {
        forOwn(this.$refs, (todo, uuid) => todo.forEach((element) => {
          if (element.deselect) element.deselect()
        }))
        this.selected = false;
      },
      select(e) {
        this.selected = e
      },
      onDrop: function(uuid, event) {
        // if (event.removedIndex != null && event.addedIndex != null) {
        //   this.dat.todos.splice(event.removedIndex, 1)
        //   this.dat.todos = applyDrag([...this.dat.todos], event)
        //   return
        // }
        if (event.addedIndex != null && event.removedIndex != null) {
          this.dat.todos = applyDrag([...this.dat.todos], event)
          return
        }
        if (event.addedIndex != null) {
          this.dat.todos = applyDrag([...this.dat.todos], event)
          this.$store.dispatch("todoUpdate", {...event.payload, heading: uuid})
        }
        if (event.removedIndex != null) {
          // this.dat.todos = this.dat.todos.filter(x => {
          //   return x.uuid != this.dat.todos[event.removedIndex].uuid
          // })
          // this.$refs[event.payload.uuid][0].fold()
          // setTimeout(() => {
            this.dat.todos.splice(event.removedIndex, 1)
          // }, 2000)
        }
      },
    },
  }
</script>
