<template>
  <div class="container">
    <h2 class="bold-text">AI 얼굴 인식 면접 기능</h2>

    <div class="video-container">
      <div v-show="!videoStream" class="placeholder">
        면접이 시작되면 여기에 비디오가 표시됩니다.
      </div>
      <video v-show="videoStream" ref="video" autoplay playsinline width="640" height="480"></video>
      <canvas ref="canvas" width="640" height="480" style="position: absolute;"></canvas>
    </div>

    <div class="button-container">
      <button v-if="!analyzing" @click="startAnalysis">표정 분석하기</button>
      <button v-if="analyzing" @click="stopAnalysis">표정 분석 종료하기</button>
    </div>

    <p class="expression-text">감지된 표정: <strong>{{ expression }}</strong></p>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  name: "FaceRecognition",
  data() {
    return {
      expression: "분석 대기 중...",
      analyzing: false,
      videoStream: null,
      intervalId: null,
    };
  },
  mounted() {
    this.loadModels();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeDestroy() {
    this.stopAnalysis(); // 컴포넌트 파괴 전 카메라 종료
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    // 모델 로드
    async loadModels() {
      try {
        const MODEL_URL = '/models'; // 모델 파일이 public/models 폴더에 있어야 합니다.
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        console.log("모델 로드 완료");
      } catch (error) {
        console.error("모델 로드 실패:", error);
      }
    },

    // 비디오 시작
    startVideo() {
      if (this.videoStream) return; // 이미 스트림이 있으면 재시작하지 않음

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
          this.videoStream = stream;
        })
        .catch((err) => {
          console.error("카메라 접근 실패:", err);
          alert("카메라 접근에 실패했습니다.");
        });
    },

    // 분석 시작
    startAnalysis() {
      this.analyzing = true;
      this.expression = "분석 중...";
      this.startVideo();

      // 비디오 로드 완료 후 얼굴 감지 시작
      this.$refs.video.addEventListener('loadeddata', this.detectFaces);
    },

    // 분석 종료
    stopAnalysis() {
      this.analyzing = false;
      this.expression = "분석 종료";

      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
        this.videoStream = null;
      }

      clearInterval(this.intervalId);
    },

    // 얼굴 감지 및 표정 분석
    detectFaces() {
      const video = this.$refs.video;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      this.intervalId = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.length > 0) {
          // 가장 높은 확률의 표정 선택
          const { expressions } = detections[0];
          const sortedExpressions = Object.entries(expressions).sort(([, a], [, b]) => b - a);
          this.expression = `${sortedExpressions[0][0]} (${(sortedExpressions[0][1] * 100).toFixed(1)}%)`;
          const highestExpression = sortedExpressions[0][0];

          // 표정별 맞춤형 메시지 출력
        switch (highestExpression) {
          case "happy":
            this.expression = "면접에 적절한 웃는 표정입니다.";
            break;
          case "sad":
            this.expression = "슬픈 표정입니다. 조금 많이 웃으세요.";
            break;
          case "angry":
            this.expression = "화난 표정입니다. 조금 많이 웃으세요.";
            break;
          case "fearful":
            this.expression = "두려운 표정입니다. 떨지 마세요.";
            break;
          case "surprised":
            this.expression = "놀란 표정입니다. 한번 웃어보세요.";
            break;
          case "disgusted":
            this.expression = "혐오스러운 표정입니다. 한번 웃어보세요.";
            break;
          case "neutral":
            this.expression = "감정이 없는 평범한 표정입니다. 한번 웃어보세요.";
            break;
          default:
            this.expression = "알 수 없는 표정입니다.";
            break;
        }
          // 얼굴 감지 및 랜드마크 그리기
          const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        } else {
          this.expression = "얼굴을 감지할 수 없습니다.";
        }
      }, 100);
    },

    // 페이지 visibility 상태 변경 시 카메라 종료
    handleVisibilityChange() {
      if (document.hidden) {
        this.stopAnalysis(); // 페이지가 숨겨지면 카메라 종료
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.video-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 640px;
  height: 480px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  /* 회색 배경 */
  color: #666;
  /* 텍스트 색상 */
  font-size: 16px;
  border-radius: 8px;
}

video {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 20px 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 640px;
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid rgb(49, 70, 146);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.button-container {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

button:hover {
  background-color: rgb(49, 70, 146);
  color: #fff;
}

button:focus {
  outline: none;
}
</style>
