<template>
  <v-container>
    <!-- 로고 이미지 추가 -->
    <v-img 
      src="../assets/readylogo.png" 
      alt="Logo" 
      contain 
      max-width="250" 
      class="mr-2 mb-4"
      @click="$router.push('/')"
    />
    
    <!-- URL 입력 필드 -->
    <v-text-field 
      v-model="companyUrl" 
      label="회사 홈페이지의 URL을 입력하세요"
      @input="submitUrl" 
    />
    
    <div v-if="submitted" class="url-display text-center">
      <p><strong>입력한 URL:</strong> <a :href="companyUrl" target="_blank">{{ companyUrl }}</a></p>
    </div>
    
    <!-- 챗봇 메시지 영역 -->
    <div class="chat-window" ref="chatWindow">
      <div v-for="message in messages" :key="message.id" class="message">
        <p><strong>{{ message.sender }}:</strong> {{ message.text }}</p>
      </div>
    </div>
    
    <!-- 사용자 입력 및 전송 버튼 -->
    <v-text-field 
      v-model="userInput" 
      label="메시지를 입력하세요" 
      @keyup.enter="sendMessage" 
      outlined
      dense
    />
    <v-btn 
      color="secondary" 
      @click="sendMessage" 
      class="mt-2"
      style="display: block; margin: 0 auto; max-width: 150px;">
      전송
    </v-btn>
    
    <!-- 뒤로가기 버튼 -->
    <v-btn @click="$router.go(-1)" color="grey" class="mt-4">뒤로가기</v-btn>
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
  }
}

// URL 제출 함수 (자동 실행)
const submitUrl = () => {
  if (companyUrl.value.trim() !== '') {
    submitted.value = true 
    // 여기서 URL 분석 코드가 추가될 수 있습니다.
  }
}

// 채팅 창 자동 스크롤
onUpdated(() => {
  const chatWindow = document.querySelector('.chat-window')
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight // 최신 메시지로 자동 스크롤
  }
})
</script>

<style scoped>
.chat-window {
  border: 1px solid #ccc;
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin: 5px 0;
}

.url-display {
  margin: 20px 0;
}

.text-left {
  text-align: left;
}
</style>
