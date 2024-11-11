<template>
  <v-app>
    <v-main>
      <!-- 앱 바 -->
      <v-app-bar :elevation="0" app dark :height="90">
        <v-app-bar-title>
          <v-img src="./assets/readylogo.png" alt="Logo" contain max-width="250" class="mr-2" @click="$router.push('/')"
            style="cursor: pointer;"></v-img>
        </v-app-bar-title>
        <v-spacer></v-spacer>

        <v-btn class="mr-2 button-hover" @click="$router.push('/')">Home</v-btn>
        <v-btn class="mr-2 button-hover">About</v-btn>
        <v-btn class="mr-2 button-hover">Services</v-btn>
        <v-btn class="mr-2 button-hover">Contact</v-btn>
        <v-btn style="background-color: #BADC6B; font-size: 16px;" class="mr-2 font-weight-bold" rounded="xl"
          @click="loginDialog = true">로그인</v-btn>
        <v-btn style="background-color: lightgray; font-size: 16px;" class="mr-3 font-weight-bold" rounded="xl"
          @click="$router.push('/signup')">회원가입</v-btn>
      </v-app-bar>
      <router-view />
    </v-main>

    <!-- 로그인 다이얼로그 -->
    <v-dialog v-model="loginDialog" max-width="400">
      <v-card>
        <v-img src="./assets/readylogo.png" alt="Logo" contain max-height="100"></v-img>
        <v-card-text>
          <h5>이메일</h5>
          <v-text-field label="이메일" v-model="email" variant="outlined"></v-text-field>
          <h5>비밀번호</h5>
          <v-text-field label="비밀번호" v-model="password" variant="outlined" type="password"></v-text-field>
          <span class="text-button" @click="handleClick">비밀번호를 잊으셨나요?</span>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-center">
          <v-btn style="background-color: #BADC6B;" @click="login" rounded="xl" size="x-large" width="300">로그인</v-btn>
          <v-btn text @click="$router.push('/signup'), loginDialog = false" class="button-hover">또는 회원가입</v-btn>
          <v-btn style="border: 2px solid #BADC6B;" @click="loginDialog = false" class="mb-2" rounded="xl" size="x-large"
            width="300" outlined>취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 회원가입 다이얼로그 -->
    <!-- <v-dialog v-model="signupDialog" max-width="400">
      <v-card>
        <v-img src="./assets/readylogo.png" alt="Logo" contain max-height="100"></v-img>
        <v-card-text>
          <h3>이메일</h3>
          <v-text-field label="이메일" v-model="email"></v-text-field>
          <h3>비밀번호</h3>
          <v-text-field label="비밀번호" v-model="password" type="password"></v-text-field>
          <h3>비밀번호 재입력</h3>
          <v-text-field label="비밀번호" v-model="password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-center">
          <v-btn style="background-color: #BADC6B;" @click="signup" class="mb-2" rounded="xl" size="x-large"
            width="300">회원가입</v-btn>
          <v-btn style="border: 2px solid #BADC6B;" @click="signupDialog = false" class="mb-2" rounded="xl" size="x-large"
            width="300" outlined>취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      loginDialog: false,
      signupDialog: false,
      email: '',
      password: '',
      signupEmail: '',
      signupPassword: '',
      signupPasswordConfirm: ''
    };
  },
  methods: {
    login() {
      console.log("로그인 시도:", this.email, this.password);
      this.loginDialog = false;
    },
    signup() {
      console.log("회원가입 시도:", this.signupEmail, this.signupPassword, this.signupPasswordConfirm);
      this.signupDialog = false;
    }
  }
};
</script>
<style>
.text-button {
  cursor: pointer;
}

.text-button:hover {
  text-decoration: underline;
}

.button-hover:hover {
  text-decoration: underline;
}
</style>