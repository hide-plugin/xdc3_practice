const express = require('express');
const fs = require('fs');
const i_path = "./public/data/search.json";
const o_path = "./public/data/result.json";
const Xdc3 = require('xdc3');

const router = express.Router();

async function getInfo(type, data){
  try {
    for(let cnt in data){
      let startTime = Date.now(); // 開始時間
      console.log("    [Url] " + data[cnt]["url"] + " 情報取得中");
      if(type == "RPC"){
        // RPC系の場合
        let xdc3 = new Xdc3(data[cnt]["url"]);
        data[cnt].cid = await xdc3.eth.getChainId();
        data[cnt].ver = await xdc3.eth.getNodeInfo();
        data[cnt].blc = await xdc3.eth.getBlockNumber();
        data[cnt].gas = await xdc3.eth.getGasPrice() * 0.000000001;
        if(await xdc3.utils.isHexStrict(await xdc3.eth.getCoinbase())){
          data[cnt].pfx = "0x";
        }else{
          data[cnt].pfx = "XDC";
        }
      }else if(type == "WSS"){
        // WSS系の場合
        let xdc3 = new Xdc3(data[cnt]["url"]);
        data[cnt].cid = await xdc3.eth.getChainId();
        data[cnt].ver = await xdc3.eth.getNodeInfo();
        data[cnt].blc = "-";
        data[cnt].gas = "-";
        data[cnt].pfx = "-";
      }else{
        console.log("ERROR: 対象外は無視("+cnt+")");
      }
      let endTime = Date.now(); // 終了時間
      data[cnt].ptm = ((endTime - startTime) * 0.001).toFixed(2);
    }
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
}

router.get('/', async function(req, res, next) {
  try {
    console.log("-- [Start] createList()");
    let data;

    if(fs.existsSync(i_path)){
      // jsonファイルをオブジェクトに変換
      const bufferData = fs.readFileSync(i_path);
      const dataJSON = bufferData.toString();
      data = JSON.parse(dataJSON)
  
      for (const network in data) {
        // JSONからMAINNET/APOTHEMのオブジェクトを取得
        console.log("[Network] " + network);
        for(const type in data[network]) {
          // オブジェクトからRPC/WSSのオブジェクトを取得
          console.log("  [Target] " + type);
          await getInfo(type, data[network][type]);
        }
      }
    }else{
      console.log("ERROR: 対象のRPC/WCCが記載されたjsonファイルが見つかりません。("+i_path+")");
      throw TypeError("ERROR: 対象のRPC/WCCが記載されたjsonファイルが見つかりません。("+i_path+")");
    }
  
    // 作成日付を格納
    const ymd = new Date().toLocaleDateString('sv-SE');
    const time = new Date().toLocaleTimeString('ja-JP', {hour12:false});
    data.DATE = ymd + " " + time;
  
    const resultJSON = JSON.stringify(data)
    fs.writeFileSync(o_path, resultJSON)
    console.log("-- [End] createList()");
  
    res.json(data);
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
});

module.exports = router;
