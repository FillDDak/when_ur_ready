<template>
  <v-container>
<<<<<<< HEAD
    
    <v-img src="../assets/readylogo.png" alt="Logo" contain max-width="250" class="mr-2 mb-4" @click="$router.push('/')"/>
    <h2>면접 1타 코칭 강사</h2>
    <p>AI를 활용한 맞춤형 면접 준비 프로그램</p>

    <v-text-field v-model="companyUrl" placeholder="회사 홈페이지의 URL을 입력하세요" outlined hide-details dense solo class="mb-4" :disabled="loading"/>
    <v-btn color="black" dark @click="submitUrl" class="mb-2" block max-width="200px" :disabled="loading">
      <v-icon left>mdi-send</v-icon> 분석 시작
=======
    <!-- URL 입력 필드 -->
    <v-text-field 
      v-model="companyUrl" 
      label="회사 홈페이지의 URL을 입력하세요."
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
      label="메시지를 입력하세요." 
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
>>>>>>> 5abd3382bfaaebd7bc6e6cda18c83fc6a03c7aac
    </v-btn>

    <v-progress-circular v-if="loading" indeterminate color="black" size="30" class="my-4"/>
    <p class="text-muted" style="font-size: 0.9rem;">참고: 이 도구는 AI를 사용하여 면접 준비를 돕습니다. 실제 면접 질문 및 최적의 답변은 다를 수 있습니다.</p>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const companyUrl = ref('')
const loading = ref(false)

const submitUrl = () => {
  if (companyUrl.value.trim() !== '') {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      router.push('/chatbotpage') 
    }, 2000)
  }
}
</script>

<style scoped>
.text-muted { color: #6c757d; }
</style>
