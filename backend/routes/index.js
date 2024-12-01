var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS 미들웨어 추가
var puppeteer = require('puppeteer'); // Puppeteer 추가
var axios = require('axios'); // Axios 추가
var OpenAI = require("openai");
const openai = new OpenAI();

var fs = require("fs");
var path = require("path");
var uuid = require("uuid");
var multer = require("multer");
var tesseract = require('tesseract.js');
var pdfParse = require("pdf-parse");
var mammoth = require("mammoth");

const faceapi = require('face-api.js');
const canvas = require('canvas');
const bodyParser = require("body-parser");

var staticPath = path.join(__dirname, "../static");
var uploadFolder = path.join(__dirname, "../static/upload");
var upload = multer({ dest: uploadFolder });

// face-api.js 환경설정
faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });

// 파일 경로 설정
const groupStaticPath = path.join(__dirname, 'groupStatic');
const groupUploadFolder = path.join(groupStaticPath, 'groupUpload');

// 디렉토리 생성
if (!fs.existsSync(groupUploadFolder)) {
  fs.mkdirSync(groupUploadFolder, { recursive: true }); // 중간 디렉토리도 생성
}

// 파일 업로드 설정
const groupUpload = multer({ dest: groupUploadFolder });

// 모델 로드 함수
let modelsLoaded = false;  // 모델이 로드되었는지 확인하는 변수

async function loadModels() {
  if (modelsLoaded) return;  // 이미 모델이 로드되었다면 다시 로드하지 않음
  const MODEL_URL = path.join(__dirname, '..', 'models');  // 모델 경로를 backend/models로 설정
  await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL);
  modelsLoaded = true;
  console.log("모델이 성공적으로 로드되었습니다.");
}

// 모델 로드
loadModels();

// 표정 분석 API
router.post('/analyze-expression', async (req, res) => {
  try {
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: "이미지가 제공되지 않았습니다." });
    }

    // 이미지 데이터를 base64로 디코딩하여 Canvas로 생성
    const img = new canvas.Image();
    img.src = Buffer.from(imageData.split(",")[1], 'base64');

    // 얼굴과 표정 분석
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const dominantExpression = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );
      res.json({ result: `감지된 표정: ${dominantExpression}` });
    } else {
      res.json({ result: "감지된 표정: 없음" });
    }
  } catch (error) {
    console.error("표정 분석 중 오류 발생:", error);
    res.status(500).json({ error: "표정 분석 중 오류가 발생했습니다." });
  }
});

// CORS 미들웨어 사용
router.use(cors()); // 모든 요청에 CORS 허용

// GET home page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/check", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  let extractedText = "";

  try {
    // 텍스트 추출
    if (mimeType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;

    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;

    } else {
      throw new Error("지원하지 않는 파일 형식입니다.");
    }

    // 사용자에게 추출된 텍스트 반환
    res.json({ originalText: extractedText });

  } catch (error) {
    console.error("텍스트 추출 중 오류 발생:", error);
    res.status(500).json({ error: "텍스트 추출 중 오류가 발생했습니다." });
  } finally {
    fs.unlinkSync(filePath); // 업로드된 파일 삭제
  }
});

