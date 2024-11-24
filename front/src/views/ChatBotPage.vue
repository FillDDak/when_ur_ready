<template>
  <v-container class="pa-4">
    
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <h1 class="mb-2">면접 1타 코칭 강사</h1>
        <p>AI를 활용한 맞춤형 면접 준비 프로그램</p>
      </v-col>
    </v-row>

    
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <h2>추출된 키워드:</h2>
        <div class="d-flex flex-wrap mb-4">
          <v-chip
            v-for="(keyword, index) in keywords"
            :key="index"
            class="custom-chip"
          >
            {{ keyword }}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-btn color="primary" class="ma-2" @click="generateQuestions">예상 질문 뽑기</v-btn>
        <v-btn color="secondary" class="ma-2">회사 관련 질문 뽑기</v-btn>
        <p class="mt-3 text-caption">
          참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.
        </p>
      </v-col>
    </v-row>

   
    <v-row justify="center" v-if="isLoading">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <p>예상 질문 생성중...</p>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  data() {
    return {
      keywords: [], 
      isLoading: false, 
    };
  },
  mounted() {
    const route = useRoute();

    
    const keywordsQuery = route.query.keywords;

    
    if (keywordsQuery) {
      try {
        let parsedKeywords = JSON.parse(decodeURIComponent(keywordsQuery)); // 디코딩 후 JSON 파싱
        this.keywords = parsedKeywords.content.split("\n").map(item => item.replace(/^\d+\.\s*/, ""));
      } catch (error) {
        console.error("키워드 파싱 오류:", error);
        this.keywords = []; // 오류 시 기본값
      }
    }
  },
  methods: {
    async generateQuestions() {
      try {
        this.isLoading = true; // 로딩 시작

        // 서버에 요청을 보내 예상 질문을 생성
        const response = await axios.post("http://localhost:3000/generate-questions", {
          keywords: this.keywords, // 키워드 전송
        });

        // 로딩 완료 후 새 페이지로 예상 질문 전달
        this.isLoading = false;
        this.$router.push({
          name: "questions", // 라우터의 이름을 사용하여 페이지 이동
          query: { questions: JSON.stringify(response.data.questions) }, // 예상 질문을 쿼리 파라미터로 전달
        });
      } catch (error) {
        this.isLoading = false;
        console.error("예상 질문 생성 오류:", error);
        alert("예상 질문을 생성하는 데 실패했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.ma-2 {
  margin: 8px;
}
.mb-2 {
  margin-bottom: 16px;
}
.mb-4 {
  margin-bottom: 32px;
}
.text-caption {
  font-size: 0.8rem;
  color: #757575;
}
.d-flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.custom-chip {
  background-color: #000; /* 검정색 배경 */
  color: #fff; /* 흰색 글자 */
  border-radius: 20px; /* 동글한 모서리 */
  padding: 0 10px; /* 내부 여백 조정 */
  margin: 6px 5px; /* 외부 마진 조정 */
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap; /* 텍스트가 길어지지 않도록 방지 */
}
</style>
