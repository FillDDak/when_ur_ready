<template>
  <v-container class="pa-4">
    <!-- 로고 섹션 -->
    <v-row justify="center" class="mb-4">
      <v-img 
        src="@/assets/readylogo.png" 
        alt="Logo" 
        contain 
        max-width="250" 
        @click="$router.push('/')"
        class="cursor-pointer"
      />
    </v-row>
    
    <!-- URL 입력 섹션 -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" sm="8" md="6">
        <v-text-field 
          v-model="companyUrl" 
          label="회사 홈페이지의 URL을 입력하세요"
          @input="submitUrl" 
          outlined
          dense
        />
        <v-alert v-if="submitted" type="success" class="mt-2">
          입력한 URL: <a :href="companyUrl" target="_blank">{{ companyUrl }}</a>
        </v-alert>
      </v-col>
    </v-row>
    
    <!-- 챗봇 메시지 영역 -->
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="chat-window">
          <v-card-text>
            <div v-for="message in messages" :key="message.id" :class="['message', message.sender === '사용자' ? 'user-message' : 'bot-message']">
              <div class="message-content">
                <span class="sender">{{ message.sender }}:</span>
                <span class="text">{{ message.text }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- 사용자 입력 및 전송 버튼 -->
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
          color="primary" 
          @click="sendMessage" 
          class="mt-2" 
          block>
          전송
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- 뒤로가기 버튼 -->
    <v-row justify="center" class="mt-4">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-btn @click="$router.go(-1)" color="grey" outlined>
          뒤로가기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onUpdated } from 'vue'

// 메시지 상태
const messages = ref([
  { id: 1, sender: '챗봇', text: '안녕하세요! 면접 준비를 도와드리겠습니다.' }
])

// 사용자 입력 필드
const userInput = ref('')

// URL 입력
const companyUrl = ref('')

// 제출 상태
const submitted = ref(false)

// 메시지 전송 함수
const sendMessage = () => {
  if (userInput.value.trim() !== '') {
    messages.value.push({ id: messages.value.length + 1, sender: '사용자', text: userInput.value })
    userInput.value = '' // 입력 필드 비우기
    // 챗봇 응답 예시
    setTimeout(() => {
      messages.value.push({ id: messages.value.length + 1, sender: '챗봇', text: '메시지를 받았습니다!' })
    }, 1000)
  }
}

// URL 제출 함수 (자동 실행)
const submitUrl = () => {
  if (companyUrl.value.trim() !== '') {
    submitted.value = true 
    // 여기서 URL 분석 코드가 추가될 수 있습니다.
  } else {
    submitted.value = false
  }
}

// 채팅 창 자동 스크롤
onUpdated(() => {
  const chatWindow = document.querySelector('.chat-window .v-card__text')
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight // 최신 메시지로 자동 스크롤
  }
})
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
  position: relative;
}

.user-message .message-content {
  background-color: #1976d2;
  color: white;
}

.sender {
  font-weight: bold;
  margin-right: 5px;
}

.text {
  word-wrap: break-word;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
