<template>
  <div class="container">
    <h2 class="bold-text">AI 얼굴 인식 면접 기능</h2>
    <div class="video-container">
      <div v-show="!videoStream" class="placeholder">
        면접이 시작되면 여기에 비디오가 표시됩니다.
      </div>
      <video v-show="videoStream" ref="video" autoplay playsinline width="640" height="480"></video>
      <canvas ref="canvas" width="640" height="480" style="position: absolute;"></canvas>
      <!-- <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div> -->
    </div>
    <div class="button-container">
      <button v-if="!analyzing" @click="startAnalysis">표정 분석하기</button>
      <button v-if="analyzing" @click="stopAnalysis">표정 분석 종료하기</button>
    </div>
    <p>감지된 표정: {{ expression }}</p>
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';

export default {
  name: "FaceRecognition",
  data() {
    return {
      expression: "분석 중...",
      loading: false,
      analyzing: false,
      videoStream: null, // 미디어 스트림 객체 저장
    };
  },
  mounted() {
    this.loadModels();
  },
  methods: {
    async loadModels() {
      try {
        const MODEL_URL = '/models'; // public 디렉토리에서 모델 파일을 로드
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log("모델 로드 완료");
      } catch (error) {
        console.error("모델 로드 실패:", error);
      }
    },
    startVideo() {
      if (this.videoStream) return; // 이미 스트림이 있으면 재시작하지 않음
      var video = this.$refs.video
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
          this.videoStream = stream; // 스트림 저장
        })
        .catch((err) => console.error("카메라 접근 실패:", err));

    },
    startAnalysis() {
      this.analyzing = true;
      this.expression = "분석 중...";
      this.startVideo(); // 캠 시작
      this.captureImage(); // 표정 분석 시작
    },
    stopAnalysis() {
      this.analyzing = false;
      this.expression = "분석 종료";

      // 카메라 스트림 중지
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
        this.videoStream = null; // 스트림 초기화
      }
    },
    async captureImage() {
      if (!this.analyzing) return;
      this.loading = true;

      const video = this.$refs.video;
      const canvas = this.$refs.canvas
      video.onloadeddata = () => {
        canvas.width = video.width;
        canvas.height = video.height;
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
        this.detectFaces(video, canvas);
      };
      // const canvas = document.createElement("canvas");
      // // 리사이즈된 이미지 크기 설정
      // const MAX_WIDTH = 320;  // 최대 가로 크기 (원하는 크기로 설정)
      // const MAX_HEIGHT = 240; // 최대 세로 크기 (원하는 크기로 설정)

      // // 원본 비디오 크기 비율을 유지하며 리사이즈
      // const scale = Math.min(MAX_WIDTH / video.videoWidth, MAX_HEIGHT / video.videoHeight);
      // const width = video.videoWidth * scale;
      // const height = video.videoHeight * scale;

      // canvas.width = width;
      // canvas.height = height;

      // const context = canvas.getContext("2d");
      // context.drawImage(video, 0, 0, width, height);

      // const imageData = canvas.toDataURL("image/png");

      // try {
      //   const detections2 = await faceapi.tinyFaceDetector(imageData, {
      //     scoreThreshold:0.5
      //   })
      //   console.log(detections2)
      //   // const response = await fetch("/api/api/analyze-expression", {
      //   //   method: "POST",
      //   //   headers: { "Content-Type": "application/json" },
      //   //   body: JSON.stringify({ imageData }),
      //   // });

      //   // if (!response.ok) {
      //   //   throw new Error(`HTTP error! status: ${response.status}`);
      //   // }

      //   // const data = await response.json();
      //   // this.expression = data.expression || "분석 실패";

      // } catch (error) {
      //   console.error("표정 분석 실패:", error);
      //   this.expression = "표정 분석 실패: 서버 문제 또는 네트워크 오류";
      // } finally {
      //   this.loading = false;
      //   if (this.analyzing) {
      //     // 분석 중이라면 1초 후 재귀 호출
      //     setTimeout(() => this.captureImage(), 1000);
      //   }
      // }
    },
    // 얼굴 감지를 실시간으로 수행하는 함수
    async detectFaces(video, canvas) {
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();
        console.log(detections)
        // 얼굴 감지 결과를 캔버스에 그립니다.
        var context = canvas.getContext("2d")
        canvas?.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        const resizedDetections = faceapi.resizeResults(detections, {
          width: video.width,
          height: video.height,
        });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        // 표정 데이터를 텍스트로 표시
        resizedDetections.forEach(detection => {
          const { expressions, detection: faceBox } = detection;

          // 가장 확률이 높은 표정을 선택
          const sortedExpressions = Object.entries(expressions).sort(([, a], [, b]) => b - a);
          const [mostLikelyExpression, confidence] = sortedExpressions[0];

          // 얼굴 박스의 좌표 가져오기
          const box = faceBox.box;
          const x = box.x;
          const y = box.y - 10; // 얼굴 위에 텍스트를 표시하기 위해 y축 조정

          // 텍스트 스타일 설정 및 출력
          context.font = '16px Arial';
          context.fillStyle = 'red';
          context.fillText(`${mostLikelyExpression} (${(confidence * 100).toFixed(1)}%)`, x, y);
        });
      }, 100);
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
  border-top: 5px solid rgb(186, 220, 107);
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
  background-color: rgb(186, 220, 107);
  color: #fff;
}

button:focus {
  outline: none;
}
</style>
