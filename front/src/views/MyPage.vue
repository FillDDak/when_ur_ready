<template>
  <v-container>
    <h1>마이페이지</h1>

    <!-- 프로필 관리 섹션 -->
    <v-card class="mb-5">
      <v-card-title>프로필 정보</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-avatar class="profile-avatar">
              <template v-if="profile.photo">
                <v-img :src="profile.photo" class="profile-img"></v-img>
              </template>
              <template v-else>
                <div class="placeholder-text">사진을 첨부해주세요</div>
              </template>
            </v-avatar>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field label="이름" v-model="profile.name" variant="outlined"></v-text-field>
            <v-text-field label="연락처" v-model="profile.phoneNumber" variant="outlined"></v-text-field>
            <v-text-field label="이메일" v-model="profile.email" variant="outlined"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="saveProfile">저장</v-btn>
        <v-btn small color="primary" @click="uploadPhoto">사진 변경</v-btn>
        <input type="file" ref="photoInput" hidden @change="onPhotoChange" />
      </v-card-actions>
    </v-card>

    <!-- 비밀번호 변경 섹션 -->
    <v-card class="mb-5">
      <v-card-title>비밀번호 변경</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="11">
            <v-text-field label="기존 비밀번호" v-model="account.currentPassword" variant="outlined"
              :type="showPasswords.current ? 'text' : 'password'"
              :append-inner-icon="showPasswords.current ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="togglePasswordVisibility('current')">
            </v-text-field>
          </v-col>

        </v-row>
        <v-row>
          <v-col cols="11">
            <v-text-field label="새 비밀번호" v-model="account.newPassword" variant="outlined"
              :type="showPasswords.new ? 'text' : 'password'"
              :append-inner-icon="showPasswords.new ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="togglePasswordVisibility('new')">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="11">
            <v-text-field label="비밀번호 확인" v-model="account.confirmPassword" variant="outlined"
              :type="showPasswords.confirm ? 'text' : 'password'"
              :append-inner-icon="showPasswords.confirm ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="togglePasswordVisibility('confirm')">
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="changePassword">변경 저장</v-btn>
      </v-card-actions>
    </v-card>

    <!-- 탈퇴 섹션 -->
    <v-card>
      <v-card-title>계정 관리</v-card-title>
      <v-card-actions>
        <v-btn color="error" outlined @click="deleteAccountDialog = true">계정 탈퇴</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="deleteAccountDialog" max-width="400" height="180" @keyup.enter="deleteAccount">
      <v-card>
        <v-card-text class="d-flex flex-column justify-center align-center text-center">
          <h3 class="mb-4">회원탈퇴 하시겠습니까?</h3>
          <div class="d-flex justify-end">
            <v-btn style="background-color: #314692; font-size: 16px; color: white;" class="mr-4 font-weight-bold"
              rounded="xl" @click="deleteAccount">
              회원탈퇴
            </v-btn>
            <v-btn style="border: 2px solid #314692;" class="font-weight-bold" rounded="xl" outlined
              @click="deleteAccountDialog = false">
              취소
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Review',
  data() {
    return {
      user: {},
      profile: {
        photo: '',
        name: '',
        phoneNumber: '',
        email: ''
      },
      account: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showPasswords: {
        current: false,
        new: false,
        confirm: false
      },
      deleteAccountDialog: false
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      this.$axios.post("/api/users/info")
        .then(response => {
          if (response.data.result === "success") {
            this.user = response.data.user;
            this.profile.name = this.user.name;
            this.profile.phoneNumber = this.user.phoneNumber;
            this.profile.email = this.user.email;
          } else {
            console.error("Failed to fetch user info");
          }
        })
        .catch(error => {
          console.error("Error fetching user info:", error);
        });
    },
    uploadPhoto() {
      this.$refs.photoInput.click();
    },
    onPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profile.photo = URL.createObjectURL(file);
      }
    },
    saveProfile() {
      alert('프로필 정보가 저장되었습니다.');
    },
    togglePasswordVisibility(field) {
      this.showPasswords[field] = !this.showPasswords[field];
    },
    changePassword() {
      if (!this.account.currentPassword) {
        alert("기존 비밀번호를 입력해주세요.");
        return;
      }

      if (!this.account.newPassword) {
        alert("새 비밀번호를 입력해주세요.");
        return;
      }

      if (this.account.newPassword.length < 8) {
        alert("새 비밀번호는 최소 8자 이상이어야 합니다.");
        return;
      }

      if (this.account.newPassword !== this.account.confirmPassword) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      this.$axios.post("/api/users/change-password", {
        id: this.user.id,
        currentPassword: this.account.currentPassword,
        newPassword: this.account.newPassword
      })
        .then(response => {
          if (response.data.result === "success") {
            alert("비밀번호가 성공적으로 변경되었습니다.");
            this.resetAccount();
          } else {
            alert(response.data.message);
          }
        })
        .catch(error => {
          alert("비밀번호 변경에 실패했습니다.");
          console.error("Error changing password:", error);
        });
    },
    resetAccount() {
      this.account = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    },
    deleteAccount() {
      this.$axios.post("/api/users/delete", { id: this.user.id })
        .then(response => {
          if (response.data.result === "success") {
            alert("회원 탈퇴가 성공적으로 완료되었습니다.");
            this.deleteAccountDialog = false;
            this.$router.push("/").then(() => {
              window.location.reload();
            });
          } else {
            alert(response.data.message);
          }
        })
        .catch(error => {
          alert("회원 탈퇴에 실패했습니다.");
          console.error('Error deleting account:', error);
        });
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 300px;
  height: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin: 0 auto;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.placeholder-text {
  font-size: 1rem;
  color: #aaa;
  text-align: center;
}
</style>
