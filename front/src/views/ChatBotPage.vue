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
        <v-btn color="primary" class="ma-2" @click="goToQuestionsPage">예상 질문 뽑기</v-btn>
        <v-btn color="secondary" class="ma-2">회사 관련 질문 뽑기</v-btn>
        <p class="mt-3 text-caption">
          참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      keywords: [], 
    };
  },
  mounted() {
    const route = this.$route;
    const keywordsQuery = route.query.keywords;

    if (keywordsQuery) {
      try {
        let parsedKeywords = JSON.parse(decodeURIComponent(keywordsQuery));
        const uniqueKeywords = [...new Set(parsedKeywords.content.split('\n').map(item => item.replace(/^\d+\.\s*/, '')))];
        this.keywords = uniqueKeywords.filter(keyword => keyword.trim() !== '');
      } catch (error) {
        console.error("키워드 파싱 오류:", error);
        this.keywords = [];
      }
    }
  },
  methods: {
    goToQuestionsPage() {
      const questions = this.generateQuestionsFromKeywords(this.keywords);
      this.$router.push({
        name: 'questionspage',
        query: { questions: encodeURIComponent(JSON.stringify(questions)) }
      });
    },
    generateQuestionsFromKeywords(keywords) {
      return keywords.map(keyword => `${keyword}에 대해 말씀해 주세요.`);
    }
  }
};
</script>

<style scoped>
.custom-chip {
  background-color: #f0f0f0;
  margin: 4px;
  font-size: 14px;
  padding: 6px 12px;
}

.v-btn {
  font-weight: bold;
}

.text-caption {
  font-size: 0.875rem;
  color: #757575;
}

h1 {
  font-size: 2rem;
  color: #3f51b5;
}

h2 {
  color: #333;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

p {
  font-size: 1rem;
}

.v-row {
  margin-top: 20px;
}
</style>
