const express = require('express');
const fs = require('fs');
const i_path = "./public/data/searchList.json";
const o_path = "./public/data/resultList.json";
const Xdc3 = require('xdc3');

let router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
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
    console.log( "ERROR: file does not exist.("+i_path+")");
  }

  // 作成日付を格納
  const ymd = new Date().toLocaleDateString('sv-SE');
  const time = new Date().toLocaleTimeString('ja-JP', {hour12:false});
  data.DATE = ymd + " " + time;

  const resultJSON = JSON.stringify(data)
  fs.writeFileSync(o_path, resultJSON)
  console.log("-- [End] createList()");

  res.json(data);
});

async function getInfo(type, data){

  for(let cnt in data){
    console.log("    [Url] " + data[cnt]["url"]);
    if(type == "RPC"){
      // RPC系の場合
      let xdc3 = new Xdc3(data[cnt]["url"]);
      data[cnt].ver = await xdc3.eth.getNodeInfo();
      data[cnt].blc = await xdc3.eth.getBlockNumber();
      data[cnt].gas = await xdc3.eth.getGasPrice() * 0.000000001;
      if(await xdc3.utils.isHexStrict(await xdc3.eth.getCoinbase())){
        data[cnt].pfx = "対応";
      }else{
        data[cnt].pfx = "未対応";
      }
    }else if(type == "WSS"){
      // WSS系の場合
      let xdc3 = new Xdc3(data[cnt]["url"]);
      data[cnt].ver = await xdc3.eth.getNodeInfo();
      data[cnt].blc = "-";
      data[cnt].gas = "-";
      data[cnt].pfx = "-";
    }else{
      console.log("ERROR: 対象外は無視("+cnt+")");
    }
  }
}

module.exports = router;
