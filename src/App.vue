<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="150">
  </div>
</template>

<script>
import { registerLab } from './lib/polkadotProvider/command/labs'
// import { createService } from './lib/polkadotProvider/command/services'
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
    try {
      this.generateAccount()
      await this.connectToBlockchain()
      await this.createLab()
      await this.createService()
      this.getBalance()
    } catch (err) {
      console.log(err)
    }
  },
  methods:{
    generateAccount() {
      // type: ed25519, ssFormat: 42 (all defaults)
      const keyring = new Keyring()
      this.mnemonic = 'soccer parade lottery sock aunt girl cool smooth make teach sell consider'

      console.log(this.mnemonic)
      this.pair = keyring.addFromUri(this.mnemonic, 'ed25519')

      console.log('this is the address', this.pair.address)
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
        "country": "SG",
        "region": "SG",
        "city": "SG",
        "address": "you will never know"
      });
      console.log(data)
      
      // Retrieve chain properties
      const labData = await queryLabsByCountryRegionCity(this.api, "SG-SG", "SIN")
      console.log(labData)
    },
    async createService(){
      let lab = await this.api.query.labs.labs(this.pair.address)
      lab = lab.toHuman()
      if (lab.services.length >= 10 ) {
        console.log('already have at least 10 services')
        await this.deleteAllServices()
      }
      // Insert chain properties
      for(let i = 1; i <= 10; i++){
        // Need the nonce to make consecutive transactions
        // retrieve sender's next index/nonce, taking txs in the pool into account
        const nonce = await this.api.rpc.system.accountNextIndex(this.pair.address);

        const txHash = await this.api.tx.services
          .createService({
            "name": "Singapore Hololive Genetics " + i,
            "price": "2",
            "category": "genetic",
            "description": `Singapore Hololive Genetics ${i} Description`
          })
          .signAndSend(this.pair, { nonce }) // Pass the nonce here

        console.log('Created Service')
        console.log(`txHash: ${txHash}`)
      }
      // Retrieve chain properties
      // FIXME: query ini sudah tidak ada 
      // const serviceData = await queryServicesByCountryRegionCity(this.api, "SG", "SIN")
      // console.log(serviceData)
    },
    async getBalance() {
      const data = await queryBalance(this.api, this.pair.address)
      console.log('Balance: ' + data.data.free.toString())
    },
    async deleteAllServices() {
      let lab = await this.api.query.labs.labs(this.pair.address)
      lab = lab.toHuman()
      for (let serviceId of lab.services) {
        const txHash = await this.api.tx.services
          .deleteService(serviceId)
          .signAndSend(this.pair, { nonce: -1 }) // use nonce -1 to have the api automatically configure correct nonce

        console.log(`deleted service: ${serviceId}`)
        console.log(`txHash: ${txHash}`)
      }
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
