<template>
  <v-container>
    <h2>면접 1타 코칭 강사</h2>
    <p>AI를 활용한 맞춤형 면접 준비 프로그램</p><br>

    <v-text-field 
      v-model="companyUrl" 
      placeholder="회사 홈페이지의 URL을 입력하세요" 
      outlined 
      hide-details 
      dense 
      solo 
      class="mb-4" 
      :disabled="loading"
    />
    <v-btn 
      color="black" 
      dark 
      @click="submitUrl" 
      class="mb-2" 
      block 
      max-width="200px" 
      :disabled="loading"
    >
      <v-icon left>mdi-send</v-icon> 분석 시작
    </v-btn>

    <v-progress-circular v-if="loading" indeterminate color="black" size="30" class="my-4" />
    <p class="text-muted" style="font-size: 0.9rem;">
      참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.
    </p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const companyUrl = ref('');
const loading = ref(false);

const submitUrl = async () => {
  if (companyUrl.value.trim() !== '') {
    loading.value = true;
    try {
      // 백엔드에 URL 전달하여 키워드 및 질문을 생성 요청
      const response = await axios.post('http://localhost:4000/generate-questions', { url: companyUrl.value });

      // 응답 데이터 로깅
      console.log(response.data);

      // 서버에서 반환하는 데이터 구조 확인 후 저장
      if (response.data && response.data.keywordsAndQuestions) {
        localStorage.setItem('keywordsAndQuestions', JSON.stringify(response.data.keywordsAndQuestions));
      } else {
        throw new Error("응답 데이터에 키워드와 질문 정보가 없습니다.");
      }

      // 페이지 이동
      router.push('/chatbotpage');
    } catch (error) {
      console.error("키워드 및 질문 생성 오류:", error);
      alert("키워드 및 질문 생성 중 오류가 발생했습니다.");
    } finally {
      loading.value = false;
    }
  } else {
    alert("회사의 URL을 입력해주세요.");
  }
}
</script>

<style scoped>
.text-muted { color: #6c757d; }
</style>
