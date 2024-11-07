<template>
  <v-app>
    <v-main>
      <v-container fluid class="hero-section" :style="{ backgroundImage: `url(${currentBackgroundImage})` }">
        <v-row align="center" justify="center"
          style="height: 100%; background-color: rgba(0, 0, 0, 0.5); padding: 0 20px;">
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
</template>

<script>
export default {
  data() {
    return {
      backgroundImages: [
        'https://cdn.pixabay.com/photo/2018/05/18/06/03/job-interview-3410427_1280.jpg',
        'https://cdn.pixabay.com/photo/2024/06/28/07/14/interview-8858772_1280.jpg',
        'https://cdn.pixabay.com/photo/2019/04/16/11/15/job-4131482_1280.jpg'
      ],
      currentBackgroundImage: '',
      features: [
        { title: '즐겨찾기', description: '자주 찾는 면접 질문이나 자료를 즐겨찾기에 추가하여 빠르게 다시 확인할 수 있습니다.', icon: 'mdi-star', color: 'yellow', link: '/favorites' },
        { title: '검토하기', description: '면접 준비 현황을 분석하여 개선이 필요한 부분을 파악하고 보다 전략적으로 준비할 수 있도록 도와드립니다.', icon: 'mdi-message', color: 'blue', link: '/review' },
        { title: '마이페이지', description: '자신의 면접 준비 기록을 저장하고 피드백 및 추천 사항을 관리할 수 있는 개인 맞춤형 공간입니다.', icon: 'mdi-book', color: 'green', link: '/mypage' }
      ],
      socialIcons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin'],
      isChatActive: false,
      messages: [{ id: 1, fromUser: false, text: "안녕하세요! 면접 준비를 도와드릴게요." }],
      userInput: ''
    };
  },
  mounted() {
    this.currentBackgroundImage = this.backgroundImages[0];
    setInterval(() => {
      const currentIndex = this.backgroundImages.indexOf(this.currentBackgroundImage);
      const nextIndex = (currentIndex + 1) % this.backgroundImages.length;
      this.currentBackgroundImage = this.backgroundImages[nextIndex];
    }, 5000);
  },
  methods: {
    sendMessage() {
      if (this.userInput.trim()) {
        this.messages.push({ id: this.messages.length + 1, fromUser: true, text: this.userInput });
        this.userInput = '';
        setTimeout(() => {
          this.messages.push({ id: this.messages.length + 1, fromUser: false, text: "면접에 대한 질문을 주세요!" });
        }, 1000);
      }
    }
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
  background-size: 70% auto;
  /* 세로 비율을 자동으로 조정 */
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-image 1s ease-in-out;
}</style>
