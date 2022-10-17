import Vue from "vue";
import App from "./App.vue";
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// 형제 컴포넌트 통신 하기위한 코드
export const eventBus = new Vue()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
