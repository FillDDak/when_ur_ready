<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center" class="my-12">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="headline">회원가입</v-card-title>
            <v-card-text>
              <v-form v-model="valid">
                <v-text-field v-model="user.id" label="아이디" variant="outlined" required></v-text-field>
                <v-text-field v-model="user.password" label="비밀번호" variant="outlined" type="password"
                  required></v-text-field>
                <v-text-field v-model="user.name" label="이름 (실명)" variant="outlined" required></v-text-field>
                <v-text-field v-model="user.birthDate" label="생년월일 (예: 20001231)" variant="outlined"
                  required></v-text-field>
                <v-text-field v-model="user.email" label="이메일" variant="outlined" required></v-text-field>
                <v-text-field v-model="user.phoneNumber" label="휴대폰 번호" variant="outlined" required></v-text-field>
                <v-select v-model="user.desiredJobField" :items="jobFields" label="구직 희망 분야" variant="outlined"
                  required></v-select>
                <v-select v-model="user.experienceLevel" :items="experienceLevels" label="경력 수준" variant="outlined"
                  required></v-select>
                <v-select v-model="user.interviewStatus" :items="interviewStatuses" label="면접 준비 상태" variant="outlined"
                  required></v-select>
                <v-select v-model="user.targetCompany" :items="targetCompanies" label="목표 회사" variant="outlined"
                  required></v-select>
                <v-select v-model="user.interviewExperience" :items="['선택하지 않음', '있다', '없다']" variant="outlined" label="면접 경험"
                  required></v-select>
                <v-checkbox v-model="user.isOver15" label="[필수] 만 15세 이상입니다." required></v-checkbox>
                <v-checkbox v-model="user.termsAgreement" label="[필수] 이용약관 동의" required></v-checkbox>
                <v-checkbox v-model="user.privacyAgreement" label="[필수] 개인정보 수집 및 이용 동의" required></v-checkbox>
                <v-checkbox v-model="user.marketingConsent" label="마케팅 및 뉴스레터 수신 동의"></v-checkbox>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="submit">회원가입</v-btn>
            </v-card-actions>
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
      valid: false,
      user: {
        id: '',
        password: '',
        name: '',
        birthDate: '',
        email: '',
        phoneNumber: '',
        desiredJobField: '선택하지 않음',
        experienceLevel: '선택하지 않음',
        interviewStatus: '선택하지 않음',
        targetCompany: '선택하지 않음',
        interviewExperience: '선택하지 않음',
        isOver15: false,
        termsAgreement: false,
        privacyAgreement: false,
        marketingConsent: false,
      },
      jobFields: [
        '선택하지 않음', 'IT', '마케팅', '영업', '디자인', '연구개발', '교육', '건강', '금융', '법률', '엔지니어링', '제조업', '서비스업', '소매업', '문화예술', '공공기관', '스타트업', '기타'
      ],
      experienceLevels: ['선택하지 않음', '신입', '1-2년', '3-5년', '6-10년', '10년 이상'],
      interviewStatuses: ['선택하지 않음', '시작하지 않음', '진행 중', '거의 끝남'],
      targetCompanies: ['선택하지 않음', '공무원', '공기업', '대기업', '중견/중소기업', '외국계 기업', '기타'],

    };
  },
  methods: {
    submitForm() {
      console.log({
        user: {
          id: this.user.id,
          password: this.user.password,
          name: this.user.name,
          birthDate: this.user.birthDate,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber,
          desiredJobField: this.user.desiredJobField,
          experienceLevel: this.user.experienceLevel,
          interviewStatus: this.user.interviewStatus,
          targetCompany: this.user.targetCompany,
          interviewExperience: this.user.interviewExperience,
          isOver15: this.user.isOver15,
          termsAgreement: this.user.termsAgreement,
          privacyAgreement: this.user.privacyAgreement,
          marketingConsent: this.user.marketingConsent
        }
      });
    },
    submit() {
      this.$axios.post("/api/users/join", this.user)
        .then(response => {
          if (response.data.result == "success") {
            alert("가입이 성공 되었습니다.");
            this.$router.push("/");
          } else {
            this.errorMessage = response.data.message;
          }
        })
    }
  }
};
</script>

<style scoped>
.v-btn {
  width: 100%;
}

.v-checkbox,
.v-switch {
  margin-top: 10px;
}

.v-select,
.v-text-field {
  margin-bottom: 15px;
}

.v-card-title {
  text-align: center;
}

span {
  font-size: 12px;
  margin-left: 10px;
}

.v-row {
  margin-bottom: 10px;
}

.v-btn[small] {
  padding: 5px 10px;
}</style>
