<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>준비되면</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn text>Home</v-btn>
      <v-btn text>About</v-btn>
      <v-btn text>Services</v-btn>
      <v-btn text>Contact</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid class="hero-section" style="background-image: url('https://picsum.photos/1920/1080');">
        <v-row align="center" justify="center" style="height: 100%;">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 font-weight-bold white--text mb-4">어서오세요</h1>
            <p class="text-h5 white--text mb-8">혁신적인 면접 준비 사이트</p>
            <v-btn x-large color="secondary">시작하기</v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="py-12">
        <v-row>
          <v-col v-for="feature in features" :key="feature.title" cols="12" md="4">
            <v-card class="mx-auto" max-width="400">
              <v-card-title>
                <v-icon left :color="feature.color" class="mr-2">{{ feature.icon }}</v-icon>
                {{ feature.title }}
              </v-card-title>
              <v-card-text>{{ feature.description }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="primary" dark>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="text-center text-md-left">
            &copy; {{ new Date().getFullYear() }} My Website. All rights reserved.
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <v-btn v-for="icon in socialIcons" :key="icon" icon class="mx-1">
              <v-icon>{{ icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const features = ref([
  { title: 'Feature 1', description: 'Description of feature 1', icon: 'mdi-star', color: 'primary' },
  { title: 'Feature 2', description: 'Description of feature 2', icon: 'mdi-lightbulb', color: 'secondary' },
  { title: 'Feature 3', description: 'Description of feature 3', icon: 'mdi-rocket', color: 'success' },
])

const socialIcons = ref(['mdi-twitter', 'mdi-facebook', 'mdi-instagram', 'mdi-linkedin'])
</script>

<style scoped>
.hero-section {
  height: 80vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>