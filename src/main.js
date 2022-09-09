import { createApp } from 'vue'
import App from './App.vue'

//// 형제 컴포넌트 통신
import mitt from 'mitt'

export const emitter = mitt();
const app = createApp(App)
app.config.globalProperties.emitter = emitter
app.mount('#app')
////

// createApp(App).mount('#app')
// 시발 이 새끼가 문제 였네 개새끼
