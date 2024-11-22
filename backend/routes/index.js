require('dotenv').config(); // 환경변수 사용
const express = require('express');
const OpenAI = require("openai");
const cors = require('cors');  // CORS 설정 추가
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const hwp = require("hwp.js");

const app = express();
const router = express.Router();
const staticPath = path.join(__dirname, "../static");
const uploadFolder = path.join(__dirname, "../static/upload");
const upload = multer({ dest: uploadFolder });

// OpenAI API 키 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// OpenAI API 객체 생성
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,  // OpenAI API Key를 환경변수로 설정
});

// JSON 요청을 처리할 수 있도록 설정
app.use(express.json());

// CORS를 활성화하여 다른 도메인에서의 요청을 허용
app.use(cors());  // 모든 도메인에서 오는 요청을 허용

// 요청 로그 추가
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// GET home page
router.get('/', function (req, res) {
  res.send('Express 서버가 실행 중입니다.');
});

// URL 키워드 추출 및 질문 생성 API 엔드포인트
app.post("/generate-questions", async (req, res) => {
  console.log("요청을 받았습니다.");
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL이 제공되지 않았습니다." });
  }

  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",  // 사용할 모델
      prompt: `Extract key interview topics and create sample questions for an interview preparation related to the company at this URL: ${url}`,
      max_tokens: 150,
      temperature: 0.7,
    });

    console.log("OpenAI 응답:", response);  // 응답 로그 확인
    const keywordsAndQuestions = response.choices[0].text.trim().split('\n');
    
    const keywords = keywordsAndQuestions.slice(0, 2);  // 키워드
    const questions = keywordsAndQuestions.slice(2);    // 질문들

    res.json({ keywords, questions });

  } catch (error) {
    console.error("OpenAI API 요청 중 오류 발생", error);
    res.status(500).json({ error: "키워드 및 질문 생성 중 오류가 발생했습니다." });
  }
});

// 파일 텍스트 추출 API
router.post("/check", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    // URL을 기반으로 텍스트 추출 및 AI 분석
    const aiResponse = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: `이 URL을 분석하여 면접 관련 핵심 키워드를 뽑아 주세요: ${url}`,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;

    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;

    } else if (mimeType === "application/haansofthwp" || mimeType === "application/x-hwp") {
      const dataBuffer = fs.readFileSync(filePath);
      const result = hwp.extract(dataBuffer);
      text = result;

    } else {
      throw new Error("지원하지 않는 파일 형식입니다.");
    }

    res.json({ extractedText: text });
    console.log(text);

  } catch (error) {
    console.error("OCR 또는 OpenAI 처리 중 오류 발생", error);
    res.status(500).json({ error: "파일 처리 중 오류가 발생했습니다." });

  } finally {
    fs.unlinkSync(filePath);
  }
});

// 라우터를 /generate-questions 경로에만 등록
app.use('/', router);  // /generate-questions 경로로 요청이 들어오면 이 라우터가 처리합니다.

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

