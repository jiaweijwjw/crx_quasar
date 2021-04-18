<template>
  <q-layout view="hhh lpr fff" class="layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
    }
  }
}
</script>

<style lang="sass">
  .q-layout
    background-color: $background !important
    height: 400px
    width: 400px
    overflow: auto
  .q-page-container
    background-color: $background !important
</style>
