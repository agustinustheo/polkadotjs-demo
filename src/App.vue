<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="150">
  </div>
</template>

<script>
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/keyring'
import { ApiPromise, WsProvider } from '@polkadot/api'
import types from './types.json'
// import { u8aToString } from '@polkadot/util'

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
    // let acc = await web3Accounts()
    // console.log(acc);
    // const { ethereum } = window;
    // if(ethereum && ethereum.isMetaMask){
    //   alert('MetaMask installed')
    //   await ethereum.request({ method: 'eth_requestAccounts' });
    // }
    // else{
    //   alert('MetaMask not installed')
    // }
    this.generateAccount()
    await this.connectToBlockchain()
    await this.getService()
    // await this.getBalance(this.pair.address)
  },
  methods: {
    generateAccount() {
      // type: ed25519, ssFormat: 42 (all defaults)
      const keyring = new Keyring()
      this.mnemonic = mnemonicGenerate()

      console.log(this.mnemonic)
      this.pair = keyring.addFromUri(this.mnemonic, 'ed25519')

      console.log(this.pair.address)
    },
    async connectToBlockchain() {
      const wsProvider = new WsProvider('wss://debio.theapps.dev/node')
      const api = await ApiPromise.create({
        provider: wsProvider,
        types: types
      })
      this.api = api
    },
    async getService(){
      // // Retrieve the chain & node information information via rpc calls
      // const [chain, nodeName, nodeVersion] = await Promise.all([
      //   this.api.rpc.system.chain(),
      //   this.api.rpc.system.name(),
      //   this.api.rpc.system.version()
      // ])
      // console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`)// Retrieve the chain name
      
      // // Retrieve chain properties
      // const chainInfo = await this.api.registry.getChainProperties()
      // console.log(`Chain properties ${chainInfo}`)

      // Insert chain properties
      const data = await this.api.tx.labs.registerLab({
        "name": "Singapore Hololive Lab Kawaii",
        "country": "Singapore",
        "city": "Singapore",
        "address": "you will never know"
      })
      .signAndSend(this.pair)
      console.log(data)

      
      // Retrieve chain properties
      const data2 = await this.api.query.labs.labsByCountryCity("Indonesia", "Jakarta")
      const keyring = new Keyring()
      console.log(keyring.encodeAddress(data2.value[0], 42))
      
      // // Retrieve the latest header
      // const lastHeader = await this.api.rpc.chain.getHeader()
      // console.log(`Latest blockchain header ${lastHeader}`)
    },
    async getBalance(addr) {
      const data = await this.api.query.system.account(addr)
      console.log(data)
      // this.nonce = nonce
      // this.balanceFree = balance.free
      // console.log(`Nonce and balance free for the account in these addresses ${nonce} and ${balance.free}`)
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
