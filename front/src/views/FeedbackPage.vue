<template>
  <v-container class="pa-4">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <h1 class="page-title">AI 코칭 피드백</h1>

        <!-- 피드백 내용 -->
        <v-card v-if="feedback" class="feedback-card">
          <v-card-title class="feedback-title">
            <v-icon class="feedback-icon" color="green">mdi-thumb-up</v-icon>
            <span class="ml-2">AI 피드백</span>
          </v-card-title>
          <v-card-subtitle class="feedback-subtitle">
            <span>다음은 AI가 제공한 피드백입니다:</span>
          </v-card-subtitle>
          <v-card-text class="feedback-content">
            <p>{{ feedback }}</p>
          </v-card-text>
        </v-card>

        <!-- 피드백 없을 때 안내 메시지 -->
        <v-alert v-else type="error" class="mt-4 alert-message" :style="{ maxWidth: '600px', margin: '0 auto' }">
          피드백을 찾을 수 없습니다. 다시 시도해주세요.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  data() {
    return {
      feedback: null, // AI 피드백
    };
  },
  mounted() {
    const route = useRoute();

    // URL에서 전달된 피드백 ID로 로컬 저장소에서 피드백을 가져오기
    const feedbackId = route.query.feedbackId;
    if (feedbackId) {
      const storedFeedback = localStorage.getItem(feedbackId);
      if (storedFeedback) {
        this.feedback = JSON.parse(storedFeedback); // 로컬 저장소에서 피드백을 가져와 표시
      } else {
        console.error("피드백을 찾을 수 없습니다.");
        this.feedback = "피드백을 찾을 수 없습니다.";
      }
    } else {
      console.error("피드백 ID가 제공되지 않았습니다.");
      this.feedback = "피드백 ID가 제공되지 않았습니다.";
    }
  },
};
</script>

<style scoped>
.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 20px;
}

.feedback-card {
  background-color: #f1f8e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feedback-title {
  font-size: 1.5rem;
  color: #388e3c;
  display: flex;
  align-items: center;
}

.feedback-icon {
  font-size: 2rem;
}

.feedback-subtitle {
  font-size: 1rem;
  color: #607d8b;
  margin-bottom: 16px;
}

.feedback-content {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
}

.alert-message {
  font-size: 1.2rem;
  text-align: center;
  color: #fff;
  background-color: #f44336;
  border-radius: 5px;
}
</style>
