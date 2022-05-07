<template>
  <h1 @click="i++">Hello world {{ i }}</h1>
  <span>Your ip is: {{ ip }}</span>
</template>

<script>
  import { mapFields } from 'vuex-map-fields'
  import axios from 'axios'

  export default {
    name: 'IP',
    data() {
      return {
        i: 0
      }
    },
    computed: {
      ...mapFields([`ip`])
    },
    async serverPrefetch() {
      let res = await axios.get('https://api.ipify.org?format=json')
      this.ip = res.data.ip ?? '192.168.0.1'
    },
    mounted() {
      console.log('mounted')
    }
  }
</script>

<style lang="scss" scoped>
  h1 {
    user-select: none;
    cursor: pointer;
  }
</style>
