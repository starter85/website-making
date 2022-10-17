const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave:false // 기존 프로젝트에서 vuetify 추가 후 npm audit fix --force하라고 떠서 진행후 [eslint] ESLint is not a constructor 라고 생기는 error 해결
})
