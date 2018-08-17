<template>
  <div>
    <Container @drop="(e) => onDrop(local.heading ? local.heading.uuid : null, e)" group-name="todo" :get-child-payload="getChildPayload()">
      <Draggable style="overflow: visible" v-for="todo in local.todos" :key="todo.uuid">
        <Todo :selected="selected == todo.uuid"
              @select="todoSelect($event)"
              @unfold="todoUnfold"
              @update="todoUpdate($event)"
              :area="area"
              :data="todo"
              :key="todo.uuid"
              ref="todo">
        </Todo>
      </Draggable>
    </Container>
  </div>
</template>

<style scoped>

</style>

<script>
  import Todo from './Todo.vue'
  import { Container, Draggable } from "vue-smooth-dnd"
  import { includes, map, forEach, uniq, flatten, omitBy, isNil, cloneDeep, find, some, groupBy, forOwn, mapKeys, mapValues, values, sortBy, omit } from 'lodash'
  import { EventBus } from '../event-bus.js'
  import TodoIconVue from './TodoIcon.vue'

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
    components: { Todo, Container, Draggable },
    props: ["data", "area"],
    data: function() {
      return {
        local: cloneDeep(this.data),
      }
    },
    computed: {
      selected() {
        return this.$store.state.selected
      }
    },
    watch: {
      data: {
        deep: true,
        handler(newData) {
          this.local = cloneDeep(newData)
        }
      }
    },
    mounted() {
      EventBus.$on("fullToggle", ({uuid}) => {
        forEach(this.$refs["todo"], (todo) => {
          if (todo.data.uuid == uuid) {
            todo.fullToggle(true)
          }
        })
      })
      EventBus.$on("todoDeselect", () => {
        forEach(this.$refs["todo"], (todo) => {
          todo.fullToggle(false)
        })
      })
    },
    methods: { 
      todoSelect(uuid) {
        this.$store.dispatch("todoSelect", {uuid: uuid})
      },
      todoUnfold() {
        EventBus.$emit("todoUnfold")
      },
      todoUpdate(todo) {
        this.$store.dispatch("todoUpdate", todo)
      },
      getChildPayload: function() {
        return index => {
          return this.local.todos[index]
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
          this.local.todos = applyDrag([...this.local.todos], event)
          return
        }
        if (event.addedIndex != null) {
          this.local.todos = applyDrag([...this.local.todos], event)
          this.$store.dispatch("todoUpdate", {...event.payload, heading: uuid})
        }
        if (event.removedIndex != null) {
          // this.dat.todos = this.dat.todos.filter(x => {
          //   return x.uuid != this.dat.todos[event.removedIndex].uuid
          // })
          // this.$refs[event.payload.uuid][0].fold()
          // setTimeout(() => {
            this.local.todos.splice(event.removedIndex, 1)
          // }, 2000)
        }
      },
    },
  }
</script>
