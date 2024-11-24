var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS 미들웨어 추가
var puppeteer = require('puppeteer'); // Puppeteer 추가
var axios = require('axios'); // Axios 추가
var OpenAI = require("openai");
const openai = new OpenAI();

// CORS 미들웨어 사용
router.use(cors()); // 모든 요청에 CORS 허용

// GET home page
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
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
      model: "gpt-4o-mini",
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
