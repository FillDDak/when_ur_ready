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
                  ref="idField"
                  v-model="user.id"
                  label="아이디"
                  variant="outlined"
                  :error-messages="idErrorMessage"
                  @input="idErrorMessage = ''"
                  @keyup.enter="submitSignup"
                ></v-text-field>

                <!-- 비밀번호 필드 -->
                <v-text-field
                  ref="passwordField"
                  v-model="user.password"
                  label="비밀번호"
                  variant="outlined"
                  type="password"
                  :error-messages="passwordErrorMessage"
                  @input="passwordErrorMessage = ''"
                  @keyup.enter="submitSignup"
                ></v-text-field>

                <!-- 이름 필드 -->
                <v-text-field
                  ref="nameField"
                  v-model="user.name"
                  label="이름 (실명)"
                  variant="outlined"
                  :error-messages="nameErrorMessage"
                  @input="nameErrorMessage = ''"
                  @keyup.enter="submitSignup"
                ></v-text-field>

                <!-- 생년월일 필드 -->
                <v-text-field
                  ref="birthDateField"
                  v-model="user.birthDate"
                  label="생년월일 (예: 20001231)"
                  variant="outlined"
                  :error-messages="birthDateErrorMessage"
                  @input="birthDateErrorMessage = ''"
                  @keyup.enter="submitSignup"
                ></v-text-field>

                <!-- 이메일 필드 -->
                <v-text-field
                  ref="emailField"
                  v-model="user.email"
                  label="이메일"
                  variant="outlined"
                  :error-messages="emailErrorMessage"
                  @input="emailErrorMessage = ''"
                  @keyup.enter="submitSignup"
                ></v-text-field>

                <!-- 휴대폰 번호 필드 -->
                <v-text-field
                  ref="phoneNumberField"
                  v-model="user.phoneNumber"
                  label="휴대폰 번호"
                  variant="outlined"
                  :error-messages="phoneNumberErrorMessage"
                  @input="phoneNumberErrorMessage = ''"
                  @keyup.enter="submitSignup"
                ></v-text-field>

                <!-- 체크 박스 -->
                <v-checkbox
                  ref="isOver15Checkbox"
                  v-model="user.isOver15"
                  label="[필수] 만 15세 이상입니다."
                  :error-messages="isOver15ErrorMessage ? [isOver15ErrorMessage] : []"
                  @change="isOver15ErrorMessage = ''"
                ></v-checkbox>

                <v-checkbox
                  ref="termsAgreementCheckbox"
                  v-model="user.termsAgreement"
                  label="[필수] 이용약관 동의"
                  :error-messages="termsAgreementErrorMessage ? [termsAgreementErrorMessage] : []"
                  @change="termsAgreementErrorMessage = ''"
                ></v-checkbox>

                <v-checkbox
                  ref="privacyAgreementCheckbox"
                  v-model="user.privacyAgreement"
                  label="[필수] 개인정보 수집 및 이용 동의"
                  :error-messages="privacyAgreementErrorMessage ? [privacyAgreementErrorMessage] : []"
                  @change="privacyAgreementErrorMessage = ''"
                ></v-checkbox>

                <v-checkbox
                  v-model="user.marketingConsent"
                  label="마케팅 및 뉴스레터 수신 동의"
                ></v-checkbox>
              </v-form>
            </v-card-text>

            <v-card-actions class="d-flex flex-column justify-center">
              <v-btn
                style="background-color: #314692;
                color: white;"
                @click="submitSignup"
                class="font-weight-bold"
                rounded="xl"
                size="x-large"
                width="300"
              >
                회원가입
              </v-btn>
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
      idErrorMessage: "",
      passwordErrorMessage: "",
      nameErrorMessage: "",
      birthDateErrorMessage: "",
      emailErrorMessage: "",
      phoneNumberErrorMessage: "",
      isOver15ErrorMessage: "",
      termsAgreementErrorMessage: "",
      privacyAgreementErrorMessage: "",

      // 사용자 입력 데이터
      user: {
        id: "",
        password: "",
        name: "",
        birthDate: "",
        email: "",
        phoneNumber: "",
        isOver15: false,
        termsAgreement: false,
        privacyAgreement: false,
        marketingConsent: false,
      },
    };
  },
  methods: {
    validateFields() {
      if (!this.user.id) {
        this.idErrorMessage = "아이디를 입력해주세요.";
        this.$nextTick(() => this.$refs.idField.focus());
        return false;
      } else if (this.user.id.length < 6) {
        this.idErrorMessage = "아이디는 최소 6자 이상이어야 합니다.";
        this.$nextTick(() => this.$refs.idField.focus());
        return false;
      }

      if (!this.user.password) {
        this.passwordErrorMessage = "비밀번호를 입력해주세요.";
        this.$nextTick(() => this.$refs.passwordField.focus());
        return false;
      } else if (this.user.password.length < 8) {
        this.passwordErrorMessage = "비밀번호는 최소 8자 이상이어야 합니다.";
        this.$nextTick(() => this.$refs.passwordField.focus());
        return false;
      }

      if (!this.user.name) {
        this.nameErrorMessage = "이름을 입력해주세요.";
        this.$nextTick(() => this.$refs.nameField.focus());
        return false;
      }

      if (!this.user.birthDate) {
        this.birthDateErrorMessage = "생년월일을 입력해주세요.";
        this.$nextTick(() => this.$refs.birthDateField.focus());
        return false;
      } else if (!/^\d{8}$/.test(this.user.birthDate)) {
        this.birthDateErrorMessage =
          "생년월일은 8자리 숫자로 입력해주세요. (예: 20001231)";
        this.$nextTick(() => this.$refs.birthDateField.focus());
        return false;
      }

      if (!this.user.email) {
        this.emailErrorMessage = "이메일을 입력해주세요.";
        this.$nextTick(() => this.$refs.emailField.focus());
        return false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
        this.emailErrorMessage = "유효한 이메일 주소를 입력해주세요.";
        this.$nextTick(() => this.$refs.emailField.focus());
        return false;
      }

      if (!this.user.phoneNumber) {
        this.phoneNumberErrorMessage = "휴대폰 번호를 입력해주세요.";
        this.$nextTick(() => this.$refs.phoneNumberField.focus());
        return false;
      } else if (!/^\d{10,11}$/.test(this.user.phoneNumber)) {
        this.phoneNumberErrorMessage =
          "휴대폰 번호는 10~11자리 숫자로 입력해주세요.";
        this.$nextTick(() => this.$refs.phoneNumberField.focus());
        return false;
      }

      if (!this.user.isOver15) {
        this.isOver15ErrorMessage = "만 15세 이상 여부를 확인해주세요.";
        this.$nextTick(() =>
          this.$refs.isOver15Checkbox.$el.scrollIntoView({ behavior: "smooth" })
        );
        return false;
      }

      if (!this.user.termsAgreement) {
        this.termsAgreementErrorMessage = "이용약관에 동의해주세요.";
        return false;
      }

      if (!this.user.privacyAgreement) {
        this.privacyAgreementErrorMessage =
          "개인정보 수집 및 이용에 동의해주세요.";
        return false;
      }

      return true;
    },
    handleServerErrors(response) {
      if (response.data.result === "fail") {
        switch (response.data.field) {
          case "id":
            this.idErrorMessage = response.data.message;
            this.$nextTick(() => this.$refs.idField.focus());
            break;
          case "email":
            this.emailErrorMessage = response.data.message;
            this.$nextTick(() => this.$refs.emailField.focus());
            break;
          default:
            alert("서버 에러: " + response.data.message);
        }
      }
    },
    submitSignup() {
      if (this.validateFields()) {
        this.$axios
          .post("/api/users/join", this.user)
          .then((response) => {
            if (response.data.result === "success") {
              alert("가입이 성공적으로 완료되었습니다.");
              this.$router.push("/");
            } else {
              this.handleServerErrors(response);
            }
          })
          .catch((error) => {
            alert("네트워크 오류가 발생했습니다.");
          });
      }
    },
  },
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
  color: #b30928;
}
</style>