// 분석 작업 엔드포인트
router.get("/analyze", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "분석할 텍스트가 제공되지 않았습니다." });
  }

  try {
    // OpenAI API를 사용하여 텍스트 분석
    const prompt = `
      다음 텍스트를 분석하여 아래 항목에 맞는 내용이 있는지 확인하고 있다면 변환 없이 그대로 가져와주며 없다면 따로 표시해줘.:
      - 내 성향
      - 내 역량
      - 내 장/단점
      - 내 역할

      응답 형식은 JSON이어야 함.:
      {
        "propensity": "string",
        "propensityPresence": "✅내 성향에 대해 작성되어 있음. or ❌작성되어 있지 않음.",
        "capabilities": "string",
        "capabilitiesPresence": "✅내 역량에 대해 작성되어 있음. or ❌작성되어 있지 않음.",
        "prosAndCons": "string",
        "prosAndConsPresence": "✅내 장/단점에 대해 작성되어 있음. or ❌작성되어 있지 않음.",
        "role": "string",
        "rolePresence": "✅내 역할에 대해 작성되어 있음. or ❌작성되어 있지 않음.",
      }
      텍스트: ${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const analysisResult = JSON.parse(response.choices[0].message.content);

    res.json(analysisResult);
  } catch (error) {
    console.error("텍스트 분석 중 오류 발생:", error);
    res.status(500).json({ error: "텍스트 분석 중 오류가 발생했습니다." });
  }
});

// URL을 받아 키워드 추출
router.post("/extract-keywords", express.json(), async (req, res) => {
  const url = req.body.url; // 클라이언트에서 URL을 json 형태로 받음

  if (!url) {
    return res.status(400).json({ error: "URL이 제공되지 않았습니다." });
  }

  try {
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
      model: "gpt-4",
      messages: [
        { "role": "user", "content": `다음 문장에서 핵심 키워드를 단어 형식으로 5가지만 추출해 주세요. 문장이 아닌 단어만 나열해주세요:\n${pageText}` }
      ]
    });

    const keywords = completion.choices[0].message;

    // 분석된 키워드를 응답으로 반환
    res.json({ keywords: keywords });
    console.log('Keywords:', keywords);

  } catch (error) {
    console.error("AI 분석 중 오류 발생", error);
    res.status(500).json({ error: "AI 분석 중 오류가 발생했습니다." });
  }
});

// 예상 질문 생성 및 회사 관련 질문 생성 API
router.post("/generate-questions", express.json(), async (req, res) => {
  const { keywords, type } = req.body; // type을 추가로 받음

  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).json({ error: "키워드 배열이 제공되지 않았습니다." });
  }

  try {
    // type이 'company'일 경우, 회사 관련 질문을 생성하고, 아니면 예상 질문을 생성
    let prompt = "";

    if (type === "company") {
      prompt = `
        다음 키워드를 기반으로 회사 관련 질문 5개를 생성해주세요.
        각 질문은 해당 회사에서 자주 물어볼 법한 질문이어야 하며, 다음과 같은 질문 유형을 포함해야 합니다:
        1. 회사와 관련된 경험을 묻는 질문
        2. 기업 문화와 적합성에 대한 질문
        3. 직무와 관련된 전문성에 대한 질문

        키워드: ${keywords.join(", ")}
      `;
    } else {
      prompt = `
        다음 키워드를 기반으로 각각 2개의 질문씩, 총 10개의 면접 질문을 생성해주세요. 
        질문은 아래와 같은 유형 중 하나를 포함해야 합니다:
        1. 개방형 질문
        2. 심화 질문
        3. 가정 기반 질문
        4. 경험 기반 질문
        5. 행동 기반 질문

        키워드: ${keywords.join(", ")}

        질문은 각 키워드에 대해 개별적으로 생성하고, 중복되지 않도록 해주세요. 가능한 한 창의적이고 실무적인 질문을 만들어 주세요.
      `;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // 질문 처리
    const questions = completion.choices[0].message.content
      .split("\n")
      .filter((question, index, self) => question.trim() !== "" && self.indexOf(question) === index);

    res.json({ questions });
  } catch (error) {
    console.error("예상 질문 생성 중 오류 발생", error);
    res.status(500).json({ error: "예상 질문 생성 중 오류가 발생했습니다." });
  }
});

// 답변 분석 요청 API
router.post("/analyze-answer", express.json(), async (req, res) => {
  const { answer } = req.body; // 클라이언트에서 답변을 json 형태로 받음

  if (!answer) {
    return res.status(400).json({ error: "답변이 제공되지 않았습니다." });
  }

  try {
    // AI를 이용해 답변에 대한 피드백 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // 적절한 모델을 사용
      messages: [
        {
          role: "user",
          content: `답변에 대한 피드백을 간결하고 직관적으로 작성해주세요. 단락별로 구분지어줬으면 좋겠습니다. 피드백은 다음과 같은 방식으로 제공되어야 합니다:

각 피드백 항목은 짧고 간결하게 작성되어야 하며, 핵심적인 내용만 포함됩니다.
피드백을 단락으로 나누고 각 단락은 명확한 제목을 통해 구분합니다.
긍정적인 피드백은 강조하고, 개선이 필요한 부분은 구체적으로 언급하되 간단하고 직설적입니다.
피드백은 사용자가 직접 실행할 수 있는 구체적인 제안을 포함합니다.
가능하면 각 피드백 항목은 예시나 추천 행동으로 구체화하여 실용적이고, 적극적인 개선 방향을 제시합니다.
\n${answer}`
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
