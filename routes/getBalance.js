const express = require('express');
const fs = require('fs');
const i_path = "./public/data/i_wallet.json";
const o_path = "./public/data/o_wallet.json";
const Xdc3 = require('xdc3');

const router = express.Router();

let tokenAddress = "xdcff7412ea7c8445c46a8254dfb557ac1e48094391";
let walletAddress = "xdca40525989aa9aec854312d69586060f40c4372e9";

async function getInfo() {
    console.log("-- [Start] createList()");
    let xdc3 = new Xdc3("https://erpc.xinfin.network");
      // i_walletの数だけループ
      xdcBalance = await xdc3.eth.getBalance(walletAddress);
      console.log(xdcBalance);
      console.log(await xdc3.utils.fromWei(xdcBalance, "ether"));
  //    acount = await xdc3.eth.getAccounts();
  //    console.log(acount);
    //    console.log(await xdc3.eth.getBlockNumber());
    // XRC20 トークンの残高を取得するための最小限のABI
}


router.get('/', async function(req, res, next) {
  try {
    console.log("-- [Start] getBalance()");
    let jsonAryNet = new Array();

    //    getInfo();
    res.render('getBalance', { title: "Wallet Balance" });
} catch(err) {
    console.log("例外処理");
    next(err);
  }
});

module.exports = router;
