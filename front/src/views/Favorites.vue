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
      <h2 class="section-title">👀 저장한 키워드 답변 피드백 모아보기</h2>
      <div class="scroll-container">
        <v-card
          v-for="(item, index) in filteredFavorites"
          :key="'recent-' + index"
          class="recent-card"
        >
          <v-card-title>
            <v-icon color="primary" class="mr-2">mdi-clock</v-icon>
            <span class="recent-title" v-html="highlightText(item.title)"></span>
          </v-card-title>
          <v-card-text>
            <p v-html="highlightText(item.description)"></p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" outlined @click="viewDetails(item)">상세 보기</v-btn>
            <v-btn color="error" @click="removeFromRecent(index)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </section>

    <!-- 미리보기 모달 -->
    <v-dialog v-model="previewDialog" max-width="600">
      <v-card>
        <v-card-title class="preview-title">{{ previewItem.title }}</v-card-title>
        <v-card-text>
          <!-- 사용자가 입력할 텍스트 입력란 추가 -->
          <v-textarea 
            v-model="previewItem.userText" 
            label="내가 작성한 글"
            rows="6"
            outlined
            style="white-space: pre-wrap; word-wrap: break-word; height: auto; overflow-y: auto; resize: vertical;"
          ></v-textarea>

          <!-- 관련 피드백 내용 -->
          <v-divider class="my-4"></v-divider>
          <h3 class="feedback-title">관련 피드백</h3>
          <p>{{ previewItem.feedback }}</p>
        </v-card-text>
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
        { title: 'SK하이닉스에 대한 경험과 이해를 바탕으로,우리 회사에서 근무하게 될 경우 어떻게 기여할 수 있을 것이라 생각하시는지 설명해주실 수 있나요', description: '관련키워드:경험(회사)' },
        { title: 'SK하이닉스의 기업 문화와 가치에 대해 어떻게 이해하시고,이에 어떻게 잘 적응할 수 있을것이라 생각하시나요?', description: '관련 키워드:기업 문화(회사)' },
        { title: '저희가 요구하는 근무지역,학력,급여조건 등의 채용 조건에 어떠한 이해를 가지고 계신지요? 우리 회사의 이러한 요구사항에 어떻게 대응할 수 있을까요?', description: '괸련키워드:학력(예상)' },
        { title: '자신의 강점과 약점에 대해 설명해 주세요.', description: '관련키워드:글로벌 시장(예상)' },
        { title: '업무 스트레스를 어떻게 관리하나요?', description: '저는 스트레스를 관리하기 위해 운동을 자주 합니다...' },
        { title: '팀워크에서 중요한 요소는 무엇인가요?', description: '저는 팀워크에서 중요한 요소로 소통과 협업을 강조합니다...' },
      ],
      searchQuery: '',
      recentPages: [
        { title: 'sk하이닉스에 대한 경험과 이해를 바탕으로 우리회사에서 근무하게 될 경우 어떻게 기여할 수 있을 것이라 생각하시는지 설명해 주실 수 있나요?', description: '저는 SK하이닉스가 반도체 산업...' },
        { title: '지원하신 직무에 대한...', description: '저는 평소에도 하이닉스...' },
        { title: '저희가 요구하는...', description: '바람직한 사원이 되기위한 역량은...' },
        { title: '당신이 이전 직장에서 경험한 프로젝트에 대해 설명해 주세요.', description: '저는 이전 직장에서 다양한 프로젝트를 수행했으며...' },
        { title: '우리 회사에서 일하는 데 필요한 역량에 대해 설명해 주세요.', description: '저는 기술적 역량을 쌓아왔으며...' },
        { title: '고객과의 소통 경험에 대해 이야기해 주세요.', description: '저는 고객과의 소통을 중요시하며...' },
       
      ],
      previewDialog: false,
      previewItem: {
        feedback: 'SK하이닉스에서 근무하기 위해서는 높은 기술력과 혁신적인 R&D 환경을 이해하고, 그에 맞는 경험과 능력을 바탕으로 기여할 수 있어야 합니다.'
      }
    };
  },
  computed: {
    filteredFavorites() {
      return this.favorites.filter(item =>
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    highlightText(text) {
      if (this.searchQuery) {
        const regex = new RegExp(`(${this.searchQuery})`, 'gi');
        return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
      }
      return text;
    },
    removeFavorite(index) {
      this.favorites.splice(index, 1);
    },
    viewDetails(item) {
      this.previewItem = { 
        ...item, 
        userText: '저는 SK하이닉스가 반도체 산업의 선두주자로서 글로벌 시장에서 중요한 역할을 하고 있다는 점을 잘 이해하고 있습니다.특히,메모리 반도체 분야에서의 뛰어난 기술력과 혁신적인 R&D 환경을 통해 지속적인 성장을 이루고 있는 회사라는 점에서 매우 큰 존경을 표합니다. SK하이닉스에서 근무하게 된다면,제 경험과 능력을 바탕으로 여러가지 방식으로 기여할수 있을 것이라 생각합니다.',
        feedback: '당신이 본인의 능력과 경험을 바탕으로 SK하이닉스에 기여할 수 있다는 점을 명확하게 언급한 것이 좋습니다. 그러나 자신의 이러한 능력과 경험이 무엇인지,그리고 어떤 방식으로 기여할 수 있을지에 대한 부분을 더 드러내는 것이 필요합니다. 예를들어, 어떤 이전 작업이 이 업무에 도움이 될 수 있는지,그리고 자신의 기술 분야에서 어떤 중요한 성과를 이뤄낼 수 있는지를 분명히 표현하기를 추천드립니다.'
      };
      this.previewDialog = true;
    },
    removeFromRecent(index) {
      this.recentPages.splice(index, 1); // 최근에 본 페이지에서 항목 삭제
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
  background-color: #f1f1f1;
}

.scroll-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.recent-card {
  flex: 0 0 auto;
  width: 300px;
}

.recent-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* title 텍스트 길이가 7글자 이상일 경우 ... 처리 */
.recent-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 180px; /* 적당한 크기로 설정 */
}

.preview-title {
  white-space: normal; /* 텍스트가 잘리지 않게 설정 */
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 1.5rem; /* 타이틀 크기 조정 */
  margin-bottom: 10px;
}

.feedback-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
