const express = require('express');
const fs = require('fs');
const i_path = "./public/data/walletList.json";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.render('srxStatus', { title: "StorX-Node Status" });
  } catch(err) {
    next(err);
  }
});

/** 
 * 入力ファイルを元にWalletのデータ格納用オブジェクトを生成する。
*/
router.get('/getWallet', async function(req, res, next) {
  try {
    console.log("-- [Start] getWallet()");
    if(!fs.existsSync(i_path)){
      console.log("ERROR: Walletが記載されたjsonファイルが見つかりません。("+i_path+")");
      throw TypeError("ERROR: Walletが記載されたjsonファイルが見つかりません。("+i_path+")");
    }
    const bufferData = fs.readFileSync(i_path);
    const dataJSON = bufferData.toString();
    const inData = JSON.parse(dataJSON)
    let outData = new Array();

    for (let i=0; i<inData.length; i++) {
      // 入力ファイルのWallet数ループ
      outData[i] = {addr: inData[i].addr};
      outData[i].name = inData[i].name;
      outData[i].srxInfo = new Object();
      // SRX情報格納領域初期化
      outData[i]["srxInfo"] = {stakedTime: "-"};
      outData[i]["srxInfo"].stakedAmount = "-";
      outData[i]["srxInfo"].reputation = "-";
      outData[i]["srxInfo"].lastRedeemedAt = "-";
      outData[i]["srxInfo"].nextRedeemedAt = "-";
      outData[i]["srxInfo"].nextRedeemedTm = "-";
      outData[i]["srxInfo"].totalRedeemed = "-";
    }

    res.json(outData);
  } catch(err) {
    console.log("例外処理" + err);
    next(err);
  } finally {
    console.log("-- [End] getWallet()");
  }
});

module.exports = router;
