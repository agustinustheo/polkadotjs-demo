import Vue from 'vue'
import App from './App.vue'
// import { enableExtension } from './extension'
// import { cryptoWaitReady } from '@polkadot/util-crypto'

Vue.config.productionTip = false;

// (async () => {
//   await cryptoWaitReady()
//   await enableExtension()
// })()

new Vue({
  render: h => h(App),
}).$mount('#app')
