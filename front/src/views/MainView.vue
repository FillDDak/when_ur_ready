<template>
  <v-app>
    <!-- 앱 바 -->
    <v-app-bar :elevation="0" app dark :height="90">
      <v-app-bar-title>
        <v-img src="../assets/readylogo.png" alt="Logo" contain max-width="250" class="mr-2" @click="$router.push('/')"
          style="cursor: pointer;"></v-img>
      </v-app-bar-title>
      <v-spacer></v-spacer>
     
      <v-btn class="mr-2">Home</v-btn>
      <v-btn class="mr-2">About</v-btn>
      <v-btn class="mr-2">Services</v-btn>
      <v-btn class="mr-2">Contact</v-btn>
      <v-btn style="background-color: #BADC6B; font-size: 16px;" class="mr-2" rounded="xl" @click="loginDialog = true">로그인</v-btn>
      <v-btn style="background-color: lightgray; font-size: 16px;" class="mr-3" rounded="xl" @click="signupDialog = true">회원가입</v-btn>
    </v-app-bar>

    <!-- 로그인 다이얼로그 -->
    <v-dialog v-model="loginDialog" max-width="400">
      <v-card>
        <v-img src="../assets/readylogo.png" alt="Logo" contain max-height="100"></v-img>
        <v-card-text>
          <h3>이메일</h3>
          <v-text-field label="이메일" v-model="email"></v-text-field>
          <h3>비밀번호</h3>
          <v-text-field label="비밀번호" v-model="password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-center">
          <v-btn style="background-color: #BADC6B;" @click="login" class="mb-2" rounded="xl" size="x-large" width="300">로그인</v-btn>
          <v-btn style="border: 2px solid #BADC6B;" @click="loginDialog = false" class="mb-2" rounded="xl" size="x-large" width="300" outlined>취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 회원가입 다이얼로그 -->
    <v-dialog v-model="signupDialog" max-width="400">
      <v-card>
        <v-img src="../assets/readylogo.png" alt="Logo" contain max-height="100"></v-img>
        <v-card-text>
          <h3>이메일</h3>
          <v-text-field label="이메일" v-model="email"></v-text-field>
          <h3>비밀번호</h3>
          <v-text-field label="비밀번호" v-model="password" type="password"></v-text-field>
          <h3>비밀번호 재입력</h3>
          <v-text-field label="비밀번호" v-model="password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-center">
          <v-btn style="background-color: #BADC6B;" @click="signup" class="mb-2" rounded="xl" size="x-large" width="300">회원가입</v-btn>
          <v-btn style="border: 2px solid #BADC6B;" @click="signupDialog = false" class="mb-2" rounded="xl" size="x-large" width="300" outlined>취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <v-container fluid class="hero-section" :style="{ backgroundImage: `url(${currentBackgroundImage})` }">
        <v-row align="center" justify="center" style="height: 100%; background-color: rgba(0, 0, 0, 0.5); padding: 0 20px;">
          <v-col cols="12" md="8" class="text-center text-white">
            <h1 class="text-h2 font-weight-bold mb-4">반갑습니다!</h1>
            <p class="text-h5 mb-8">당신의 면접을 위한 맞춤형 지원 서비스</p>
            <v-btn x-large color="secondary" @click="$router.push('/chatbot')">면접 준비를 시작해보세요!</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="py-12">
        <v-row>
          <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
            <v-card class="mx-auto" max-width="400" @click="$router.push(feature.link)" style="cursor: pointer;">
              <v-card-title>
                <v-icon left :color="feature.color" class="mr-2">{{ feature.icon }}</v-icon>
                {{ feature.title }}
              </v-card-title>
              <v-card-text>{{ feature.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- 챗봇 UI 추가 -->
      <div v-if="isChatActive" class="chatbot-ui">
        <h2 class="chat-title">챗봇과 대화하기</h2>
        <div class="messages" v-for="msg in messages" :key="msg.id">
          <p :class="{ 'user-message': msg.fromUser, 'bot-message': !msg.fromUser }">{{ msg.text }}</p>
        </div>
        <v-text-field v-model="userInput" @keyup.enter="sendMessage" label="메시지를 입력하세요"></v-text-field>
        <v-btn @click="sendMessage" color="secondary">전송</v-btn>
      </div>
    </v-main>

    <v-footer app color="white">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="text-center text-md-left">
            &copy; {{ new Date().getFullYear() }} My Website. All rights reserved.
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <v-btn v-for="icon in socialIcons" :key="icon" icon class="mx-1">
              <v-icon>{{ icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
  <div class="book-container">
  <div class="page" style="background-image: url('image1.jpg');"></div>
  <div class="page" style="background-image: url('image2.jpg');"></div>
  <div class="page" style="background-image: url('image3.jpg');"></div>
</div>
</template>

<script setup>
import { ref } from 'vue'

const loginDialog = ref(false); // Dialog 표시 상태
const signupDialog = ref(false); // Dialog 표시 상태

// 로그인 입력 필드
const email = ref('');
const password = ref('');

// 회원가입 입력 필드
const signupEmail = ref('');
const signupPassword = ref('');
const signupPasswordConfirm = ref('');

// 로그인 함수
const login = () => {
  console.log("로그인 시도:", email.value, password.value);
  loginDialog.value = false; // 로그인 후 다이얼로그 닫기
};

// 회원가입 함수
const signup = () => {
  console.log("회원가입 시도:", signupEmail.value, signupPassword.value, signupPasswordConfirm.value);
  signupDialog.value = false; // 회원가입 후 다이얼로그 닫기
};

// 백그라운드 이미지 배열
const backgroundImages = [
  'https://cdn.pixabay.com/photo/2018/05/18/06/03/job-interview-3410427_1280.jpg',
  'https://cdn.pixabay.com/photo/2024/06/28/07/14/interview-8858772_1280.jpg',
  'https://cdn.pixabay.com/photo/2019/04/16/11/15/job-4131482_1280.jpg'
];

const currentBackgroundImage = ref(backgroundImages[0]); // 초기 이미지 설정

// 이미지 자동 변경 (5초마다)
setInterval(() => {
  const currentIndex = backgroundImages.indexOf(currentBackgroundImage.value);
  const nextIndex = (currentIndex + 1) % backgroundImages.length;
  currentBackgroundImage.value = backgroundImages[nextIndex];
}, 5000);

const features = ref([
  { title: '즐겨찾기', description: '자주 찾는 면접 질문이나 자료를 즐겨찾기에 추가하여 빠르게 다시 확인할 수 있습니다.', icon: 'mdi-star', color: 'yellow', link: '/favorites' },
  { title: '검토하기', description: '면접 준비 현황을 분석하여 개선이 필요한 부분을 파악하고 보다 전략적으로 준비할 수 있도록 도와드립니다.', icon: 'mdi-message', color: 'blue', link: '/review' },
  { title: '마이페이지', description: '자신의 면접 준비 기록을 저장하고 피드백 및 추천 사항을 관리할 수 있는 개인 맞춤형 공간입니다.', icon: 'mdi-book', color: 'green', link: '/mypage' }
]);


const socialIcons = ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin'];

// 챗봇 관련 상태
const isChatActive = ref(false);
const messages = ref([{ id: 1, fromUser: false, text: "안녕하세요! 면접 준비를 도와드릴게요." }]);
const userInput = ref('');

// 메시지 전송 함수
const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ id: messages.value.length + 1, fromUser: true, text: userInput.value });
    userInput.value = '';
    // 자동 응답 메시지 추가 (간단한 예)
    setTimeout(() => {
      messages.value.push({ id: messages.value.length + 1, fromUser: false, text: "면접에 대한 질문을 주세요!" });
    }, 1000);
  }
};
</script>

<style scoped>
.hero-section {
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-ui {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.chatbot-ui .messages {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.chatbot-ui .user-message {
  text-align: right;
  color: blue;
}

.chatbot-ui .bot-message {
  text-align: left;
  color: green;
}
.hero-section {
  height: 100vh;
  background-size: 70% auto; /* 세로 비율을 자동으로 조정 */
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-image 1s ease-in-out;
}
</style>
