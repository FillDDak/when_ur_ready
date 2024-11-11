<template>
  <v-container class="pa-4">
    <v-row justify="center" class="mb-4">
      <v-img src="../assets/readylogo.png" alt="Logo" contain max-width="250"/>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="chat-window elevation-4">
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
          color="blue-grey"
          clearable
        />
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-btn 
          @click="$router.go(-1)" 
          color="black" 
          outlined 
          rounded
        >
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
const loading = ref(false)

const sendMessage = () => {
  if (userInput.value.trim() !== '') {
    messages.value.push({ id: messages.value.length + 1, sender: '나', text: userInput.value })
    userInput.value = ''
    showBotMessage('메시지를 받았습니다!')
  }
}

// 봇 메시지를 한 글자씩 타이핑 효과로 출력
const showBotMessage = (text) => {
  loading.value = true
  let index = 0
  let messageText = ''
  
  // 메시지를 하나씩 출력하는 함수
  const typeMessage = () => {
    messageText += text[index]
    messages.value.push({
      id: messages.value.length + 1,
      sender: '면접도우미',
      text: messageText
    })
    index++
    
    if (index < text.length) {
      setTimeout(typeMessage, 100) // 100ms 간격으로 한 글자씩 타이핑
    } else {
      loading.value = false
    }
  }
  
  typeMessage()
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
  background-color: #fafafa; 
  border-radius: 12px; 
  padding: 20px; 
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
}
.message { 
  display: flex; 
  margin-bottom: 12px; 
  align-items: center;
}
.user-message { 
  justify-content: flex-end; 
}
.bot-message { 
  justify-content: flex-start; 
}
.message-content { 
  max-width: 80%; 
  padding: 14px 22px; 
  border-radius: 25px; 
  background-color: #dbe6fd; 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
.user-message .message-content { 
  background-color: #dbdbdb;
  color: rgb(0, 0, 0); 
  border-top-right-radius: 0;
}
.bot-message .message-content { 
  background-color:  #a8e290;
  color: rgb(0, 0, 0); 
  border-top-left-radius: 0;
}
.sender { 
  font-weight: bold; 
  margin-right: 8px; 
}
.text { 
  font-size: 15px;
  line-height: 1.6;
}
.v-btn {
  font-weight: 600;
  border-radius: 25px;
  text-transform: none;
}
</style>
