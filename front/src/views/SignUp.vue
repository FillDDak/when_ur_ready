<template>
    <v-app>
      <v-container>
        <v-row justify="center" align="center" class="my-12">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="headline">회원가입</v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid">
                  
                  <v-text-field
                    v-model="name"
                    label="이름"
                    :rules="[nameRules]"
                    required
                  ></v-text-field>
  
                 
                  <v-text-field
                    v-model="email"
                    label="이메일"
                    :rules="[emailRules]"
                    required
                    @blur="checkEmailDuplication"
                  >
                    <template v-slot:append>
                      <v-btn
                        :disabled="isEmailChecked || emailStatus === '중복됨'"
                        @click="checkEmailDuplication"
                        
                        small
                       
                      >
                        중복 확인
                      </v-btn>
                    </template>
                  </v-text-field>
  
                  
                  <v-row>
                    <v-col cols="12">
                      <span
                        v-if="emailStatus === '중복됨'"
                        style="color: red; font-size: 12px; margin-left: 10px;"
                        >이미 사용 중인 이메일입니다.</span
                      >
                      <span
                        v-if="emailStatus === '사용 가능'"
                        style="color: green; font-size: 12px; margin-left: 10px;"
                        >사용 가능한 이메일입니다.</span
                      >
                    </v-col>
                  </v-row>
  
                  <v-text-field
                    v-model="password"
                    label="비밀번호"
                    type="password"
                    :rules="[passwordRules]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="phone"
                    label="전화번호 (선택)"
                    :rules="[phoneRules]"
                  ></v-text-field>
  
                  
                  <v-select
                    v-model="desiredJobField"
                    :items="jobFields"
                    label="구직 희망 분야"
                    required
                  ></v-select>
                  <v-select
                    v-model="experienceLevel"
                    :items="experienceLevels"
                    label="경력 수준"
                    required
                  ></v-select>
                  <v-select
                    v-model="interviewStatus"
                    :items="interviewStatuses"
                    label="면접 준비 상태"
                    required
                  ></v-select>
                  <v-select
                    v-model="targetCompany"
                    :items="targetCompanies"
                    label="목표 회사"
                    required
                  ></v-select>
  
                  
                  <v-select
                    v-model="interviewExperience"
                    :items="['있다', '없다']"
                    label="면접 경험"
                    required
                  ></v-select>
  
                  
                  
  
                 
                  <v-checkbox
                    v-model="agreeToTerms"
                    label="개인 정보 수집 및 이용 동의"
                    required
                  ></v-checkbox>
                  <v-checkbox
                    v-model="agreeToMarketing"
                    label="마케팅 및 뉴스레터 수신 동의 (선택)"
                  ></v-checkbox>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="submitForm">회원가입</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const valid = ref(false)
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const phone = ref('')
  const desiredJobField = ref('')
  const experienceLevel = ref('')
  const interviewStatus = ref('')
  const targetCompany = ref('')
  const interviewExperience = ref('')  
  const receiveNotifications = ref(false)
  const agreeToTerms = ref(false)
  const agreeToMarketing = ref(false)
  const isEmailChecked = ref(false)
  const emailStatus = ref('')
  
 
  const nameRules = [v => !!v || '이름을 입력해 주세요']
  const emailRules = [v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력해 주세요']
  const passwordRules = [v => !!v || '비밀번호를 입력해 주세요']
  const phoneRules = [v => !v || /^[0-9]{10,11}$/.test(v) || '전화번호 형식이 올바르지 않습니다']
  
  
  const jobFields = ['IT', '마케팅', '영업', '디자인', '연구개발', '교육', '건강', '금융', '법률', '엔지니어링', '제조업', '서비스업', '소매업', '문화예술', '공공기관', '스타트업', '기타']
  const experienceLevels = ['신입', '1-2년', '3-5년', '6-10년', '10년 이상']
  const interviewStatuses = ['시작하지 않음', '진행 중', '거의 끝남']
  const targetCompanies = ['공무원', '공기업', '대기업', '중견/중소기업', '외국계 기업', '기타']
  
 
  const checkEmailDuplication = async () => {
    if (email.value) {
      const isDuplicate = Math.random() > 0.5
      if (isDuplicate) {
        emailStatus.value = '중복됨'
      } else {
        emailStatus.value = '사용 가능'
      }
      isEmailChecked.value = true
    }
  }
  
  
  const submitForm = () => {
    if (valid.value && emailStatus.value === '사용 가능') {
      console.log({
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
        desiredJobField: desiredJobField.value,
        experienceLevel: experienceLevel.value,
        interviewStatus: interviewStatus.value,
        targetCompany: targetCompany.value,
        interviewExperience: interviewExperience.value,  
        receiveNotifications: receiveNotifications.value,
        agreeToTerms: agreeToTerms.value,
        agreeToMarketing: agreeToMarketing.value
      })
    } else {
      console.log('유효하지 않은 정보입니다.')
    }
  }
  </script>
  
  <style scoped>
  .v-btn {
    width: 100%;
  }
  
  .v-checkbox, .v-switch {
    margin-top: 10px;
  }
  
  .v-select, .v-text-field {
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
    
  }
  </style>
  