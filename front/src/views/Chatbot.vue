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

    <!-- 분석 결과 및 확인하기 버튼 -->
    <div v-if="analysisComplete" class="text-center mt-4">
      <p>분석이 완료되었습니다! 지금 바로 확인해보세요.</p>
      <v-btn
        color="primary"
        @click="goToChatbotPage"
        block
        max-width="200px"
      >
        확인하기
      </v-btn>
    </div>

    <p class="text-muted" style="font-size: 0.9rem;">참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.</p>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      companyUrl: '',
      loading: false,
      analysisComplete: false, // 분석 완료 상태
      keywords: [], // 추출된 키워드
    }
  },
  methods: {
    async submitUrl() {
      if (this.companyUrl.trim() !== '') {
        this.loading = true
        this.analysisComplete = false
        try {
          const response = await axios.post('http://localhost:3000/extract-keywords', {
            url: this.companyUrl,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          this.keywords = response.data.keywords || []
          this.analysisComplete = true // 분석 완료 상태 업데이트
        } catch (error) {
          console.error('키워드 추출 오류:', error)
          alert('키워드 추출에 실패했습니다. URL을 다시 확인해주세요.')
        } finally {
          this.loading = false
        }
      } else {
        alert('URL을 입력해주세요.')
      }
    },
    goToChatbotPage() {
      this.$router.push({ name: 'chatbotpage', query: { keywords: JSON.stringify(this.keywords) } })
    },
  },
}
</script>
