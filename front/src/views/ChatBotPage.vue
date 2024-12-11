<template>
  <div class="chatbot-container">
    <h2>추출된 키워드</h2>
    <div class="keywords-container">
      <transition-group name="fade" tag="div">
        <span
          v-for="(keyword, index) in keywordsArray"
          :key="index"
          class="keyword-box"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          {{ keyword }}
        </span>
      </transition-group>
    </div>
    <div class="buttons-container">
      <button @click="generateQuestions('predict')" class="btn btn-primary" :disabled="loading">
        예상 질문 뽑기
      </button>
      <button @click="generateQuestions('company')" class="btn btn-secondary" :disabled="loading">
        회사 관련 질문 뽑기
      </button>
    </div>
    <p class="note">참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.</p>
    <!-- 로딩 애니메이션이 이 위치에 표시됩니다. -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>질문 생성중...</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      keywords: "",  // keywords는 문자열로 시작
      keywordsArray: [],  // keywords를 배열로 처리
      loading: false,
    };
  },
  mounted() {
    const query = this.$route.query.keywords;
    if (query) {
      try {
        const parsedKeywords = JSON.parse(decodeURIComponent(query));
        if (parsedKeywords.content) {
          this.keywords = parsedKeywords.content;
          this.keywordsArray = this.keywords.split(",").map((keyword) => keyword.trim()); // 문자열을 배열로 변환
        }
      } catch (error) {
        console.error("Invalid keywords format:", error);
      }
    }
  },
  methods: {
    async generateQuestions(type) {
      this.loading = true;

      try {
        const response = await axios.post("/api/generate-questions", {
          type,
          keywords: this.keywordsArray,  // keywordsArray로 배열 전달
        });

        // 질문 생성 성공 시 다음 페이지로 이동
        const questions = encodeURIComponent(JSON.stringify(response.data.questions));
        this.$router.push({ path: "/questions", query: { questions } });
      } catch (error) {
        console.error("질문 생성 중 오류 발생:", error);
        alert("질문을 생성하는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.chatbot-container {
  text-align: center;
  margin: 20px;
}

/* '추출된 키워드' 텍스트에 애니메이션 효과 추가 */
h2 {
  animation: fadeInDown 1s forwards; /* 애니메이션 속도 */
  margin-bottom: 20px;
}
.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
  margin: 20px 0;
}

.keyword-box {
  background-color: #000000;
  color: #fff;
  border-radius: 15px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s forwards;
  width: calc(20% - 10px); 
  box-sizing: border-box; 
  word-break: break-word; 
  margin-bottom: 15px; 
  margin-right: 10px; 
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.buttons-container {
  margin: 20px;
}

.btn {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #abcd55;
  color: white;
}

.btn-secondary {
  background-color: #abcd55;
  color: white;
}

.note {
  font-size: 12px;
  color: rgb(156, 147, 147);
  margin-top: 20px;
}

/* 로딩 애니메이션 스타일 */
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

/* 로딩 애니메이션 회전 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
