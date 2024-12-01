<template>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1 class="title">면접 스터디 커뮤니티</h1>
      <p class="subtitle">함께 준비하고 성장하는 공간</p>
    </header>

    <!-- Search Bar -->
    <div class="search-bar">
      <div class="search-input">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15.75 15.75L21 21m-5.25-5.25a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
        </svg>
        <input type="text" placeholder="스터디 그룹 또는 공고 검색" />
      </div>
      <button class="new-post-btn" @click="openNewGroupModal">
        <svg class="plus-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        새 글 작성
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab" :class="{ active: activeTab === 'studyGroups' }" @click="setActiveTab('studyGroups')">
        스터디 그룹
      </button>
      <button class="tab" :class="{ active: activeTab === 'jobPosts' }" @click="setActiveTab('jobPosts')">
        채용 공고
      </button>
    </div>

    <!-- Cards -->
    <div class="cards">
      <div class="card" v-for="(group, index) in studyGroups" :key="index">
        <div class="card-header">
          <h2 class="card-title">{{ group.title }}</h2>
          <p class="card-description">{{ group.description }}</p>
        </div>
        <div class="card-content">
          <p class="card-detail">
            👥 {{ group.members }} / {{ group.capacity }} 명
          </p>
          <p class="card-detail">
            📚 {{ group.meetingFrequency || "미정" }}
          </p>
        </div>
        <div class="card-footer">
          <button class="apply-btn">참여 신청</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeNewGroupModal">
      <div class="modal">
        <h2>새 {{ modalType === 'studyGroup' ? '스터디 그룹' : '채용 공고' }} 작성</h2>
        <div class="form">
          <!-- 유형 선택 -->
          <div class="form-group">
            <label>유형 선택</label>
            <select v-model="modalType">
              <option value="studyGroup">스터디 그룹</option>
              <option value="jobPost">채용 공고</option>
            </select>
          </div>

          <!-- 공통 입력 필드 -->
          <input type="text" placeholder="제목" v-model="newGroup.title" />
          <input type="text" placeholder="사용 언어" v-model="newGroup.language" />
          <input type="number" placeholder="모집 인원" v-model="newGroup.capacity" />
          <textarea placeholder="세부 내용" v-model="newGroup.description"></textarea>

          <!-- 조건부 필드 -->
          <div v-if="modalType === 'studyGroup'">
            <input type="text" placeholder="공부 방법" v-model="newGroup.methodology" />
          </div>
          <div v-if="modalType === 'jobPost'">
            <input type="number" placeholder="월급 (만원)" v-model="newGroup.salary" />
          </div>

          <!-- 사진 첨부 -->
          <div class="form-group">
            <label>사진 첨부</label>
            <input type="file" @change="handleFileUpload" />
          </div>

          <div class="modal-buttons">
            <button @click="createStudyGroup">저장</button>
            <button @click="closeNewGroupModal">취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const api = axios.create({
  baseURL: "/api", // 실제 API URL로 변경
});

export default {
  name: "InterviewStudyBoard",
  data() {
    return {
      activeTab: "studyGroups",
      studyGroups: [],
      showModal: false,
      modalType: "studyGroup", // Modal 유형 (스터디 그룹 또는 채용 공고)
      newGroup: {
        title: "",
        language: "",
        capacity: "",
        description: "",
        methodology: "", // 공부 방법 (스터디 그룹 전용)
        salary: "", // 월급 (채용 공고 전용)
        photo: null, // 첨부 사진 파일
      },
    };
  },
  methods: {
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    fetchStudyGroups() {
      // 수정된 API 요청
      api
        .get("/study-groups")
        .then((response) => {
          this.studyGroups = response.data;
        })
        .catch((error) => {
          console.error("Error fetching study groups:", error.response?.data || error.message);
          alert(`스터디 그룹 데이터를 불러오는데 실패했습니다: ${error.response?.data?.message || error.message}`);
        });
    },
    // Open modal
    openNewGroupModal() {
      this.showModal = true;
    },
    // Close modal
    closeNewGroupModal() {
      this.showModal = false;
      this.modalType = "studyGroup";
      this.resetForm();
    },
    // Handle file upload
    handleFileUpload(event) {
      this.newGroup.photo = event.target.files[0];
    },
    // Create a new study group
    createStudyGroup() {
      if (
        !this.newGroup.title ||
        !this.newGroup.language ||
        !this.newGroup.capacity ||
        !this.newGroup.description
      ) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      // FormData 생성
      const formData = new FormData();
      formData.append("title", this.newGroup.title);
      formData.append("language", this.newGroup.language);
      formData.append("capacity", this.newGroup.capacity);
      formData.append("description", this.newGroup.description);
      if (this.modalType === "studyGroup") {
        formData.append("methodology", this.newGroup.methodology);
      } else if (this.modalType === "jobPost") {
        formData.append("salary", this.newGroup.salary);
      }
      if (this.newGroup.photo) {
        formData.append("photo", this.newGroup.photo);
      }

      // API 엔드포인트 선택
      const endpoint =
        this.modalType === "studyGroup"
          ? "/study-groups"
          : "/job-posts";

      // POST 요청
      api
        .post(endpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          alert(response.data.message);
          if (this.modalType === "studyGroup") {
            this.studyGroups.push(response.data.group);
          }
          this.closeNewGroupModal();
        })
        .catch((error) => {
          console.error("Error creating group:", error);
          alert("그룹 생성에 실패했습니다.");
        });
    },
    // Reset form
    resetForm() {
      this.newGroup = {
        title: "",
        language: "",
        capacity: "",
        description: "",
        methodology: "",
        salary: "",
        photo: null,
      };
    },
  },
  mounted() {
    this.fetchStudyGroups();
  },
};
</script>


<style scoped>
.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group label {
  margin-bottom: 8px;
  display: block;
  font-weight: bold;
}

/* Container Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  font-family: Arial, sans-serif;
}

/* Header Styles */
.header {
  margin-bottom: 24px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
}

/* Search Bar Styles */
.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.search-input {
  position: relative;
  flex: 1;
  margin-right: 16px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #888;
}

.search-input input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.new-post-btn {
  display: flex;
  align-items: center;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.new-post-btn .plus-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

/* Tabs Styles */
.tabs {
  display: flex;
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.tab:hover {
  background-color: #eaeaea;
}

.tab.active {
  background-color: #007bff;
  color: white;
  border-bottom: 2px solid #0056b3;
  font-weight: bold;
}

/* Card Styles */
.cards {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.card-description {
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}

.card-content {
  padding: 16px;
}

.card-detail {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.card-footer {
  padding: 16px;
  border-top: 1px solid #ddd;
  text-align: center;
}

.apply-btn {
  width: 100%;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.apply-btn:hover {
  background-color: #218838;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  margin-bottom: 16px;
}

.modal .form input,
.modal .form textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal .modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal .modal-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal .modal-buttons button:nth-child(1) {
  background-color: #007bff;
  color: white;
}

.modal .modal-buttons button:nth-child(2) {
  background-color: #ccc;
  color: black;
}
</style>