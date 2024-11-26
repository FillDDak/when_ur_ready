<template>
  <v-app>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <!-- 파일 업로드 -->
          <v-card class="pa-5">
            <v-card-title>자기소개서 검토</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="file"
                label="파일 업로드"
                prepend-icon="mdi-upload"
                @change="changeFile"
                accept=".pdf, .doc, .docx, .txt"
                outlined
                dense
              />
            </v-card-text>
          </v-card>

          <!-- 로딩 중 -->
          <v-row justify="center" v-if="loading">
            <v-progress-circular indeterminate color="primary" size="70" />
          </v-row>

          <!-- 추출된 텍스트 -->
          <v-card class="mt-4" v-if="originalText && !loading">
            <v-card-title>추출된 텍스트</v-card-title>
            <v-card-text>
              <pre style="white-space: pre-wrap;">{{ originalText }}</pre>
            </v-card-text>
          </v-card>

          <!-- 분석 결과 -->
          <v-card class="mt-4" v-if="!analyzing && propensity">
            <v-card-title>분석 결과</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12"><strong>내 성향:</strong> {{ propensityPresence }}</v-col>
                <v-col cols="12">{{ propensity }}</v-col>
                <v-col cols="12"><strong>내 역량:</strong> {{ capabilitiesPresence }}</v-col>
                <v-col cols="12">{{ capabilities }}</v-col>
                <v-col cols="12"><strong>내 장/단점:</strong> {{ prosandconsPresence }}</v-col>
                <v-col cols="12">{{ prosandcons }}</v-col>
                <v-col cols="12"><strong>내 역할:</strong> {{ rolePresence }}</v-col>
                <v-col cols="12">{{ role }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- 분석 진행 중 -->
          <v-row justify="center" v-if="analyzing">
            <v-progress-circular indeterminate color="green" size="50" />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>


<script>
export default {
  data() {
    return {
      file: null,
      originalText: null,
      propensityPresence: null,
      capabilitiesPresence: null,
      prosandconsPresence: null,
      rolePresence: null,
      propensity: null,
      capabilities: null,
      prosandcons: null,
      role: null,
      loading: false,
      analyzing: false,
    };
  },
  methods: {
    async changeFile() {
      if (!this.file) {
        console.log("파일이 선택되지 않았습니다.");
        return;
      }

      this.loading = true;
      try {
        // 1. 텍스트 추출 요청
        const formData = new FormData();
        formData.append("file", this.file);

        const response = await this.$axios.post("/api/check", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // 추출된 텍스트 표시
        this.originalText = response.data.originalText;

        // 2. 추가 분석 요청
        this.analyzing = true;
        const analysisResponse = await this.$axios.get("/api/analyze", {
          params: { text: this.originalText },
        });

        // 분석 결과 반영
        this.propensityPresence = analysisResponse.data.propensityPresence;
        this.capabilitiesPresence = analysisResponse.data.capabilitiesPresence;
        this.prosandconsPresence = analysisResponse.data.prosAndConsPresence;
        this.rolePresence = analysisResponse.data.rolePresence;
        this.propensity = analysisResponse.data.propensity;
        this.capabilities = analysisResponse.data.capabilities;
        this.prosandcons = analysisResponse.data.prosAndCons;
        this.role = analysisResponse.data.role;
      } catch (error) {
        console.error("파일 처리 중 오류가 발생했습니다.", error);
      } finally {
        this.loading = false;
        this.analyzing = false;
      }
    },
  },
};

</script>

<style>
.pa-5 {
  padding: 32px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
