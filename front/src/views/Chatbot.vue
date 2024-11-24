<template>
  <v-container>
    <h2>면접 1타 코칭 강사</h2>
    <p>AI를 활용한 맞춤형 면접 준비 프로그램</p><br>

<<<<<<< HEAD
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
=======
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
>>>>>>> 2e50c0d346dc20c16ec5f71f64eb9eb0f784b4ee
      :disabled="loading"
    >
      <v-icon left>mdi-send</v-icon> 분석 시작
    </v-btn>

    <v-progress-circular v-if="loading" indeterminate color="black" size="30" class="my-4" />
<<<<<<< HEAD

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
=======
    <p class="text-muted" style="font-size: 0.9rem;">
      참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.
    </p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'; // ref는 기본 값 또는 객체를 감싸서 반응형 데이터 생성
import { useRouter } from 'vue-router'; // 현재 라우터 인스턴스에 접근하고, 페이지 간 네비게이션을 제어
import axios from 'axios'; // HTTP 요청을 보내기 위한 라이브러리

const router = useRouter();
const companyUrl = ref('');
const loading = ref(false);

const submitUrl = async () => {
  if (companyUrl.value.trim() !== '') {
    loading.value = true;
    try {
      // 백엔드에 URL 전달하여 키워드 및 질문 생성 요청
      const response = await axios.post('http://localhost:4000/generate-questions', { url: companyUrl.value });

      // 응답 데이터 로깅 및 처리
      console.log(response.data);
      if (response.data && response.data.keywordsAndQuestions) {
        localStorage.setItem('keywordsAndQuestions', JSON.stringify(response.data.keywordsAndQuestions));
        router.push('/chatbotpage'); // 페이지 이동
      } else {
        throw new Error("응답 데이터에 키워드와 질문 정보가 없습니다.");
      }
    } catch (error) {
      console.error("키워드 및 질문 생성 오류:", error);
      alert("키워드 및 질문 생성 중 오류가 발생했습니다.");
    } finally {
      loading.value = false;
    }
  } else {
    alert("회사의 URL을 입력해주세요.");
  }
};
>>>>>>> 2e50c0d346dc20c16ec5f71f64eb9eb0f784b4ee
</script>
