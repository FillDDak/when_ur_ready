<template>
    <v-container>
      <h1>*즐겨찾기*</h1>
  
      <!-- 검색 바 -->
      <v-text-field 
        v-model="searchQuery" 
        label="즐겨찾기 검색" 
        append-icon="mdi-magnify" 
        class="mb-5"
      ></v-text-field>
  
      <!-- 즐겨찾기 목록 -->
      <v-row>
        <v-col v-for="(item, index) in filteredFavorites" :key="index" cols="12" md="4">
          <v-card>
            <v-card-title>
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <p>{{ item.description }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="removeFavorite(index)">삭제</v-btn>
              <v-btn color="success" @click="shareFavorite(item)">공유</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 미리보기 모달 -->
      <v-dialog v-model="previewDialog" max-width="600">
        <v-card>
          <v-card-title>{{ previewItem.title }}</v-card-title>
          <v-card-text>{{ previewItem.description }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="previewDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'Favorites',
    data() {
      return {
        favorites: [
          { title: '면접 질문 1', description: '이것은 첫 번째 면접 질문입니다.' },
          { title: '면접 질문 2', description: '이것은 두 번째 면접 질문입니다.' },
          { title: '면접 질문 3', description: '이것은 세 번째 면접 질문입니다.' }
        ],
        searchQuery: '', // 검색어
        previewDialog: false, // 미리보기 다이얼로그
        previewItem: {} // 선택한 아이템
      };
    },
    computed: {
      filteredFavorites() {
        // 검색어를 기준으로 즐겨찾기 항목 필터링
        return this.favorites.filter(item =>
          item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },
    methods: {
      removeFavorite(index) {
        // 즐겨찾기 항목 삭제
        this.favorites.splice(index, 1);
      },
      viewDetails(item) {
        // 미리보기 다이얼로그 열기
        this.previewItem = item;
        this.previewDialog = true;
      },
      shareFavorite(item) {
        // 공유 기능 (링크 복사 예시)
        const shareText = `즐겨찾기 공유: ${item.title} - ${item.description}`;
        navigator.clipboard.writeText(shareText).then(() => {
          alert('공유 링크가 복사되었습니다!');
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
  </style>
  