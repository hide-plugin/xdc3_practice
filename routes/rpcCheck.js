var express = require('express');

const Web3 = require('xdc3');
let web3 = new Web3('ws://localhost:8546');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('rpcCheck', { title: 'Express' });
});

module.exports = router;
