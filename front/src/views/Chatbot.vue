<template>
  <v-container>
    <h2 class="text-h2 text-left">준비되면</h2>
    <v-text-field v-model="companyUrl" label="회사 홈페이지의 URL을 입력하세요"></v-text-field>
    <v-btn 
      color="black" 
      class="white--text" 
      @click="submitUrl" 
      style="display: block; margin: 0 auto; max-width: 150px;">
      분석 시작
    </v-btn>
    <div v-if="submitted" class="url-display text-center">
      <p><strong>입력한 URL:</strong> <a :href="companyUrl" target="_blank">{{ companyUrl }}</a></p>
    </div>
    <div class="chat-window">
      <div v-for="message in messages" :key="message.id" class="message">
        <p><strong>{{ message.sender }}:</strong> {{ message.text }}</p>
      </div>
    </div>
    <v-btn @click="$router.go(-1)" color="grey" class="mt-4">뒤로가기</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const messages = ref([
  { id: 1, sender: '챗봇', text: '안녕하세요! 면접 준비를 도와드리겠습니다.' }
])

const userInput = ref('')
const companyUrl = ref('')
const submitted = ref(false)

const sendMessage = () => {
  if (userInput.value.trim() !== '') {
      messages.value.push({ id: messages.value.length + 1, sender: '사용자', text: userInput.value })
      userInput.value = ''
  }
}

const submitUrl = () => {
  if (companyUrl.value.trim() !== '') {
      submitted.value = true 
  }
}
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
