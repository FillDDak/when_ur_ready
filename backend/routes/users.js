var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/join", async function (req, res) {
  if (!req.body.id || !req.body.password || !req.body.name || !req.body.birthDate || !req.body.email || !req.body.phoneNumber) {
    console.log({
      result: "fail",
      message: "입력란을 모두 입력해주세요."
    });
    res.json({
      result: "fail",
      message: "입력란을 모두 입력해주세요."
    });
    return;
  }
  if (req.body.isOver15 === false || req.body.termsAgreement === false || req.body.privacyAgreement === false) {
    console.log({
      result: "fail",
      message: "필수 체크란을 모두 체크해주세요."
    });
    res.json({
      result: "fail",
      message: "필수 체크란을 모두 체크해주세요."
    });
    return;
  }

  var checkUser = await sequelize.models.user.findOne({
    where: {
      id: req.body.id
    }
  });
  if (checkUser) {
    console.log({
      result: "fail",
      message: "이미 가입된 아이디입니다."
    });
    res.json({
      result: "fail",
      message: "이미 가입된 아이디입니다."
    });
    return;
  }
  await sequelize.models.user.create(req.body);
  res.json({
    result: "success"
  });
});

router.post("/login", async function (req, res) {
  if (!req.body.id) {
    res.json({
      result: "fail",
      field: "id",
      message: "아이디를 입력해주세요."
    });
    return;
  }

  if (!req.body.password) {
    res.json({
      result: "fail",
      field: "password",
      message: "비밀번호를 입력해주세요."
    });
    return;
  }

  var checkUser = await sequelize.models.user.findOne({
    where: {
      id: req.body.id
    }
  });
  if (!checkUser) {
    res.json({
      result: "fail",
      field: "id",
      message: "존재하지 않는 아이디입니다."
    });
    return;
  }
  if (checkUser.password !== req.body.password) {
    res.json({
      result: "fail",
      field: "password",
      message: "비밀번호가 틀렸습니다."
    });
    return;
  }
  req.session.user = checkUser;

  res.json({
    result: "success",
    user: checkUser
  });
});

router.post("/info", async function (req, res) {
  if (req.session.user) {
    res.json({
      result: "success",
      user: req.session.user
    });
  } else {
    res.json({
      result: "fail"
    });
  }
});

router.post("/logout", async function (req, res) {
  req.session.destroy();
  res.json({
    result: "success"
  });
});

module.exports = router;