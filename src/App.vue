<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="150">
  </div>
</template>

<script>
import { registerLab } from './lib/polkadotProvider/command/labs'
import { createService } from './lib/polkadotProvider/command/services'
import { queryLabsByCountryRegionCity } from './lib/polkadotProvider/query/labs'
import { queryBalance } from './lib/polkadotProvider/query/balance'
import { Keyring } from '@polkadot/keyring'
import { ApiPromise, WsProvider } from '@polkadot/api'
import types from './types.json'

export default {
  name: 'App',
  data: () => ({
    mnemonic: '',
    pair: null,
    api: null,
  }),
  async mounted() {
    this.generateAccount()
    await this.connectToBlockchain()
    await this.createLab()
    await this.createService()
    this.getBalance()
  },
  methods:{
    generateAccount() {
      // type: ed25519, ssFormat: 42 (all defaults)
      const keyring = new Keyring()
      this.mnemonic = 'soccer parade lottery sock aunt girl cool smooth make teach sell consider'

      console.log(this.mnemonic)
      this.pair = keyring.addFromUri(this.mnemonic, 'ed25519')

      console.log(this.pair.address)
    },
    async connectToBlockchain() {
      const wsProvider = new WsProvider('wss://debio.theapps.dev/node')
      this.api = await ApiPromise.create({
        provider: wsProvider,
        types: types
      })
    },
    async createLab(){
      // Insert chain properties
      const data = await registerLab(this.api, this.pair, {
        "name": "Singapore Hololive Lab Kawaii",
        "email": "email@mail.com",
        "country": "SG-SG",
        "city": "SG",
        "address": "you will never know"
      });
      console.log(data)
      
      // Retrieve chain properties
      const labData = await queryLabsByCountryRegionCity(this.api, "SG", "SIN")
      console.log(labData)
    },
    async createService(){
      // Insert chain properties
      for(let i = 1; i <= 10; i++){
        const data2 = await createService(this.api, this.pair, {
          "name": "Singapore Hololive Genetics 2",
          "price": "2",
          "category": "genetic",
          "description": "Singapore Hololive Genetics 2 Description"
        });
        console.log(data2)
      }
      
      // Retrieve chain properties
      // const serviceData = await queryServicesByCountryRegionCity(this.api, "SG", "SIN")
      // console.log(serviceData)
    },
    async getBalance() {
      const data = await queryBalance(this.api, this.pair.address)
      console.log('Balance: ' + data)
    }
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
