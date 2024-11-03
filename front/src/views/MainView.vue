<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>준비되면</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn text>Home</v-btn>
      <v-btn text>About</v-btn>
      <v-btn text>Services</v-btn>
      <v-btn text>Contact</v-btn>
    </v-app-bar>

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
          <p :class="{'user-message': msg.fromUser, 'bot-message': !msg.fromUser}">{{ msg.text }}</p>
        </div>
        <v-text-field v-model="userInput" @keyup.enter="sendMessage" label="메시지를 입력하세요"></v-text-field>
        <v-btn @click="sendMessage" color="secondary">전송</v-btn>
      </div>
    </v-main>

    <v-footer app color="primary" dark>
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
  color: blue; /* 사용자 메시지 색상 */
}

.bot-message {
  text-align: left;
  color: green; /* 챗봇 메시지 색상 */
}
</style>
