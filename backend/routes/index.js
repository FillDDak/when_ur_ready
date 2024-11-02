var express = require('express');
var router = express.Router();
var OpenAI = require("openai")
var openai = new OpenAI();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
