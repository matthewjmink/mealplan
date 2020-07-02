import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import loadingPlugin from './plugins/loading';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(loadingPlugin);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
