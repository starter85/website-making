import Vue from "vue";
import App from "./App.vue";
import router from './router'

Vue.config.productionTip = false

// 형제 컴포넌트 통신 하기위한 코드
export const eventBus = new Vue()

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
