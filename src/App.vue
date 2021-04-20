<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="150">
  </div>
</template>

<script>
import { connectToBlockchain } from '@/lib/polkadotProvider'
import { queryLabsByCountryCity, queryLabsById } from '@/lib/polkadotProvider/query/labs'

export default {
  name: 'App',
  data: () => ({
    mnemonic: '',
    pair: null,
    api: null,
    balanceFree: null,
    nonce: 0,
  }),
  async mounted() {
    await this.connectToBlockchain()
    let labsByCountryCity = await this.getLabsByCountryCity('Indonesia', 'Jakarta')
    let lab = await this.getLabsById(labsByCountryCity[0])
    console.log(lab.name)
  },
  methods: {
    async connectToBlockchain() {
      this.api = await connectToBlockchain()
    },
    async getLabsByCountryCity(country, city){
      return await queryLabsByCountryCity(this.api, country, city)
    },
    async getLabsById(labId){
      return await queryLabsById(this.api, labId)
    }
  }
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
