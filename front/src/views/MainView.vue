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
      <v-container fluid class="hero-section" style="background-image: url('https://picsum.photos/1920/1080');">
        <v-row align="center" justify="center" style="height: 100%;">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 font-weight-bold white--text mb-4">어서오세요</h1>
            <p class="text-h5 white--text mb-8">혁신적인 면접 준비 사이트</p>
            <v-btn x-large color="secondary" @click="$router.push('/chatbot')">시작하기</v-btn>

          </v-col>
        </v-row>
      </v-container>

      <v-container class="py-12">
        <v-row>
          <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
            <v-card class="mx-auto" max-width="400">
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

const features = ref([
  { title: 'Feature 1', description: 'Description of feature 1', icon: 'mdi-star', color: 'primary' },
  { title: 'Feature 2', description: 'Description of feature 2', icon: 'mdi-lightbulb', color: 'secondary' },
  { title: 'Feature 3', description: 'Description of feature 3', icon: 'mdi-rocket', color: 'success' },
])

const socialIcons = ref(['mdi-twitter', 'mdi-facebook', 'mdi-instagram', 'mdi-linkedin'])

// 챗봇 UI 관련 변수 설정
const isChatActive = ref(false);
const messages = ref([]);
const userInput = ref('');

const startChat = () => {
  isChatActive.value = true; // 챗봇 UI 활성화
  messages.value.push({ id: messages.value.length + 1, text: "안녕하세요! 면접 준비를 도와드리겠습니다.", fromUser: false }); // 챗봇 시작 메시지
}

const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ id: messages.value.length + 1, text: userInput.value, fromUser: true }); // 사용자 메시지 추가
    userInput.value = ''; // 입력 필드 초기화
    // 여기서 챗봇의 응답 로직을 추가할 수 있습니다.
  }
}
</script>

<style scoped>
.hero-section {
  height: 80vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-ui {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
  position: relative;
  margin: 20px;
}

.chat-title {
  margin-bottom: 16px;
}

.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.user-message {
  text-align: right;
  color: blue;
  /* 사용자 메시지 색상 */
}

.bot-message {
  text-align: left;
  color: green;
  /* 챗봇 메시지 색상 */
}
</style>