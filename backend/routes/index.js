var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS 미들웨어 추가
var axios = require('axios'); // Axios 추가

// CORS 미들웨어 사용
router.use(cors());  // 모든 요청에 CORS 허용

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
    // URL을 기반으로 텍스트 추출 및 AI 분석
    const aiResponse = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: `이 URL을 분석하여 면접 관련 핵심 키워드를 뽑아 주세요: ${url}`,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const keywords = aiResponse.data.choices[0].text.trim();

    // 분석된 키워드를 응답으로 반환
    res.json({ keywords: keywords });
    console.log('Keywords:', keywords);

  } catch (error) {
    console.error("AI 분석 중 오류 발생", error);
    res.status(500).json({ error: "AI 분석 중 오류가 발생했습니다." });
  }
});

module.exports = router;