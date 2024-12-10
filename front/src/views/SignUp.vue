<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center" class="my-12">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="headline">회원가입</v-card-title>
            <v-card-text>
              <v-form>
                <!-- 아이디 필드 -->
                <v-text-field 
                  v-model="user.id" 
                  label="아이디" 
                  variant="outlined" 
                  :error-messages="idErrorMessage" 
                  @input="idErrorMessage = ''"
                  @keyup.enter="submitSignup">
                </v-text-field>

                <!-- 비밀번호 필드 -->
                <v-text-field 
                  v-model="user.password" 
                  label="비밀번호" 
                  variant="outlined" 
                  type="password" 
                  :error-messages="passwordErrorMessage" 
                  @input="passwordErrorMessage = ''"
                  @keyup.enter="submitSignup">
                </v-text-field>

                <!-- 이름 필드 -->
                <v-text-field 
                  v-model="user.name" 
                  label="이름 (실명)" 
                  variant="outlined" 
                  :error-messages="nameErrorMessage" 
                  @input="nameErrorMessage = ''"
                  @keyup.enter="submitSignup">
                </v-text-field>

                <!-- 생년월일 필드 -->
                <v-text-field 
                  v-model="user.birthDate" 
                  label="생년월일 (예: 20001231)" 
                  variant="outlined" 
                  :error-messages="birthDateErrorMessage" 
                  @input="birthDateErrorMessage = ''"
                  @keyup.enter="submitSignup">
                </v-text-field>

                <!-- 이메일 필드 -->
                <v-text-field 
                  v-model="user.email" 
                  label="이메일" 
                  variant="outlined" 
                  :error-messages="emailErrorMessage" 
                  @input="emailErrorMessage = ''"
                  @keyup.enter="submitSignup">
                </v-text-field>

                <!-- 휴대폰 번호 필드 -->
                <v-text-field 
                  v-model="user.phoneNumber" 
                  label="휴대폰 번호" 
                  variant="outlined" 
                  :error-messages="phoneNumberErrorMessage" 
                  @input="phoneNumberErrorMessage = ''"
                  @keyup.enter="submitSignup">
                </v-text-field>

                <!-- 구직 희망 분야 선택 -->
                <v-select
                  v-model="user.desiredJobField"
                  :items="jobFields"
                  label="구직 희망 분야"
                  variant="outlined">
                </v-select>

                <!-- 경력 수준 선택 -->
                <v-select
                  v-model="user.experienceLevel"
                  :items="experienceLevels"
                  label="경력 수준"
                  variant="outlined">
                </v-select>

                <!-- 면접 준비 상태 선택 -->
                <v-select
                  v-model="user.interviewStatus"
                  :items="interviewStatuses"
                  label="면접 준비 상태"
                  variant="outlined">
                </v-select>

                <!-- 목표 회사 선택 -->
                <v-select
                  v-model="user.targetCompany"
                  :items="targetCompanies"
                  label="목표 회사"
                  variant="outlined">
                </v-select>

                <!-- 면접 경험 유무 선택 -->
                <v-select
                  v-model="user.interviewExperience"
                  :items="['선택하지 않음', '있다', '없다']"
                  variant="outlined"
                  label="면접 경험">
                </v-select>

                <!-- 체크 박스 -->
                <v-checkbox v-model="user.isOver15" label="[필수] 만 15세 이상입니다." @change="isOver15ErrorMessage = ''"></v-checkbox>
                <span v-if="isOver15ErrorMessage" class="error-message">{{ isOver15ErrorMessage }}</span>
                <v-checkbox v-model="user.termsAgreement" label="[필수] 이용약관 동의" @change="termsAgreementErrorMessage = ''"></v-checkbox>
                <span v-if="termsAgreementErrorMessage" class="error-message">{{ termsAgreementErrorMessage }}</span>
                <v-checkbox v-model="user.privacyAgreement" label="[필수] 개인정보 수집 및 이용 동의" @change="privacyAgreementErrorMessage = ''"></v-checkbox>
                <span v-if="privacyAgreementErrorMessage" class="error-message">{{ privacyAgreementErrorMessage }}</span>
                <v-checkbox v-model="user.marketingConsent" label="마케팅 및 뉴스레터 수신 동의"></v-checkbox>
              </v-form>
            </v-card-text>

            <v-card-actions class="d-flex flex-column justify-center">
              <v-btn style="background-color: #314692;" @click="submitSignup" class="font-weight-bold" rounded="xl"
                size="x-large" width="300">회원가입</v-btn>
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
      // 에러 메시지 상태
      idErrorMessage: '',
      passwordErrorMessage: '',
      nameErrorMessage: '',
      birthDateErrorMessage: '',
      emailErrorMessage: '',
      phoneNumberErrorMessage: '',
      isOver15ErrorMessage: '',
      termsAgreementErrorMessage: '',
      privacyAgreementErrorMessage: '',

      // 사용자 입력 데이터
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
      
      // 체크박스 선택 항목
      jobFields: ['선택하지 않음', 'IT', '마케팅', '영업', '디자인', '연구개발', '교육', '건강', '금융', '법률', '엔지니어링', '제조업', '서비스업', '소매업', '문화예술', '공공기관', '스타트업', '기타'],
      experienceLevels: ['선택하지 않음', '신입', '1-2년', '3-5년', '6-10년', '10년 이상'],
      interviewStatuses: ['선택하지 않음', '시작하지 않음', '진행 중', '거의 끝남'],
      targetCompanies: ['선택하지 않음', '공무원', '공기업', '대기업', '중견/중소기업', '외국계 기업', '기타']
    };
  },
  methods: {
    validateFields() {
      let isValid = true;

      if (!this.user.id) {
        this.idErrorMessage = "아이디를 입력해주세요.";
        isValid = false;
      }

      if (!this.user.password) {
        this.passwordErrorMessage = "비밀번호를 입력해주세요.";
        isValid = false;
      } else if (this.user.password.length < 6) {
        this.passwordErrorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
        isValid = false;
      }

      if (!this.user.name) {
        this.nameErrorMessage = "이름을 입력해주세요.";
        isValid = false;
      }

      if (!this.user.birthDate) {
        this.birthDateErrorMessage = "생년월일을 입력해주세요.";
        isValid = false;
      } else if (!/^\d{8}$/.test(this.user.birthDate)) {
        this.birthDateErrorMessage = "생년월일은 8자리 숫자로 입력해주세요. (예: 20001231)";
        isValid = false;
      }

      if (!this.user.email) {
        this.emailErrorMessage = "이메일을 입력해주세요.";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
        this.emailErrorMessage = "유효한 이메일 주소를 입력해주세요.";
        isValid = false;
      }

      if (!this.user.phoneNumber) {
        this.phoneNumberErrorMessage = "휴대폰 번호를 입력해주세요.";
        isValid = false;
      } else if (!/^\d{10,11}$/.test(this.user.phoneNumber)) {
        this.phoneNumberErrorMessage = "휴대폰 번호는 10~11자리 숫자로 입력해주세요.";
        isValid = false;
      }

      // 필수 체크란 검증
      if (!this.user.isOver15) {
        this.isOver15ErrorMessage = "만 15세 이상 여부를 확인해주세요.";
        isValid = false;
      }
      if (!this.user.termsAgreement) {
        this.termsAgreementErrorMessage = "이용약관에 동의해주세요.";
        isValid = false;
      }
      if (!this.user.privacyAgreement) {
        this.privacyAgreementErrorMessage = "개인정보 수집 및 이용에 동의해주세요.";
        isValid = false;
      }

      return isValid;
    },
    // 서버 응답 처리
    handleServerErrors(response) {
      if (response.data.result === "fail") {
        switch (response.data.field) {
          case "id":
            this.idErrorMessage = response.data.message; // 예: "이미 가입된 아이디입니다."
            break;
          case "email":
            this.emailErrorMessage = response.data.message; // 예: "이미 가입된 이메일입니다."
            break;
          default:
            alert("서버 에러: " + response.data.message);
        }
      }
    },
    // 회원가입 제출
    submitSignup() {
      if (this.validateFields()) {
        this.$axios.post("/api/users/join", this.user)
          .then(response => {
            if (response.data.result == "success") {
              alert("가입이 성공적으로 완료 되었습니다.");
              this.$router.push("/");
            } else {
              this.handleServerErrors(response); // 서버 에러 처리
            }
          })
          .catch(error => {
            alert("네트워크 오류가 발생했습니다.");
          });
      }
    }
  }
};
</script>

<style scoped>
.v-btn {
  width: 100%;
}

.v-select,
.v-text-field {
  margin-bottom: 15px;
}

.v-card-title {
  text-align: center;
}

.error-message {
  font-size: 12px;
  margin-left: 10px;
}

.v-btn[small] {
  padding: 5px 10px;
}

.error-message {
  color: #B30928;
  font-size: 0.8rem;
  margin-left: 24px;
}
</style>
