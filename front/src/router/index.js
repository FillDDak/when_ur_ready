import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import Chatbot from '../views/Chatbot.vue'
import DocumentChecker from '../views/DocumentChecker.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: Chatbot, 
  },
  {
    path: '/documentchecker',
    name: 'DocumentChecker',
    component: DocumentChecker
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/review',  
    name: 'Review',  
    component: DocumentChecker 
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
