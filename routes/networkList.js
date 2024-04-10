const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // ファイル存在チェック（なければlist呼び出し）
  res.render('networkList', { title: "RPC/WSS List", msg: "リスト取得中のため、しばらくお待ちください。" });
});

module.exports = router;
