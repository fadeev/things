<template> 
  <router-view/>
</template>

<style lang="scss">
  body { margin: 0; font-size: 14px; color: #24292d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif }

  .heading__title { padding: 0 30px; display: flex; }
  .heading__title__icon { flex-shrink: 0; padding: 3px 6px; }
  .heading__title__input { display: flex; align-items: center; }
  .heading__title__input__text { font-size: 23px; font-weight: 600; outline: none; }
  .heading__title__input__icon { margin: 4px 10px 3px; flex-shrink: 0; }

  .flip-move { transition: all .5s;}
</style>
