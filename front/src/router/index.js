import { createRouter, createWebHashHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import Chatbot from '../views/Chatbot.vue'
import DocumentChecker from '../views/DocumentChecker.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import Favorites from '../views/Favorites.vue'
import Review from '../views/Review.vue'
import MyPage from '../views/MyPage.vue'


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
  },

  { path: '/',
    name: 'MainView',
    component: MainView 
  },

  { path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },

  { path: '/review',
    name: 'Review',
    component: Review 
  },

  { path: '/mypage',
    name: 'MyPage',
    component: MyPage 
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
