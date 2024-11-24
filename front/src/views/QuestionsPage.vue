<template>
  <v-container class="pa-4">
    <v-row justify="center" class="question-feedback-row">
      <!-- 예상 질문 목록 -->
      <v-col
        v-bind:class="{'move-left': selectedQuestion && !loading}"
        cols="12"
        sm="6"
        md="4"
        class="text-center question-column"
      >
        <h1>예상 질문 목록</h1>
        <ul>
          <li
            v-for="(question, index) in questions"
            :key="index"
            @click="selectQuestion(question)"
            class="question-item"
          >
            {{ question }}
          </li>
        </ul>
      </v-col>

      <!-- 선택된 질문 -->
      <v-col
        v-bind:class="{'move-left': selectedQuestion && !loading && answer && !feedback}"
        cols="12"
        sm="6"
        md="4"
        class="text-center selected-question-column"
      >
        <div v-if="selectedQuestion">
          <h3>선택한 질문:</h3>
          <p>{{ selectedQuestion }}</p>

          <v-textarea
            v-model="answer"
            label="답변을 입력하세요"
            rows="4"
            outlined
            class="mt-4"
          ></v-textarea>

          <!-- 답변 분석 요청 버튼 -->
          <v-btn color="primary" @click="analyzeAnswer" class="mt-4">답변 분석 요청</v-btn>
        </div>
      </v-col>

      <!-- AI 코칭 피드백 영역 -->
      <v-col
        v-bind:class="{'move-right': feedback && !loading}"
        cols="12"
        sm="6"
        md="4"
        class="text-center feedback-column"
      >
        <!-- 분석된 피드백 표시 -->
        <div v-if="loading">
          <div class="loading-container">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p>답변 분석중...</p>
          </div>
        </div>
        <div v-if="feedback && !loading">
          <h1>AI 코칭 피드백</h1>

          <v-card class="feedback-card">
            <v-card-title class="feedback-title">
              <v-icon class="feedback-icon" color="green">mdi-thumb-up</v-icon>
              <span class="ml-2">AI 피드백</span>
            </v-card-title>
            <v-card-subtitle class="feedback-subtitle">
              <span>다음은 AI가 제공한 피드백입니다:</span>
            </v-card-subtitle>
            <v-card-text class="feedback-content">
              <div v-for="(feedbackParagraph, index) in splitFeedback(feedback)" :key="index">
                <p>{{ feedbackParagraph }}</p>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  data() {
    return {
      questions: [], // 예상 질문 목록
      selectedQuestion: null, // 선택된 질문
      answer: "", // 답변 입력값
      loading: false, // 로딩 상태
      feedback: null, // 분석된 피드백
    };
  },
  mounted() {
    const route = useRoute();

    // URL에서 전달된 쿼리 파라미터로 질문 목록 받아오기
    const questionsQuery = route.query.questions;
    if (questionsQuery) {
      this.questions = JSON.parse(decodeURIComponent(questionsQuery)); // JSON 파싱하여 배열로 저장
    }
  },
  methods: {
    // 질문 선택 시 해당 질문을 selectedQuestion에 저장하고 피드백 초기화
    selectQuestion(question) {
      this.selectedQuestion = question;
      this.feedback = null; // 이전 질문의 피드백을 초기화
    },

    // 답변 분석을 위한 요청 (AI 피드백 받기)
    async analyzeAnswer() {
      if (this.answer.trim() === "") {
        alert("답변을 입력해주세요.");
        return;
      }

      // 로딩 상태 활성화
      this.loading = true;

      try {
        // API 요청을 보내서 AI 피드백을 받음
        const response = await axios.post("http://localhost:3000/analyze-answer", {
          answer: this.answer,
        });

        // 로컬 저장소에 피드백 저장
        this.feedback = response.data.feedback;
      } catch (error) {
        console.error("AI 피드백 분석 오류:", error);
        alert("답변 분석을 요청하는 데 실패했습니다.");
      } finally {
        // 분석 완료 후 로딩 상태 종료
        this.loading = false;
      }
    },

    // 피드백을 단락별로 나누는 메서드
    splitFeedback(feedback) {
      // 피드백 내용을 단락으로 분할 (예: "\n"을 기준으로)
      return feedback.split('\n').filter(paragraph => paragraph.trim() !== "");
    }
  },
};
</script>

<style scoped>
.question-feedback-row {
  display: flex;
  transition: transform 0.5s ease;
  justify-content: space-between; /* 각 컬럼 사이의 간격 조정 */
}

.question-column,
.selected-question-column,
.feedback-column {
  transition: transform 0.5s ease;
  position: relative;
  max-width: 30%; /* 각 컬럼의 너비를 30%로 제한하여 화면에 잘 맞게 */
}

.move-left {
  transform: translateX(-20%); /* 질문 목록과 선택된 질문 왼쪽으로 이동 */
}

.move-right {
  transform: translateX(20%); /* 피드백 영역 오른쪽으로 이동 */
}

.question-item {
  font-size: 1.2rem;
  margin: 10px 0;
  cursor: pointer;
  color: #000000;
  text-decoration: underline;
}

.question-item:hover {
  color: #1565c0;
}

.mt-4 {
  margin-top: 16px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
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
</style>
