import { createRouter, createWebHashHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import Chatbot from '../views/Chatbot.vue';
import DocumentChecker from '../views/DocumentChecker.vue';
import SignUp from '../views/SignUp.vue';
import Favorites from '../views/Favorites.vue';
import Review from '../views/Review.vue';
import MyPage from '../views/MyPage.vue';
import ChatBotPage from '@/views/ChatBotPage.vue';
import Example from '../views/Example.vue';
import About from '../views/About.vue';
import QuestionsPage from "@/views/QuestionsPage.vue";
import FeedbackPage from "@/views/FeedbackPage.vue"; // 피드백 페이지 임포트

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView,
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: Chatbot, 
  },
  {
    path: '/chatbot',  
    name: 'chatbotpage',
    component: ChatBotPage,
  },
  {
    path: '/documentchecker',
    name: 'DocumentChecker',
    component: DocumentChecker,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/review',
    name: 'Review',
    component: Review,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
  },
  { 
    path: '/mypage',
    name: 'MyPage',
    component: MyPage,
  },
  {
    path: '/example',
    name: 'Example',
    component: Example,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: "/questions", 
    name: "questionspage", 
    component: QuestionsPage,
  },
  {
    path: "/feedback",  
    name: "feedback",   
    component: FeedbackPage,  
    props: route => ({
      feedbackId: route.query.feedbackId, 
    }),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
