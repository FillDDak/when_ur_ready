var express = require('express');
var router = express.Router();
var OpenAI = require("openai")
var openai = new OpenAI();

var fs = require("fs");
var path = require("path");
var uuid = require("uuid");
var multer = require("multer");
var tesseract = require('tesseract.js');
var pdfParse = require("pdf-parse");
var mammoth = require("mammoth");
var hwp = require("hwp.js");

var staticPath = path.join(__dirname, "../static");
var uploadFolder = path.join(__dirname, "../static/upload");
var upload = multer({ dest: uploadFolder });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/check", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }

  // MIME 타입과 파일 경로 정의
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    let text = "";

    if (mimeType === "application/pdf") {
      // PDF 파일 텍스트 추출
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;

    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // DOCX 파일 텍스트 추출
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;

    } else if (mimeType === "application/haansofthwp" || mimeType === "application/x-hwp") {
      // HWP 파일 텍스트 추출
      const dataBuffer = fs.readFileSync(filePath);
      const result = hwp.extract(dataBuffer);
      text = result;

    } else {
      throw new Error("지원하지 않는 파일 형식입니다.");
    }

    // 추출된 텍스트 응답으로 반환
    res.json({ extractedText: text });
    console.log(text)

  } catch (error) {
    console.error("OCR 또는 OpenAI 처리 중 오류 발생", error);
    res.status(500).json({ error: "파일 처리 중 오류가 발생했습니다." });

  } finally {
    // 업로드된 임시 파일 삭제
    fs.unlinkSync(filePath);
  }
});

module.exports = router;
