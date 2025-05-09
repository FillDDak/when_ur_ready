import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from "axios"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



loadFonts()
axios.baseURL = "/api"

var app = createApp(App)
app.config.globalProperties.$axios = axios

app.use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
