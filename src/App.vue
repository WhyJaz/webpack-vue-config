<template>
  <div>
    app
    fsad
    <el-button>按钮</el-button>
    <Home></Home>
    <img src="./assets/images/tx3.png" alt="">
  </div>
</template>

<script>
import Home from './views/home'
import './views/home/components/a.js'

export default {
  name: '',
  components: {
    Home
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
  div {
    background-color: cyan;
  }
</style>