const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/generate-questions': {  // /generate-questions 경로로 들어오는 요청을 프록시합니다.
        target: 'http://localhost:4000',  // 백엔드 서버가 실행되는 주소
        changeOrigin: true,  // 서버의 응답 헤더를 수정하여 CORS 문제를 해결합니다.
        // pathRewrite 부분을 제거합니다. 경로 재작성 없이 그대로 사용
        pathRewrite: {
          '^/generate-questions': '/generate-questions',  // 경로 재작성
        },
      },
    },
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})