const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.render('networkStatus', { title: "RPC/WSS Status" });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
