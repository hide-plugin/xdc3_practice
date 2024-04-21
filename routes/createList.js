const express = require('express');
const fs = require('fs');
const i_path = "./public/data/search.json";
const o_path = "./public/data/result.json";
const Xdc3 = require('xdc3');

const router = express.Router();

/** 
 * 処理対象URLの各種情報を取得する
 * @param {string} url  処理対象のURL
 * @param {string} type 処理対象の種類（RPC/WSS）
 * @param {number} data 処理結果の格納領域
 */
async function getInfo(url, type, data){
  try {
    let xdc3 = new Xdc3(url);
    if(type == "RPC"){
      // RPC系の場合
      data.cid = await xdc3.eth.getChainId();
      data.ver = await xdc3.eth.getNodeInfo();
      data.blc = await xdc3.eth.getBlockNumber();
      data.gas = await xdc3.eth.getGasPrice() * 0.000000001;
      if(await xdc3.utils.isHexStrict(await xdc3.eth.getCoinbase())){
        data.pfx = "0x";
      }else{
        data.pfx = "XDC";
      }
    }else if(type == "WSS"){
      // WSS系の場合
      data.blc = "-";
      data.gas = "-";
      data.pfx = "-";
      data.cid = await xdc3.eth.getChainId();
      data.ver = await xdc3.eth.getNodeInfo();
    }else{
      console.log("ERROR: 処理対象外の場合は無視("+type+")");
    }
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
}

/** 
 * 処理結果格納領域を初期化する
 * @param {string} type    処理対象の種類（RPC/WSS）
 * @param {number} inData  入力ファイル（JSON）の情報格納領域
 * @param {string} typeAry 処理結果の格納領域
 */
async function preProc(type, typeAry, inData){
  try {
    for(let cnt in inData){
      typeAry[cnt] = {url: inData[cnt]["url"]};
      typeAry[cnt].cid = "未取得";
      typeAry[cnt].ver = "未取得";
      typeAry[cnt].blc = "未取得";
      typeAry[cnt].gas = "未取得";
      typeAry[cnt].pfx = "未取得";
      console.log("    [Url] " + typeAry[cnt].url + " 情報取得");
      getInfo(typeAry[cnt].url, type, typeAry[cnt]);
    }
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
}

router.get('/', async function(req, res, next) {
  try {
    console.log("-- [Start] createList()");
    let jsonAryNet = new Object();

    if(fs.existsSync(i_path)){
      // jsonファイルをオブジェクトに変換
      const bufferData = fs.readFileSync(i_path);
      const dataJSON = bufferData.toString();
      const inData = JSON.parse(dataJSON)
  
      for (const network in inData) {
        // 入力ファイルのNETWORK（MAINNET/APOTHEM）の数だけループ
        console.log("[Network] " + network);
        jsonAryNet[network] = new Object();
        for(const type in inData[network]) {
          // NETWORKごとのTYPE（RPC/WSS）の数だけループ
          console.log("  [Target] " + type);
          jsonAryNet[network][type] = new Array();

          // NETWORK-TYPEごとに各種情報を取得する
          preProc(type,jsonAryNet[network][type], inData[network][type]);
        }
      }
      // 非同期処理を下記の秒数待機
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }else{
      console.log("ERROR: 対象のRPC/WCCが記載されたjsonファイルが見つかりません。("+i_path+")");
      throw TypeError("ERROR: 対象のRPC/WCCが記載されたjsonファイルが見つかりません。("+i_path+")");
    }
    const resultJSON = JSON.stringify(jsonAryNet)
    fs.writeFileSync(o_path, resultJSON)
    console.log("-- [End] createList()");
    res.json(jsonAryNet);
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
});

module.exports = router;
