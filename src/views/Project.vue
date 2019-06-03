<template>
  <div>
    <div class="project__container">
      <div class="heading__title">
        <svg class="heading__title__icon" xmlns="http://www.w3.org/2000/svg" fill="#1b61c2" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
        <div class="heading__title__input">
          <span class="heading__title__input__text" contenteditable spellcheck="false">area.name</span>
          <svg class="heading__title__input__icon" xmlns="http://www.w3.org/2000/svg" fill="#9299a4" width="20" height="20" viewBox="0 0 24 24"><path d="M6 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm9 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/></svg>
        </div>
      </div>
      <!-- <div class="area__project-list">
        <draggable :value="projectList" @input="entityMoved($event)" animation="150" force-fallback="true" delay="100">
          <div :class="['area__project-list__item', {'selected': projectSelected == project.id}]"
               v-for="project in projectList"
               :key="project.id"
               @dblclick="$router.push(`/project/${project.id}`)"
               @click="projectSelected = project.id">
            <div class="area__project-list__item__icon icon__calendar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bdc0c2" width="12" height="12" viewBox="0 0 24 24"><path d="M20 19h-4v-4h4v4zm-6-10h-4v4h4v-4zm6 0h-4v4h4v-4zm-12 6h-4v4h4v-4zm16-14v22h-24v-22h24zm-2 6h-20v14h20v-14zm-8 8h-4v4h4v-4zm-6-6h-4v4h4v-4z"/></svg>
            </div>
            <div class="area__project-list__item__main">
              <div class="area__project-list__item__icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#1b61c2" width="14" height="14" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/></svg>
              </div>
              <div class="area__project-list__item__name">{{project.name}}</div>
            </div>
          </div>
        </draggable>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .project__container { width: 100%; padding: 50px 6% 0; box-sizing: border-box; }
</style>
