const Xdc3 = require("xdc3");

const rpc_targets = [
  ["https://erpc.apothem.network","apothem"],
  ["https://earpc.apothem.network","apothem"],
  ["https://erpc.xinfin.network","mainnet"],
  ["https://earpc.xinfin.network","mainnet"]
];

const ws_targets = [
  ["wss://ws.apothem.network/ws","apothem"],
  ["wss://ws.xinfin.network","mainnet"],
  ["wss://ews.xinfin.network","mainnet"],
  ["wss://aws.xinfin.network","mainnet"],
  ["wss://eaws.xinfin.network","mainnet"]
];

const plitoken = {
    "mainnet": "0xFf7412Ea7C8445C46a8254dFB557Ac1E48094391",
    "apothem": "0x33f4212b027E22aF7e6BA21Fc572843C0D701CD1"
  };
  





var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('rpcCheck', { title: 'Express' });
});

module.exports = router;
