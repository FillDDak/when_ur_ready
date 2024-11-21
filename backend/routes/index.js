var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS 미들웨어 추가
var puppeteer = require('puppeteer'); // Puppeteer 추가
var axios = require('axios'); // Axios 추가
var OpenAI =require("openai");
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
