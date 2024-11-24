\<template>
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

    <v-progress-circular v-if="loading" indeterminate color="black" size="30" class="my-4"/>

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

    <!-- 추출된 키워드 표시 -->
    <div v-if="keywords.length > 0" class="mt-4">
      <h3>추출된 키워드:</h3>
      <v-row justify="center">
        <v-col v-for="(keyword, index) in keywords" :key="index" cols="12" sm="4" md="3">
          <v-chip class="custom-chip">{{ keyword }}</v-chip>
        </v-col>
      </v-row>
    </div>

    <p class="text-muted" style="font-size: 0.9rem;">
      참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.
    </p>
  </v-container>
</template>

<script>
import { ref } from 'vue'; // ref는 기본 값 또는 객체를 감싸서 반응형 데이터 생성
import { useRouter } from 'vue-router'; // 현재 라우터 인스턴스에 접근하고, 페이지 간 네비게이션을 제어
import axios from 'axios';

export default {
  data() {
    return {
      companyUrl: '',         // 회사 URL
      loading: false,         // 로딩 상태
      analysisComplete: false, // 분석 완료 상태
      keywords: [],           // 추출된 키워드
    };
  },
  methods: {
    async submitUrl() {
      if (this.companyUrl.trim() !== '') {
        this.loading = true;
        this.analysisComplete = false;
        try {
          // URL을 JSON 형식으로 보내기
          const response = await axios.post('http://localhost:3000/extract-keywords', {
            url: this.companyUrl // URL을 JSON 형태로 전송
          }, {
            headers: {
              'Content-Type': 'application/json'  // Content-Type을 application/json으로 설정
            }
          });

          console.log('Extracted Text:', response.data.extractedText); // 응답 데이터에서 텍스트 확인
          console.log('Keywords:', response.data.keywords); // 키워드 확인

          // 키워드를 상태로 업데이트
          this.keywords = response.data.keywords || [];
          this.analysisComplete = true; // 분석 완료 상태 업데이트
        } catch (error) {
          console.error('Error extracting keywords:', error);
          alert('키워드 추출에 실패했습니다. URL을 다시 확인해주세요.');
        } finally {
          this.loading = false;
        }
      } else {
        alert('URL을 입력해주세요.');
      }
    },
    goToChatbotPage() {
      this.$router.push({ name: 'chatbotpage', query: { keywords: JSON.stringify(this.keywords) } });
    },
  },
};
</script>

<style scoped>
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
