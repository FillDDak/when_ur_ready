<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS 미들웨어 추가
var puppeteer = require('puppeteer'); // Puppeteer 추가
var axios = require('axios'); // Axios 추가
var OpenAI = require("openai");
const openai = new OpenAI();

// CORS 미들웨어 사용
router.use(cors()); // 모든 요청에 CORS 허용
=======
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
>>>>>>> 2e50c0d346dc20c16ec5f71f64eb9eb0f784b4ee

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
<<<<<<< HEAD
    // Puppeteer로 URL의 텍스트 콘텐츠 추출
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); // 30초 타임아웃

    // 페이지의 텍스트 추출
    const pageText = await page.evaluate(() => {
      return document.body.innerText; // 페이지의 텍스트를 가져옴
    });

    await browser.close();

    if (!pageText) {
      return res.status(500).json({ error: "URL에서 텍스트를 추출할 수 없습니다." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { "role": "user", "content": `다음 문장에서 핵심 키워드를 단어 형식으로 5가지만 추출해 주세요. 문장이 아닌 단어만 나열해주세요:\n${pageText}` }
      ]
    });

    const keywords = completion.choices[0].message;
=======
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
>>>>>>> 2e50c0d346dc20c16ec5f71f64eb9eb0f784b4ee

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

<<<<<<< HEAD
// 예상 질문 생성 API (기존 코드와 연결)
router.post("/generate-questions", express.json(), async (req, res) => {
  const { keywords } = req.body; // 키워드를 클라이언트로부터 받음

  if (!keywords || keywords.length === 0) {
    return res.status(400).json({ error: "키워드가 제공되지 않았습니다." });
  }

  try {
    // 키워드를 기반으로 예상 질문 생성
    const prompt = keywords.map(keyword => `'${keyword}' 관련 질문을 준비하세요.`).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // 올바른 모델을 사용하세요.
      messages: [
        {
          role: "user", 
          content: `다음 키워드를 기반으로 예상 질문을 5개 생성해주세요:\n${prompt}`
        }
      ]
    });

    const questions = completion.choices[0].message.content.split("\n").filter(question => question.trim() !== '');

    // 생성된 예상 질문 반환
    res.json({ questions: questions });
    console.log('Generated Questions:', questions);

  } catch (error) {
    console.error("예상 질문 생성 중 오류 발생", error);
    res.status(500).json({ error: "예상 질문 생성 중 오류가 발생했습니다." });
  }
});

// 답변 분석 요청 API (추가된 부분)
router.post("/analyze-answer", express.json(), async (req, res) => {
  const { answer } = req.body; // 클라이언트에서 답변을 json 형태로 받음

  if (!answer) {
    return res.status(400).json({ error: "답변이 제공되지 않았습니다." });
  }

  try {
    // AI를 이용해 답변에 대한 피드백 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 적절한 모델을 사용
      messages: [
        {
          role: "user",
          content: `답변에 대한 피드백을 간결하고 직관적으로 작성해주세요.단락별로 구분지어줬으면 좋겠습니다 피드백은 다음과 같은 방식으로 제공되어야 합니다:

각 피드백 항목은 짧고 간결하게 작성되어야 하며, 핵심적인 내용만 포함됩니다.
피드백을 단락으로 나누고 각 단락은 명확한 제목을 통해 구분합니다.
긍정적인 피드백은 강조하고, 개선이 필요한 부분은 구체적으로 언급하되 간단하고 직설적입니다.
피드백은 사용자가 직접 실행할 수 있는 구체적인 제안을 포함합니다.
가능하면 각 피드백 항목은 예시나 추천 행동으로 구체화하여 실용적이고, 적극적인 개선 방향을 제시합니다."\n${answer}`
        }
      ]
    });

    const feedback = completion.choices[0].message.content;

    // 생성된 피드백 반환
    res.json({ feedback: feedback });
    console.log('AI Feedback:', feedback);

  } catch (error) {
    console.error("답변 분석 중 오류 발생", error);
    res.status(500).json({ error: "답변 분석 중 오류가 발생했습니다." });
  }
});

module.exports = router;
=======
// 라우터를 /generate-questions 경로에만 등록
app.use('/', router);  // /generate-questions 경로로 요청이 들어오면 이 라우터가 처리합니다.

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

>>>>>>> 2e50c0d346dc20c16ec5f71f64eb9eb0f784b4ee
