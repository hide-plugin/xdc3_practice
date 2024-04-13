const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.render('index', { title: 'Xdc' });
  } catch(err) {
    next(err);
  }
});
  
module.exports = router;
