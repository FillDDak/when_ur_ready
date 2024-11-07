<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="0" app dark :height="90" scroll-behavior="hide" scroll-threshold="200">
      <v-app-bar-title>
        <v-img src="./assets/readylogo.png" alt="Logo" contain max-width="250" class="mr-2" @click="$router.push('/')"
          style="cursor: pointer;"></v-img>
        </v-app-bar-title>
        <v-spacer></v-spacer>
     
        <v-btn class="mr-2">Home</v-btn>
        <v-btn class="mr-2">About</v-btn>
        <v-btn class="mr-2">Services</v-btn>
        <v-btn class="mr-2">Contact</v-btn>
        <v-btn style="background-color: #BADC6B; font-size: 16px;" class="mr-2 font-weight-bold" rounded="xl" @click="loginDialog = true">로그인</v-btn>
        <v-btn style="background-color: lightgray; font-size: 16px;" class="mr-3 font-weight-bold" rounded="xl" @click="signupDialog = true">회원가입</v-btn>
      </v-app-bar>
      <router-view/>
    </v-main>
  </v-app>
  
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
}
</script>
