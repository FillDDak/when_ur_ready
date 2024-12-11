<template>
  <v-app>
    <v-main class="main-content">
      <v-container
        fluid
        class="hero-section pa-0"
        :style="{ backgroundImage: `url(${currentBackgroundImage})` }"
      >
        <v-row
          align="center"
          justify="center"
          style="
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 0 20px;
          "
        >
          <v-col cols="12" md="8" class="text-center text-white">
            <h1 class="text-h2 font-weight-bold mb-4">반갑습니다!</h1>
            <p class="text-h5 mb-8">당신의 면접을 위한 맞춤형 지원 서비스</p>
            <v-btn x-large color="secondary" @click="$router.push('/chatbot')"
              >면접 준비를 시작해보세요!</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- 푸터 -->
    <v-footer app style="background-color: white" :height="90">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="text-center text-md-left">
            &copy; {{ new Date().getFullYear() }} Our Website. All rights
            reserved.
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <v-btn
              v-for="(icon, index) in socialIcons"
              :key="icon.name"
              @click="openLink(icon.link)"
              icon
              class="mx-1"
            >
              <v-icon>{{ icon.name }}</v-icon>
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
      socialIcons: [
        { name: "mdi-github", link: "https://github.com/seokmin1215/when_ur_ready" },
        { name: "mdi-twitter", link: "https://x.com" },
        { name: "mdi-facebook", link: "https://facebook.com" },
      ],

      // 백그라운드 이미지 관련
      backgroundImages: [
        "https://cdn.pixabay.com/photo/2018/05/18/06/03/job-interview-3410427_1280.jpg",
        "https://cdn.pixabay.com/photo/2024/06/28/07/14/interview-8858772_1280.jpg",
        "https://cdn.pixabay.com/photo/2019/04/16/11/15/job-4131482_1280.jpg",
      ],
      currentBackgroundImage:
        "https://cdn.pixabay.com/photo/2018/05/18/06/03/job-interview-3410427_1280.jpg",
    };
  },
  mounted() {
    // 백그라운드 이미지 자동 변경
    this.startBackgroundImageRotation();
  },
  methods: {
    startBackgroundImageRotation() {
      setInterval(() => {
        const currentIndex = this.backgroundImages.indexOf(
          this.currentBackgroundImage
        );
        const nextIndex = (currentIndex + 1) % this.backgroundImages.length;
        this.currentBackgroundImage = this.backgroundImages[nextIndex];
      }, 5000);
    },
    openLink(link) {
      if (typeof window !== "undefined") {
        window.open(link, "_blank");
      }
    },
  },
};
</script>

<style scoped>
/* 전체 화면 높이를 계산 */
.main-content {
  min-height: calc(100vh - 90px - 56px);
  /* 90px은 앱 바 높이, 56px은 푸터 높이 */
}

.hero-section {
  height: 100%;
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
