<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" width="150">
  </div>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    ethereum: ''
  }),
  async mounted() {
    const { ethereum } = window
    this.ethereum = ethereum
    if(this.isMetaMaskInstalled()){
      this.connectToMetaMask()
    }
    else{
      alert("Install MetaMask")
    }
  },
  method:{
    isMetaMaskInstalled(){
      return Boolean(this.ethereum && this.ethereum.isMetaMask);
    },
    async connectToMetaMask(){
      try {
        await this.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error(error);
      }
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
