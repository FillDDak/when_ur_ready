
<template>
  <v-container class="pa-4">
    <v-row justify="center" class="mb-4">
     
    </v-row>

    
    <v-row justify="center">
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
  </v-container>
</template>

<script setup>
import { ref, onUpdated } from 'vue'

const messages = ref([{ id: 1, sender: '면접도우미', text: '안녕하세요! 면접 준비를 도와드리겠습니다.' }])
const userInput = ref('')

const sendMessage = () => {
  if (userInput.value.trim() !== '') {
    messages.value.push({ id: messages.value.length + 1, sender: '나', text: userInput.value })
    userInput.value = '' 
    setTimeout(() => {
      messages.value.push({ id: messages.value.length + 1, sender: '면접도우미', text: '메시지를 받았습니다!' })
    }, 1000)
  }
}

onUpdated(() => {
  const chatWindow = document.querySelector('.chat-window .v-card__text')
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight
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
}

.user-message .message-content {
  background-color: #808080; 
  color: white;
}
</style>
