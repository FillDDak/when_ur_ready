import { createRouter, createWebHashHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import Chatbot from '../views/Chatbot.vue';
import ChatBotPage from '@/views/ChatBotPage.vue';
import DocumentChecker from '../views/DocumentChecker.vue';
import SignUp from '../views/SignUp.vue';
import Favorites from '../views/Favorites.vue';
import MyPage from '../views/MyPage.vue';
import Example from '../views/Example.vue';
import About from '../views/About.vue';
import QuestionsPage from "@/views/QuestionsPage.vue";
import FeedbackPage from "@/views/FeedbackPage.vue"; 
import PredictQuestions from '../views/PredictQuestions.vue'; 
import CompanyQuestions from '../views/CompanyQuestions.vue';
import FaceRecognition from '../views/FaceRecognition.vue';
import InterviewStudyBoard from '../views/InterviewStudyBoard.vue';

const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
  },
  {
    path: '/chatbot',
    name: 'Chatbot',
    component: Chatbot
  },
  {
    path: '/chatbotpage',  
    name: 'chatbotpage',
    component: ChatBotPage
  },
  {
    path: '/documentchecker',
    name: 'DocumentChecker',
    component: DocumentChecker
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  { 
    path: '/mypage',
    name: 'MyPage',
    component: MyPage
  },
  {
    path: '/example',
    name: 'Example',
    component: Example
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: "/questions", 
    name: "questions", 
    component: QuestionsPage
  },
  {
    path: "/feedback",  
    name: "feedback",   
    component: FeedbackPage,  
    props: route => ({
      feedbackId: route.query.feedbackId, 
    }),
  },
  {
    path: '/predict-questions',
    name: 'predict-questions',
    component: PredictQuestions
  },
  {
    path: '/company-questions',
    name: 'company-questions',
    component: CompanyQuestions
  },
  {
    path: '/facerecognition',  
    name: 'FaceRecognition',  
    component: FaceRecognition
  },
  {
    path: '/interviewstudyboard',
    name: 'InterviewStudyBoard',
    component: InterviewStudyBoard
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
