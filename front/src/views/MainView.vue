<template>
  <v-app>
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
    
    <!-- 푸터 -->
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

<script>
export default {
  data() {
    return {
      // 소셜 아이콘
      socialIcons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin'],

      // 백그라운드 이미지 관련
      backgroundImages: [
        'https://cdn.pixabay.com/photo/2018/05/18/06/03/job-interview-3410427_1280.jpg',
        'https://cdn.pixabay.com/photo/2024/06/28/07/14/interview-8858772_1280.jpg',
        'https://cdn.pixabay.com/photo/2019/04/16/11/15/job-4131482_1280.jpg',
      ],
      currentBackgroundImage: 'https://cdn.pixabay.com/photo/2018/05/18/06/03/job-interview-3410427_1280.jpg',

      // 챗봇 관련
      isChatActive: false,
      messages: [{ id: 1, fromUser: false, text: '안녕하세요! 면접 준비를 도와드릴게요.' }],
      userInput: '',
    };
  },
  mounted() {
    // 백그라운드 이미지 자동 변경
    this.startBackgroundImageRotation();
  },
  methods: {
    startBackgroundImageRotation() {
      setInterval(() => {
        const currentIndex = this.backgroundImages.indexOf(this.currentBackgroundImage);
        const nextIndex = (currentIndex + 1) % this.backgroundImages.length;
        this.currentBackgroundImage = this.backgroundImages[nextIndex];
      }, 5000);
    },
    sendMessage() {
      if (this.userInput.trim()) {
        this.messages.push({ id: this.messages.length + 1, fromUser: true, text: this.userInput });
        this.userInput = '';
        setTimeout(() => {
          this.messages.push({ id: this.messages.length + 1, fromUser: false, text: '면접에 대한 질문을 주세요!' });
        }, 1000);
      }
    },
  },
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
</style>
