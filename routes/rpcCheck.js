const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('rpcCheck', { title: "xxxxx" });
});

module.exports = router;
