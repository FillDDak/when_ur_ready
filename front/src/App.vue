<template>
  <v-app>
    <v-main>
      <!-- 앱 바 -->
      <v-app-bar :elevation="0" app dark :height="90">
        <v-app-bar-title>
          <v-img src="./assets/readylogo.png" alt="Logo" contain max-width="200" class="mr-2" @click="$router.push('/')"
            style="cursor: pointer;"></v-img>
        </v-app-bar-title>
        <v-spacer></v-spacer>

        <!-- 메뉴 버튼 -->
        <v-btn class="mr-2 button-hover" @click="$router.push('/')">Home</v-btn>
        <v-btn class="mr-2 button-hover" @click="$router.push('/about')">About</v-btn>
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn class="mr-2 button-hover" v-bind="props">
              Services
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(servicesItems, i) in servicesItems" :key="i" :value="i"
              @click="$router.push(servicesItems.route)">
              <v-list-item-title>{{ servicesItems.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- 유저 버튼 -->
        <v-btn v-if="!$store.state.loginUser" style="background-color: #314692; font-size: 16px;"
          class="mr-2 font-weight-bold" rounded="xl" @click="loginDialog = true, user.id = '', user.password = '',
            idErrorMessage = '', passwordErrorMessage = '', showPassword = false" color="white">로그인</v-btn>
        <v-btn v-if="!$store.state.loginUser" style="background-color: lightgray; font-size: 16px;"
          class="mr-3 font-weight-bold" rounded="xl" @click="$router.push('/signup')">회원가입</v-btn>

        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn v-if="$store.state.loginUser" v-bind="props" style="background-color: #314692; font-size: 16px;"
              class="mr-3 font-weight-bold" rounded="xl">
              <v-icon color="white" size="x-large">mdi-account-circle</v-icon>
              <v-icon color="white" right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(userItem, i) in userItems" :key="i" :value="i" @click="handleUserItemClick(userItem)"
              :class="{ 'logout-item': userItem.action === 'logoutDialog' }">
              <v-list-item-title>{{ userItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-app-bar>
      <router-view />
    </v-main>

    <!-- 로그인 다이얼로그 -->
    <v-dialog v-model="loginDialog" max-width="400" @keyup.enter="login">
      <v-card>
        <v-img src="./assets/readylogo.png" alt="Logo" contain max-height="80" class="mt-3"></v-img>
        <v-card-text>
          <h5>아이디</h5>
          <v-text-field label="아이디" v-model="user.id" variant="outlined" :error-messages="idErrorMessage"
            @input="idErrorMessage = ''"></v-text-field>
          <h5>비밀번호</h5>
          <v-text-field label="비밀번호" v-model="user.password" variant="outlined"
            :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="togglePasswordVisibility" :error-messages="passwordErrorMessage"
            @input="passwordErrorMessage = ''">
          </v-text-field>
        </v-card-text>
        <v-card-actions class="d-flex flex-column justify-center">
          <v-btn style="background-color: #314692;" @click="login" class="font-weight-bold" rounded="xl" size="x-large"
            width="300" color="white">로그인</v-btn>
          <v-btn text @click="$router.push('/signup'), loginDialog = false" class="button-hover">또는 회원가입</v-btn>
          <v-btn style="border: 2px solid #314692;" @click="loginDialog = false" class="mb-2 font-weight-bold"
            rounded="xl" size="x-large" width="300" outlined>취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 로그아웃 다이얼로그 -->
    <v-dialog v-model="logoutDialog" max-width="400" height="180" @keyup.enter="logout">
      <v-card>
        <v-card-text class="d-flex flex-column justify-center align-center text-center">
          <h3 class="mb-4">로그아웃 하시겠습니까?</h3>
          <div class="d-flex justify-end">
            <v-btn style="background-color: #314692; font-size: 16px; color: white;" class="mr-4 font-weight-bold"
              rounded="xl" @click="logout">
              로그아웃
            </v-btn>
            <v-btn style="border: 2px solid #314692;" class="font-weight-bold" rounded="xl" outlined
              @click="logoutDialog = false">
              취소
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
export default {
  data() {
    return {
      loginDialog: false,
      logoutDialog: false,
      showPassword: false,
      idErrorMessage: '',
      passwordErrorMessage: '',
      user: {
        id: '',
        password: ''
      },
      servicesItems: [
        { title: '면접 질문 챗봇', route: '/chatbot' },
        { title: '자기소개서 AI 검토', route: '/documentchecker' },
        { title: '면접 표정 분석', route: '/facerecognition' },
        { title: '스터디 그룹 모집', route: '/interviewstudyboard' }
      ],
      userItems: [
        { title: '마이페이지', route: '/mypage' },
        { title: '즐겨찾기', route: '/favorites' },
        { title: '로그아웃', action: 'logoutDialog' }
      ]
    };
  },
  mounted() {
    this.$axios.post("/api/users/info")
      .then(response => {
        if (response.data.result == "success") {
          this.$store.commit("setLoginUser", response.data.user)
        }
      })
      .catch(error => {
        console.error("Error fetching user info:", error);
      });
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
        .catch(error => {
          console.error("Error during login:", error);
        });
    },
    logout() {
      this.$axios.post("/api/users/logout")
        .then(response => {
          if (response.data.result == "success") {
            this.$store.commit("logout")
            this.logoutDialog = false
            this.$router.push('/')
          }
        })
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleUserItemClick(userItem) {
      if (userItem.action === 'logoutDialog') {
        this.logoutDialog = true;
      } else if (userItem.route) {
        this.$router.push(userItem.route);
      }
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

.logout-item {
  color: #B30928;
  font-weight: bold;
}
</style>