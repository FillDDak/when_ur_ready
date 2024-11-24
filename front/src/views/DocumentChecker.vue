<template>
  <v-app class="background-image">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="pa-5">
            <v-card-title>자기소개서 검토</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="file"
                label="파일 업로드"
                prepend-icon="mdi-upload"
                @change="changeFile"
                accept=".pdf, .pdfx, .doc, .docx, .txt"
                outlined
                dense
              >
              </v-file-input>
            </v-card-text>
          </v-card>

          <v-row
            justify="center"
            align="center"
            v-if="loading"
            style="min-height: 600px"
          >
            <v-col cols="auto">
              <v-progress-circular
                indeterminate
                color="primary"
                size="70"
              ></v-progress-circular>
            </v-col>
          </v-row>

          <v-card class="mt-4" v-if="checkup && !loading">
            <v-card-title class="text-center"
              >자기소개서 검토 결과</v-card-title
            >
            <v-card-text>
              <v-alert
                title="자기소개서 추출 결과"
                type="success"
                variant="tonal"
                v-if="checkup"
                class="mb-3"
              >
              </v-alert>
              <v-expansion-panels style="white-space: pre-wrap; line-height: 1.5">
                {{ checkup }}
              </v-expansion-panels>

              <v-row>
                <v-col cols="12">
                  <strong>내 성향:</strong> {{ contract_period }}
                </v-col>
                <v-col cols="12">
                  <strong>내 역량:</strong> {{ work_location }}
                </v-col>
                <v-col cols="12">
                  <strong>내 장/단점:</strong> {{ job_content }}
                </v-col>
                <v-col cols="12">
                  <strong>내 역할:</strong> {{ work_hours }}
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
      checkup: null,
      contract_period: null,
      work_location: null,
      job_content: null,
      work_hours: null,
      loading: false,
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
        var response = await this.$axios.post(
          "/api/check",
          {
            file: this.file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);

        this.checkup = response.data.originalText;
        this.contract_period = response.data.contract_period;
        this.work_location = response.data.work_location;
        this.job_content = response.data.job_content;
        this.work_hours = response.data.work_hours;
      } catch (error) {
        console.error("파일 처리 중 오류가 발생했습니다.", error);
      } finally {
        this.loading = false;
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
