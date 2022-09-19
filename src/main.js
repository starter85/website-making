import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false

// 형제 컴포넌트 통신 하기위한 코드
export const eventBus = new Vue()

new Vue({
  render: h => h(App)
}).$mount("#app");
