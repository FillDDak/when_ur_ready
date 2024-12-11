<template>
  <v-container class="pa-4">
    <v-row justify="center" class="question-feedback-row">
      <!-- 예상 질문 목록 -->
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center question-column"
      >
        <h1>예상 질문 목록</h1>
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(item, index) in questions"
              :key="index"
              @click="isKeyword(item) ? null : selectQuestion(item)"
              class="question-item-box"
              :disabled="isKeyword(item)"
            >
              <v-card class="question-card">
                <v-card-text>
                  <span v-if="isKeyword(item)" class="keyword-text">{{ item }}</span>
                  <span v-else>{{ item }}</span>
                </v-card-text>
              </v-card>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>

      <!-- 선택된 질문 및 답변 분석 -->
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center selected-question-column"
      >
        <div v-if="selectedQuestion">
          <h3>선택한 질문:</h3>
          <p>{{ selectedQuestion }}</p>

          <!-- 스타일링된 텍스트박스 -->
          <v-textarea
            v-model="answer"
            label="답변을 입력하세요"
            rows="4"
            outlined
            class="styled-textarea mt-4"
          ></v-textarea>

          <!-- 답변 분석 요청 버튼 -->
          <div class="button-container">
            <v-btn color="primary" @click="analyzeAnswer" class="mt-4">답변 분석 요청</v-btn>

            <!-- 답변 저장하기 버튼 -->
            <v-btn color="secondary" @click="saveAnswer" class="mt-4 ml-2">답변 저장하기</v-btn>
          </div>
        </div>
      </v-col>

      <!-- AI 코칭 피드백 -->
      <v-col
        cols="12"
        sm="6"
        md="4"
        class="text-center feedback-column"
      >
        <div v-if="loading">
          <div class="loading-container">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
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

          <!-- 피드백 저장하기 버튼 -->
          <div class="button-container mt-4">
            <v-btn color="secondary" @click="saveFeedback" class="ml-2">피드백 저장하기</v-btn>
          </div>
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
      if (this.isKeyword(question)) {
        alert("이 항목은 키워드라서 선택할 수 없습니다.");
        return;
      }
      this.selectedQuestion = question;
      this.feedback = null; // 이전 질문의 피드백을 초기화
    },

    // 키워드 여부 확인 메서드
    isKeyword(item) {
      return item.length <= 2; // 예시로 길이가 1~2인 단어를 키워드로 가정
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
        const response = await axios.post("http://localhost:3000/analyze-answer", {
          answer: this.answer,
        });

        // 피드백 저장
        this.feedback = response.data.feedback;
      } catch (error) {
        console.error("AI 피드백 분석 오류:", error);
        alert("답변 분석을 요청하는 데 실패했습니다.");
      } finally {
        this.loading = false;
      }
    },

    // 답변 저장하기 함수
    saveAnswer() {
      if (this.answer.trim() === "") {
        alert("답변을 입력해주세요.");
        return;
      }

      // 확인 메시지
      if (confirm("해당 답변을 저장하시겠습니까?")) {
        // 로컬 저장소에 저장
        localStorage.setItem("savedAnswer", this.answer);
        alert("답변이 저장되었습니다.");
      }
    },

    // 피드백 저장하기 함수
    saveFeedback() {
      if (!this.feedback) {
        alert("피드백을 먼저 분석해주세요.");
        return;
      }

      // 확인 메시지
      if (confirm("해당 피드백을 저장하시겠습니까?")) {
        // 피드백을 로컬 저장소에 저장
        localStorage.setItem("savedFeedback", this.feedback);
        alert("피드백이 저장되었습니다.");
      }
    },

    splitFeedback(feedback) {
      return feedback.split('\n').filter(paragraph => paragraph.trim() !== "");
    },
  },
};
</script>

<style scoped>
/* 기존 스타일 유지 */
.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
