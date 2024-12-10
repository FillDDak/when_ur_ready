var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/join", async function (req, res) {
  var checkUser = await sequelize.models.user.findOne({
    where: {
      id: req.body.id
    }
  });
  if (checkUser) {
    res.json({
      result: "fail",
      field: "id",
      message: "이미 가입된 아이디입니다."
    });
    return;
  }
  var checkEmail = await sequelize.models.user.findOne({
    where: {
      email: req.body.email
    }
  });
  if (checkEmail) {
    res.json({
      result: "fail",
      field: "email",
      message: "이미 가입된 이메일입니다."
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

router.post("/change-password", async function (req, res) {
  const { id, currentPassword, newPassword } = req.body;

  const user = await sequelize.models.user.findOne({
    where: {
      id: id
    }
  });

  if (!user) {
    return res.json({
      result: "fail",
      message: "사용자를 찾을 수 없습니다."
    });
  }

  if (user.password !== currentPassword) {
    return res.json({
      result: "fail",
      message: "현재 비밀번호가 올바르지 않습니다."
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    result: "success"
  });
});

router.post("/delete", async function (req, res) {
  const { id } = req.body;

  const user = await sequelize.models.user.findOne({
    where: {
      id: id
    }
  });

  if (!user) {
    return res.json({
      result: "fail",
      message: "사용자를 찾을 수 없습니다."
    });
  }

  await sequelize.models.user.destroy({
    where: {
      id: id
    }
  });

  req.session.destroy();

  res.json({
    result: "success"
  });
});

module.exports = router;