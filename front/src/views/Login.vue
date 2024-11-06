<template>
    <v-app>
      <v-container>
        <v-row justify="center" align="center" class="my-12">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="headline">로그인</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-text-field v-model="email" label="Email" :rules="[emailRules]" required></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" :rules="[passwordRules]" required></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-center"> 
                <v-btn color="primary" @click="login">로그인</v-btn>
              </v-card-actions>
              <v-card-actions class="d-flex justify-center"> 
                <v-card-text class="text-center">
                  <span>회원이 아니신가요? </span>
                  <v-btn text @click="goToSignUp">회원가입하기</v-btn>
                </v-card-text>
              </v-card-actions>
              <v-card-actions>
                <v-btn @click="goBack">뒤로가기</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const valid = ref(false)
  const emailRules = [v => /.+@.+\..+/.test(v) || 'E-mail is required']
  const passwordRules = [v => !!v || 'Password is required']
  
  const router = useRouter()
  
  const login = () => {
    if (valid.value) {
      
      console.log('로그인 성공:', { email: email.value, password: password.value })
    }
  }
  
  const goBack = () => {
    router.push('/') 
  }
  
  
  const goToSignUp = () => {
    router.push('/signup') 
  }
  </script>
  
  <style scoped>

  .text-center {
    text-align: center;
  }
  
  .v-btn {
    padding: 0;
    min-width: auto;
    text-decoration: underline;
  }
  
  .v-card-text span {
    font-size: 14px;
  }
  </style>
  