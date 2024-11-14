<template>
  <v-container>
    <h1>마이페이지</h1>
    <p></p>

    <!-- 프로필 관리 섹션 -->
    <v-card class="mb-5">
      <v-card-title>프로필 정보</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-avatar size="100">
              <v-img :src="profile.photo || defaultPhoto"></v-img>
            </v-avatar>
            <v-btn small color="primary" @click="uploadPhoto">사진 변경</v-btn>
            <input type="file" ref="photoInput" hidden @change="onPhotoChange" />
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field label="이름" v-model="profile.name"></v-text-field>
            <v-text-field label="연락처" v-model="profile.contact"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="saveProfile">저장</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 계정 설정 섹션 -->
    <v-card class="mb-5">
      <v-card-title>계정 설정</v-card-title>
      <v-card-text>
        <v-text-field label="이메일" v-model="account.email"></v-text-field>
        <v-text-field label="새 비밀번호" v-model="account.newPassword" type="password"></v-text-field>
        <v-text-field label="비밀번호 확인" v-model="account.confirmPassword" type="password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="updateAccount">변경 저장</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 로그아웃 및 탈퇴 섹션 -->
    <v-card>
      <v-card-title>계정 관리</v-card-title>
      <v-card-actions>
        <v-btn color="error" @click="logout">로그아웃</v-btn>
        <v-btn color="error" outlined @click="deleteAccount">계정 탈퇴</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Review',
  data() {
    return {
      defaultPhoto: 'https://via.placeholder.com/100', // 기본 프로필 사진
      profile: {
        photo: '', // 프로필 사진 경로
        name: '',
        contact: ''
      },
      account: {
        email: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    uploadPhoto() {
      this.$refs.photoInput.click();
    },
    onPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profile.photo = URL.createObjectURL(file); // 프로필 사진 미리보기
      }
    },
    saveProfile() {
      alert('프로필 정보가 저장되었습니다.');
      // 실제로는 서버에 저장 로직 추가
    },
    updateAccount() {
      if (this.account.newPassword !== this.account.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      alert('계정 정보가 업데이트되었습니다.');
      // 실제로는 서버에 업데이트 로직 추가
    },
    logout() {
      alert('로그아웃되었습니다.');
      // 실제로는 로그아웃 처리 로직 추가
    },
    deleteAccount() {
      if (confirm('정말로 계정을 탈퇴하시겠습니까?')) {
        alert('계정이 탈퇴되었습니다.');
        // 실제로는 서버에 계정 삭제 로직 추가
      }
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}
</style>
