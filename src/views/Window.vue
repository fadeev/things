<template>
  <div>
    <div class="window">
      <div class="window__drag"></div>
      <div class="window__sidebar">
        <div class="window__sidebar__list">
          <div class="window__sidebar__list__scroll">
            <div class="window__sidebar__list__section">
              <router-link tag="div" to="/inbox" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#1b94d2" width="16" height="16" viewBox="0 0 24 24"><path d="M21 0h-18l-3 13 2 11h20l2-11-3-13zm-16.409 2h14.818l2.308 10h-4.717l-2.25 3h-5.5l-2.25-3h-4.7170000000000005l2.308-10z"/></svg>
                Inbox
              </router-link>
            </div>
            <div class="window__sidebar__list__section">
              <router-link tag="div" to="/today" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#f1ca00" width="16" height="16" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                Today
              </router-link>
              <router-link tag="div" to="/upcoming" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#fd306c" width="16" height="16" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg>
                Upcoming
              </router-link>
              <router-link tag="div" to="/anytime" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#37a599" width="16" height="16" viewBox="0 0 24 24"><path d="M21.698 10.658l2.302 1.342-12.002 7-11.998-7 2.301-1.342 9.697 5.658 9.7-5.658zm-9.7 10.657l-9.697-5.658-2.301 1.343 11.998 7 12.002-7-2.302-1.342-9.7 5.657zm12.002-14.315l-12.002-7-11.998 7 11.998 7 12.002-7z"/></svg>
                Anytime
              </router-link>
              <router-link tag="div" to="/someday" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#b5a96a" width="16" height="16" viewBox="0 0 24 24"><path d="M1 24h22v-12h-22v12zm8-9h6v2h-6v-2zm15-7v2h-24v-2l4.474-8h15.087l4.439 8z"/></svg>
                Someday
              </router-link>
            </div>
            <div class="window__sidebar__list__section">
              <router-link tag="div" to="/logbook" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#4cbe5e" width="16" height="16" viewBox="0 0 24 24"><path d="M5.495 4c-1.375 0-1.375-2 0-2h16.505v-2h-17c-1.657 0-3 1.343-3 3v18c0 1.657 1.343 3 3 3h17v-20h-16.505z"/></svg>
                Logbook
              </router-link>
              <router-link tag="div" to="/trash" class="window__sidebar__list__item strong">
                <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#c2c7cc" width="16" height="16" viewBox="0 0 24 24"><path d="M5.633 22.031c1.135 1.313 3.735 1.969 6.334 1.969 2.601 0 5.199-.656 6.335-1.969.081-.404 3.698-18.468 3.698-18.882 0-2.473-7.338-3.149-10-3.149-4.992 0-10 1.242-10 3.144 0 .406 3.556 18.488 3.633 18.887zm6.418-16.884c-4.211 0-7.625-.746-7.625-1.667s3.414-1.667 7.625-1.667 7.624.746 7.624 1.667-3.413 1.667-7.624 1.667z"/></svg>
                Trash
              </router-link>
            </div>
            <div class="window__sidebar__list__section">
              <draggable :value="projectList" @input="entityMoved($event)" animation="150" group="project" force-fallback="true" delay="100">
                <router-link tag="div" :to="`/project/${project.id}`" class="window__sidebar__list__item" v-for="project in projectList" :key="project.id">
                  <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#afb3b8" width="14" height="14" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
                  <div>{{project.name}}</div>
                </router-link>
              </draggable>
            </div>
            <draggable :value="areaList" @input="entityMoved($event)" animation="150" force-fallback="true" delay="100">
              <div class="window__sidebar__list__section" v-for="area in areaList" :key="area.id">
                <router-link tag="div" :to="`/area/${area.id}`" class="window__sidebar__list__item strong">
                  <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#afb3b8" width="14" height="14" viewBox="0 0 24 24"><path d="M12 0l-11 6v12.131l11 5.869 11-5.869v-12.066l-11-6.065zm7.91 6.646l-7.905 4.218-7.872-4.294 7.862-4.289 7.915 4.365zm-16.91 1.584l8 4.363v8.607l-8-4.268v-8.702zm10 12.97v-8.6l8-4.269v8.6l-8 4.269z"/></svg>
                  <div>{{area.name}}</div>
                </router-link>
                <draggable @start="dragging = true" @end="dragging = false" :value="area.children" @input="entityMoved($event, area)" animation="150" group="project" force-fallback="true" delay="100">
                  <transition-group :name="!dragging ? 'flip' : ''">
                    <router-link tag="div" :to="`/project/${project.id}`" class="window__sidebar__list__item item__inside" v-for="project in area.children" :key="project.id">
                      <svg class="window__sidebar__list__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#afb3b8" width="14" height="14" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
                      <div>{{project.name}}</div>
                    </router-link>
                  </transition-group>
                </draggable>
              </div>
            </draggable>
          </div>
        </div>
        <div class="window__toolbar">
          <div class="window__toolbar__panel">
            <div class="window__toolbar__panel__item" @click="projectCreate">
              <svg class="window__toolbar__panel__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#585c61" width="11" height="11" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
              <div class="window__toolbar__panel__item__text">New List</div>
            </div>
          </div>
        </div>
      </div>
      <div class="window__main">
        <router-view/>
        <div class="window__toolbar window__toolbar_white window__toolbar_center">
          <div class="window__toolbar__panel window__toolbar__panel_center">
            <div class="window__toolbar__panel__item window__toolbar__panel__item_center" @click="entityCreate('todo')">
              <svg class="window__toolbar__panel__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#585c61" width="11" height="11" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
            </div>
            <div class="window__toolbar__panel__item window__toolbar__panel__item_center" @click="projectCreate">
              <svg class="window__toolbar__panel__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#585c61" width="13" height="13" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg>
            </div>
            <div class="window__toolbar__panel__item window__toolbar__panel__item_center" @click="projectCreate">
              <svg class="window__toolbar__panel__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#585c61" width="12" height="12" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
            </div>
            <div class="window__toolbar__panel__item window__toolbar__panel__item_center" @click="projectCreate">
              <svg class="window__toolbar__panel__item__icon" xmlns="http://www.w3.org/2000/svg" fill="#585c61" width="12" height="12" viewBox="0 0 24 24"><path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .window { display: grid; grid-template-columns: 190px 1fr; width: 100vw; height: 100vh; overflow: hidden; }
  .window__drag { position: absolute; height: 35px; top: 0; left: 0; right: 0; -webkit-app-region: drag; }
  .window__sidebar { background-color: #f5f6f7; color: #3f4246; font-weight: 500; height: 100vh; position: relative; overflow-x: hidden; }
  .window__main { position: relative; box-shadow: inset 1px 0 0 rgba(0,0,0,.05); }
  .window__sidebar__list { padding: 0 16px; overflow-y: scroll; height: 100%; overflow-x: hidden; }
  .window__sidebar__list__scroll { margin-top: 40px; padding-bottom: 35px; }
  .window__sidebar__list__section { margin: 9px 0; }
  .window__sidebar__list__item { display: flex; align-items: center; border-radius: 3px; cursor: pointer; user-select: none; font-weight: 400; }
  .strong { font-weight: 500; }
  .window__sidebar__list__item__icon { margin: 4px 6px 3px; }
  .router-link-active { background-color: #dce1e6; }
  .sortable-chosen.sortable-ghost { opacity: 0; }
  .sortable-fallback { opacity: 1 !important; background: white; border-radius: 3px; box-shadow: 0 3px 5px 0 rgba(0,0,0,.05); }
  .sortable-ghost { opacity: 1 !important; background-color: #dce1e6; border-radius: 3px; }
  .sortable-ghost * { opacity: 0; }
  .sortable-fallback .router-link-active { background-color: initial; }
  .window__toolbar { height: 36px; background-color: #f5f6f7; color: #585c61; position: absolute; bottom: 0; padding: 5px 16px; width: 100%; box-sizing: border-box; box-shadow: inset 0 1px #e7ebee; }
  .window__toolbar_white { background-color: white; box-shadow: inset 0 1px #e7ebee, inset 1px 0 0 #ecf3f4; }
  .window__toolbar__panel { display: flex; justify-content: space-between; align-items: center; }
  .window__toolbar__panel__item { display: flex; align-items: center; font-weight: 400; padding: 3px 4px 5px; }
  .window__toolbar__panel__item__icon { margin: 4px 6px 3px; }
  .window__toolbar__panel__item:hover { box-shadow: inset 0 0 0 -1px #dcdfe2, inset 0 0 0 1px #dcdfe2; border-radius: 4px; }
  .window__toolbar__panel__item:active { background-color: #dfe3e8; box-shadow: none; border-radius: 4px; }
  .window__toolbar__panel__item__text { margin-right: 6px; }
  .window__main__toolbar { background: red; position: absolute; bottom: 0; }
  .window__toolbar__panel_center { justify-content: center; }
  .window__toolbar__panel__item_center { min-width: 10vw; justify-content: center; }
  .window__toolbar__panel__item_center:hover { box-shadow: inset 0 0 0 -1px #ededed, inset 0 0 0 1px #ededed; }
  .window__toolbar__panel__item_center:active { background-color: #ebebeb; box-shadow: none; border-radius: 4px; }
</style>

<script>
  import draggable from "vuedraggable"
  import { sortBy, findIndex } from "lodash"

  export default {
    components: { draggable, },
    data: function() {
      return {
        dragging: null,
      }
    },
    computed: {
      projectList() {
        return sortBy(this.$store.state.entityList.filter(entity => entity.type == 'project' && !entity.areaId), ['order'])
      },
      areaList() {
        return sortBy(
          this.$store.state.entityList
            .filter(entity => entity.type == 'area')
            .map(area => ({...area, children: sortBy(this.$store.state.entityList.filter(project => project.areaId == area.id), ['order'])})),
        ['order'])
      },
      projectInAreaList() {
        return (areaId) => sortBy(this.$store.state.entityList.filter(entity => entity.type == 'project' && entity.areaId == areaId), ['order'])
      },
    },
    methods: {
      entityMoved(list, target) {
        list.forEach(entity => {
          this.$store.dispatch('entityUpdate', {
            ...entity,
            order: findIndex(list, ['id', entity.id]),
            areaId: target && target.id,
            children: undefined
          })
        })
      },
      projectCreate() {
        this.$store.dispatch('entityUpdate', {type: 'project'})
      },
      entityCreate(type) {
        const isTodo = type == 'todo'
        const isToday = this.$route.path.split('/')[1] == 'today'
        const inbox = this.$route.path.split('/')[1] == 'inbox'
        const date = (isTodo && isToday) ? new Date().toISOString().slice(0,10) : null
        this.$store.dispatch('entityCreate', {
          type,
          date,
          inbox,
        })
      },
    },
  }
</script>
