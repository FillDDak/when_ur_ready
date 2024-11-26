var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS 미들웨어 추가
var puppeteer = require('puppeteer'); // Puppeteer 추가
var axios = require('axios'); // Axios 추가
var OpenAI =require("openai");
const openai = new OpenAI();

var fs = require("fs");
var path = require("path");
var uuid = require("uuid");
var multer = require("multer");
var tesseract = require('tesseract.js');
var pdfParse = require("pdf-parse");
var mammoth = require("mammoth");

var staticPath = path.join(__dirname, "../static");
var uploadFolder = path.join(__dirname, "../static/upload");
var upload = multer({ dest: uploadFolder });

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

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    // 페이지의 텍스트 추출
    const pageText = await page.evaluate(() => {
      return document.body.innerText; // 페이지의 텍스트를 가져옴
    });

    await browser.close();

    if (!pageText) {
      return res.status(500).json({ error: "URL에서 텍스트를 추출할 수 없습니다." });
    }

    // OpenAI API로 텍스트 분석
    // const aiResponse = await axios.post('https://api.openai.com/v1/completions', {
    //   model: 'text-davinci-003',
    //   prompt: `다음 텍스트를 분석하여 면접 관련 핵심 키워드를 뽑아 주세요:\n\n${pageText}`,
    //   max_tokens: 2000
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    //   }
    // })
    // .catch(err=>{
    //   console.log(err)
    //   return err.response
    // })
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          {"role": "user", "content":  `다음 텍스트를 분석하여 면접 관련 핵심 키워드를 뽑아 주세요:\n\n${pageText}`}
      ]
  });

    const keywords = completion.choices[0].message

    // 분석된 키워드를 응답으로 반환
    res.json({ keywords: keywords });
    console.log('Keywords:', keywords);

  } catch (error) {
    console.error("AI 분석 중 오류 발생", error);
    res.status(500).json({ error: "AI 분석 중 오류가 발생했습니다." });
  }
});

module.exports = router;
