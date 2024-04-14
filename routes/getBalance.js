const express = require('express');
const fs = require('fs');
const i_path = "./public/data/search.json";
const o_path = "./public/data/result.json";
const Xdc3 = require('xdc3');

const router = express.Router();

let tokenAddress = "xdcff7412ea7c8445c46a8254dfb557ac1e48094391";
let walletAddress = "xdccc228dbc81420f18d79f490adc3d1c12300cdbea";

async function getInfo() {
    console.log("-- [Start] createList()");
    let xdc3 = new Xdc3("wss://ews.xinfin.networkhttps://erpc.xinfin.network");
//    let xdc3 = new Xdc3(new xdc3.providers.HttpProvider("https://erpc.xinfin.network"));

    console.log(await xdc3.eth.getBlockNumber());
    // XRC20 トークンの残高を取得するための最小限のABI
 let minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];
 //  ABI とコントラクト（ERC20トークン）のアドレスから、コントラクトのインスタンスを取得 
 let contract = await xdc3.eth.contract(minABI).at(tokenAddress);
 
 // 引数にウォレットのアドレスを渡して、balanceOf 関数を呼ぶ
 contract.balanceOf(walletAddress, (error, balance) => {
   // ERC20トークンの decimals を取得
   contract.decimals((error, decimals) => {
     // 残高を計算
     balance = balance.div(10**decimals);
     console.log(balance.toString());
   });
 });
}


router.get('/', async function(req, res, next) {
  try {
    getInfo();
} catch(err) {
    console.log("例外処理");
    next(err);
  }
});

module.exports = router;
