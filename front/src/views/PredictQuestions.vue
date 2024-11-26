<template>
    <div class="predict-questions-container">
      <h2>예상 질문 목록</h2>
  
      <!-- 질문 목록 -->
      <div v-if="questions.length > 0" class="questions-list">
        <div v-for="(question, index) in questions" :key="index" class="question-item">
          <p>{{ question }}</p>
        </div>
      </div>
  
      <!-- 데이터가 없을 경우 메시지 -->
      <div v-else>
        <p>예상 질문이 없습니다. 다시 시도해주세요.</p>
      </div>
  
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>질문 로딩 중...</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        questions: [],  // 예상 질문 목록
        loading: false,
      };
    },
    mounted() {
      const query = this.$route.query.questions;  // URL의 쿼리에서 질문 데이터 받기
      if (query) {
        try {
          const parsedQuestions = JSON.parse(decodeURIComponent(query));  // 쿼리에서 가져온 질문 파싱
          this.questions = parsedQuestions;
        } catch (error) {
          console.error("잘못된 질문 데이터 형식:", error);
          alert("질문 데이터를 로드하는 데 오류가 발생했습니다.");
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .predict-questions-container {
    text-align: center;
    margin: 20px;
  }
  
  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .question-item {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    color: #333;
    text-align: left;
  }
  
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  .loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #38dbdb;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
    margin-right: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  