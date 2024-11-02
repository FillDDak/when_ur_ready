<template>
  <v-container>
    <v-card class="pa-4">
      <v-text-field label="회사 홈페이지 URL" v-model="companyUrl"></v-text-field>
      <v-btn @click="startAnalysis" color="primary">분석 시작</v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      companyUrl: "",
    };
  },
  methods: {
    startAnalysis() {
      // URL 분석 요청 API 호출 로직 작성
      console.log("Analyzing URL:", this.companyUrl);
    },
  },
};
</script>

<style scoped>
.v-container {
  max-width: 600px;
  margin: auto;
}
</style>
