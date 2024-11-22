<template>
  <v-container>
    <h1 class="page-title">🌟 즐겨찾기</h1>

    <!-- 검색 바 -->
    <v-text-field 
      v-model="searchQuery" 
      label="즐겨찾기 검색" 
      append-icon="mdi-magnify" 
      class="mb-5 search-bar"
    ></v-text-field>

    <!-- 최근에 본 페이지 -->
    <section class="section recent-section">
      <h2 class="section-title">👀 최근에 본 페이지</h2>
      <v-row>
        <v-col 
          v-for="(item, index) in recentPages" 
          :key="'recent-' + index" 
          cols="12" 
          md="4"
        >
          <v-card class="recent-card">
            <v-card-title>
              <v-icon color="primary" class="mr-2">mdi-clock</v-icon>
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <p>{{ item.description }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" outlined @click="viewDetails(item)">상세 보기</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- 추천 면접 페이지 -->
    <section class="section recommended-section">
      <h2 class="section-title">💡 추천 면접 페이지</h2>
      <v-row>
        <v-col 
          v-for="(item, index) in recommendedPages" 
          :key="'recommended-' + index" 
          cols="12" 
          md="4"
        >
          <v-card class="recommended-card">
            <v-card-title>
              <v-icon color="green" class="mr-2">mdi-lightbulb-on</v-icon>
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <p>{{ item.description }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="success" @click="addToFavorites(item)">즐겨찾기에 추가</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- 내 즐겨찾기 -->
    <section class="section favorites-section">
      <h2 class="section-title">📁 내 즐겨찾기</h2>
      <v-row>
        <v-col 
          v-for="(item, index) in filteredFavorites" 
          :key="'favorite-' + index" 
          cols="12" 
          md="4"
        >
          <v-card class="favorites-card">
            <v-card-title>
              <v-icon color="red" class="mr-2">mdi-star</v-icon>
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <p>{{ item.description }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="removeFavorite(index)">삭제</v-btn>
              <v-btn color="blue" outlined @click="shareFavorite(item)">공유</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </section>

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
      searchQuery: '',
      recentPages: [
        { title: '최근 페이지 1', description: '사용자가 최근에 방문한 페이지 1입니다.' },
        { title: '최근 페이지 2', description: '사용자가 최근에 방문한 페이지 2입니다.' },
        { title: '최근 페이지 3', description: '사용자가 최근에 방문한 페이지 3입니다.' }
      ],
      recommendedPages: [
        { title: '추천 면접 페이지 1', description: '이 페이지는 추천하는 면접 관련 자료입니다.' },
        { title: '추천 면접 페이지 2', description: '이 페이지는 추천하는 면접 관련 자료입니다.' },
        { title: '추천 면접 페이지 3', description: '이 페이지는 추천하는 면접 관련 자료입니다.' }
      ],
      previewDialog: false,
      previewItem: {}
    };
  },
  computed: {
    filteredFavorites() {
      return this.favorites.filter(item =>
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    removeFavorite(index) {
      this.favorites.splice(index, 1);
    },
    viewDetails(item) {
      this.previewItem = item;
      this.previewDialog = true;
    },
    addToFavorites(item) {
      if (!this.favorites.find(fav => fav.title === item.title)) {
        this.favorites.push(item);
        alert('즐겨찾기에 추가되었습니다!');
      } else {
        alert('이미 즐겨찾기에 추가된 항목입니다.');
      }
    },
    shareFavorite(item) {
      const shareText = `즐겨찾기 공유: ${item.title} - ${item.description}`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('공유 링크가 복사되었습니다!');
      });
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 30px;
  color: #4caf50;
}

.search-bar {
  margin-bottom: 20px;
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 8px;
}

.recent-section {
  background-color: #e3f2fd; /* Light blue */
}

.recommended-section {
  background-color: #e8f5e9; /* Light green */
}

.favorites-section {
  background-color: #fce4ec; /* Light pink */
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.recent-card:hover,
.recommended-card:hover,
.favorites-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
