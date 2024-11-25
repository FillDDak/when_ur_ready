<template>
    <div class="questions-container">
      <h2>회사 관련 질문 목록</h2>
      <ul>
        <li v-for="(question, index) in questions" :key="index">{{ question }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        questions: [], // 회사 관련 질문
      };
    },
    mounted() {
      const query = this.$route.query.questions;
      if (query) {
        try {
          this.questions = JSON.parse(decodeURIComponent(query));
        } catch (error) {
          console.error("잘못된 질문 형식:", error);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .questions-container {
    text-align: center;
    margin: 20px;
  }
  
  .questions-container ul {
    list-style-type: none;
    padding: 0;
  }
  
  .questions-container li {
    font-size: 16px;
    margin: 10px 0;
  }
  </style>
  