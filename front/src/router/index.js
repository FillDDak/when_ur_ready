import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import Chatbot from '../views/Chatbot.vue'
import DocumentChecker from '../views/DocumentChecker.vue'

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: Chatbot, // 챗봇 페이지를 설정합니다.
  },
  {
    path: '/documentchecker',
    name: 'DocumentChecker',
    component: DocumentChecker
  }
]


const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
