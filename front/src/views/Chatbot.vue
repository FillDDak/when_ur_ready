<template>
  <v-container>
    <h2>면접 1타 코칭 강사</h2>
    <p>AI를 활용한 맞춤형 면접 준비 프로그램</p><br>

    <v-text-field v-model="companyUrl" placeholder="회사 홈페이지의 URL을 입력하세요" outlined hide-details dense solo class="mb-4" :disabled="loading"/>
    <v-btn color="black" dark @click="submitUrl" class="mb-2" block max-width="200px" :disabled="loading">
      <v-icon left>mdi-send</v-icon> 분석 시작
    </v-btn>

    <v-progress-circular v-if="loading" indeterminate color="black" size="30" class="my-4"/>
    <p class="text-muted" style="font-size: 0.9rem;">참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.</p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue' // ref는 기본 값 또는 객체를 감싸서 반응형 데이터 생성
import { useRouter } from 'vue-router' // 현재 라우터 인스턴스에 접근하고, 페이지 간 네비게이션을 제어
import axios from 'axios'

const router = useRouter()
const companyUrl = ref('')
const loading = ref(false)

const submitUrl = async () => {
  if (companyUrl.value.trim() !== '') {
    loading.value = true
    
    try {
      // URL을 JSON 형식으로 보내기
      const response = await axios.post('http://localhost:3000/extract-keywords', {
        url: companyUrl.value  // URL을 JSON 형태로 전송
      }, {
        headers: {
          'Content-Type': 'application/json'  // Content-Type을 application/json으로 설정
        }
      })

      console.log('Extracted Text:', response.data.extractedText) // 응답 데이터에서 텍스트 확인
      console.log('Keywords:', response.data.keywords) // 키워드 확인

      // 키워드를 챗봇 페이지로 전달
      router.push({ name: 'chatbotpage', query: { keywords: response.data.keywords } })
    } catch (error) {
      console.error('Error extracting keywords:', error)
    } finally {
      loading.value = false
    }
  }
}
</script>
