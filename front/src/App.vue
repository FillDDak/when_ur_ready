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
        <v-btn v-if="!$store.state.loginUser" style="background-color: #BADC6B; font-size: 16px;"
          class="mr-2 font-weight-bold" rounded="xl" @click="loginDialog = true, user.id = '', user.password = '',
            idErrorMessage = '', passwordErrorMessage = '', showPassword = false">로그인</v-btn>
        <v-btn v-if="!$store.state.loginUser" style="background-color: lightgray; font-size: 16px;"
          class="mr-3 font-weight-bold" rounded="xl" @click="$router.push('/signup')">회원가입</v-btn>
        <v-btn v-if="$store.state.loginUser" style="background-color: #BADC6B; font-size: 16px;"
          class="mr-3 font-weight-bold" rounded="xl" @click="$router.push('/')"><v-icon
            size="x-large">mdi-account-circle</v-icon></v-btn>
        <v-btn v-if="$store.state.loginUser" style="background-color: lightgray; font-size: 16px;"
          class="mr-3 font-weight-bold" rounded="xl" @click="logout">로그아웃</v-btn>
      </v-app-bar>
      <router-view />
    </v-main>

    <!-- 로그인 다이얼로그 -->
    <v-dialog v-model="loginDialog" max-width="400" @keyup.enter="login">
      <v-card>
        <v-img src="./assets/readylogo.png" alt="Logo" contain max-height="100"></v-img>
        <v-card-text>
          <h5>아이디</h5>
          <v-text-field label="아이디" v-model="user.id" variant="outlined" :error-messages="idErrorMessage"
            @input="idErrorMessage = ''"></v-text-field>
          <h5>비밀번호</h5>
          <v-text-field label="비밀번호" v-model="user.password" variant="outlined" :type="showPassword ? 'text' : 'password'"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="togglePasswordVisibility"
            :error-messages="passwordErrorMessage" @input="passwordErrorMessage = ''">
          </v-text-field>
          <span class="text-button" @click="handleClick">비밀번호를 잊으셨나요?</span>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-center">
          <v-btn style="background-color: #BADC6B;" @click="login" class="font-weight-bold" rounded="xl"
            size="x-large" width="300">로그인</v-btn>
          <v-btn text @click="$router.push('/signup'), loginDialog = false" class="button-hover">또는 회원가입</v-btn>
          <v-btn style="border: 2px solid #BADC6B;" @click="loginDialog = false" class="mb-2 font-weight-bold"
            rounded="xl" size="x-large" width="300" outlined>취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      loginDialog: false,
      showPassword: false,
      idErrorMessage: '',
      passwordErrorMessage: '',
      user: {
        id: '',
        password: ''
      }
    };
  },
  mounted() {
    this.$axios.post("/api/users/info")
      .then(response => {
        if (response.data.result == "success") {
          this.$store.commit("setLoginUser", response.data.user)
        }
      })
  },
  methods: {
    login() {
      this.$axios.post("/api/users/login", this.user)
        .then(response => {
          if (response.data.result == "success") {
            this.$store.commit("setLoginUser", response.data.user)
            alert("로그인에 성공 했습니다.")
            this.loginDialog = false
            this.$router.push("/")
          } else {
            if (response.data.field === "id") {
              this.idErrorMessage = response.data.message;
            }
            else if (response.data.field === "password") {
              this.passwordErrorMessage = response.data.message;
            }
          }
        })
    },
    logout() {
      this.$axios.post("/api/users/logout")
        .then(response => {
          if (response.data.result == "success") {
            this.$store.commit("logout")
            this.$router.push('/')
          }
        })
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
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