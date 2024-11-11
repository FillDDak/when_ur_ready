import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import Chatbot from '../views/Chatbot.vue'
import DocumentChecker from '../views/DocumentChecker.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Favorites from '../views/Favorites.vue'
import Review from '../views/Review.vue'
import MyPage from '../views/MyPage.vue'
import ChatBotPage from '@/views/ChatBotPage.vue'

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
    path: '/chatbotpage',  
    name: 'ChatBotPage',
    component: ChatBotPage,
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
<<<<<<< HEAD
    path: '/review',
    name: 'Review',
    component: Review 
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/mypage',
=======
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/review',  
    name: 'Review',  
    component: Review
  },
  { path: '/mypage',
>>>>>>> 5abd3382bfaaebd7bc6e6cda18c83fc6a03c7aac
    name: 'MyPage',
    component: MyPage 
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
