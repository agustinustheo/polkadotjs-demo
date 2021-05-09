<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="150">
  </div>
</template>

<script>
import { startApp } from '@/lib/metamask'
import { getBalance } from '@/lib/metamask/wallet'

export default {
  name: 'App',
  data: () => ({
    currentAccount: ''
  }),
  async mounted() {
    await startApp()
    let balance = await getBalance('0xDb9Af2d1f3ADD2726A132AA7A65Cc9E6fC5761C3')
    alert(balance)
  },
  methods:{
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
