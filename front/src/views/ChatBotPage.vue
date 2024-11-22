<template>
  <v-container class="pa-4">
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="8" md="6">
        <v-card class="chat-window">
          <v-card-text>
            <div v-for="message in messages" :key="message.id" :class="['message', message.sender === '나' ? 'user-message' : 'bot-message']">
              <div class="message-content">
                <span class="sender">{{ message.sender }}:</span>
                <span class="text">{{ message.text }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-col cols="12" sm="8" md="6">
        <v-text-field 
          v-model="userInput" 
          label="메시지를 입력하세요" 
          @keyup.enter="sendMessage" 
          outlined
          dense
        />
        <v-btn 
          @click="sendMessage" 
          class="mt-2" 
          block 
          :style="{ backgroundColor: '#000000', color: 'white' }"
        >
          전송
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-btn @click="$router.go(-1)" color="grey" outlined>
          뒤로가기
        </v-btn>
      </v-col>
    </v-row>

    <!-- 키워드 출력 -->
    <v-row justify="center" class="mt-4">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <p>키워드: {{ keywords }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

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
</script>

<style scoped>
.chat-window {
  height: 400px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: #e0e0e0;
}

.user-message .message-content {
  background-color: #808080; 
  color: white;
}
</style>
