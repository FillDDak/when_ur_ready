var express = require('express');
var router = express.Router();
var axios = require('axios'); // Axios 추가
var path = require("path");
var multer = require('multer')

// 파일 경로 설정
const groupStaticPath = path.join(__dirname, 'groupStatic');
const groupUploadFolder = path.join(groupStaticPath, 'groupUpload');

// 파일 업로드 설정
const groupUpload = multer({ dest: groupUploadFolder });

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "groupUpload/"); // 파일 업로드 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // 고유 파일명 생성
  },
});


router.post("/study/create", async function (req, res) {
  try {
    var group = req.body;
    var createdGroup = await sequelize.models.group.create(group);
    res.json(createdGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "스터디 그룹 생성 중 오류가 발생했습니다.", error });
  }
});

router.get("/study/find", async function (req, res) {
  try {
    const studyGroups = await sequelize.models.group.findAll(); // 모든 그룹 가져오기
    res.json(studyGroups);
  } catch (error) {
    console.error("Error fetching study groups:", error);
    res.status(500).json({ message: "스터디 그룹 목록을 불러오는 중 오류가 발생했습니다.", error });
  }
});

router.post("/job/create", async function (req, res) {
  try {
    var group = req.body;
    var createdGroup = await sequelize.models.group.create(group);
    res.json(createdGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "스터디 그룹 생성 중 오류가 발생했습니다.", error });
  }
});

module.exports = router;
