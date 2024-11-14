import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

loadFonts()
axios.baseURL = "/api"

var app = createApp(App)
app.config.globalProperties.$axios = axios

app.use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
