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

// 데이터 저장소 (임시로 메모리에 저장)
let studyGroups = [];
let jobPosts = [];

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
  var group = req.body
  var createdGroup = await sequelize.models.group.create(group)
  res.json(createdGroup)

})

// API Routes
// 1. 스터디 그룹 목록 조회
router.get("/study-groups", (req, res) => {
  res.json(studyGroups);
});

// 2. 채용 공고 목록 조회
router.get("/job-posts", (req, res) => {
  res.json(jobPosts);
});

// 3. 스터디 그룹 생성
router.post("/study-groups", groupUpload.single("photo"), (req, res) => {
  const { title, language, capacity, description, methodology } = req.body;
  const photo = req.file ? `/groupUpload/${req.file.filename}` : null;

  const newGroup = {
    id: Date.now(),
    title,
    language,
    capacity: parseInt(capacity, 10),
    description,
    methodology,
    photo,
    members: 0,
  };

  studyGroups.push(newGroup);

  res.json({
    message: "스터디 그룹이 성공적으로 생성되었습니다!",
    group: newGroup,
  });
});

// 4. 채용 공고 생성
router.post("/job-posts", groupUpload.single("photo"), (req, res) => {
  const { title, language, capacity, description, salary } = req.body;
  const photo = req.file ? `/groupUpload/${req.file.filename}` : null;

  const newJobPost = {
    id: Date.now(),
    title,
    language,
    capacity: parseInt(capacity, 10),
    description,
    salary: parseInt(salary, 10),
    photo,
  };

  jobPosts.push(newJobPost);

  res.json({
    message: "채용 공고가 성공적으로 생성되었습니다!",
    jobPost: newJobPost,
  });
});

module.exports = router;
