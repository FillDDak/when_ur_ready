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

<<<<<<< HEAD
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
        this.keywords = []; 
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
=======
<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import { useRoute } from 'vue-router';

const messages = ref([{ id: 1, sender: '면접도우미', text: '안녕하세요! 면접 준비를 도와드리겠습니다.' }]);
const userInput = ref('');
const keywords = ref('');
const route = useRoute();

// 컴포넌트가 마운트될 때 키워드를 받아옴
onMounted(() => {
  keywords.value = route.query.keywords || '키워드가 없습니다.';

  // 로컬 스토리지에서 키워드 및 예상 질문 불러오기
  const storedData = localStorage.getItem('keywordsAndQuestions');
  if (storedData) {
    const keywordsAndQuestions = JSON.parse(storedData);

    // 챗봇 첫 메시지로 키워드 및 예상 질문을 표시
    if (keywordsAndQuestions.keywords && keywordsAndQuestions.questions) {
      messages.value.push(
        { id: messages.value.length + 1, sender: '면접도우미', text: `키워드: ${keywordsAndQuestions.keywords.join(', ')}` },
        { id: messages.value.length + 2, sender: '면접도우미', text: `예상 질문: ${keywordsAndQuestions.questions.join(', ')}` }
      );
    }
  }
});

// 사용자가 메시지를 입력하고 전송 버튼을 클릭할 때
const sendMessage = () => {
  if (userInput.value.trim() !== '') {
    messages.value.push({ id: messages.value.length + 1, sender: '나', text: userInput.value });
    userInput.value = '';

    // 챗봇의 간단한 응답을 추가
    setTimeout(() => {
      messages.value.push({ id: messages.value.length + 1, sender: '면접도우미', text: '질문에 대한 답변을 준비하고 있습니다!' });
    }, 1000);
  }
};

// 새 메시지가 추가될 때 자동 스크롤
onUpdated(() => {
  const chatWindow = document.querySelector('.chat-window .v-card__text');
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
>>>>>>> 2e50c0d346dc20c16ec5f71f64eb9eb0f784b4ee
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
