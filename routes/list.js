const express = require('express');
const fs = require('fs');
const path = "./public/data/rpclist.json";
const Xdc3 = require('xdc3');

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let data;

  if(fs.existsSync(path)){
    // jsonファイルをオブジェクトに変換
    const bufferData = fs.readFileSync(path);
    const dataJSON = bufferData.toString();
    data = JSON.parse(dataJSON)

    // オブジェクトからRPC/WSSの配列を取得
    for (const item in data) {
      // 配列から各種データを取得（URL/ENV）
      for(const subItem in data[item]) {
        await getInfo(item, data[item][subItem]);
      }
    }
  }else{
    console.log( "ERROR: file does not exist.("+path+")");
  }
  console.log(data);
  res.json(data);
});

async function getInfo(item, subItem){
  if(item == "RPC" || item == "RPC_TEST"){
    // RPC系の場合
    console.log("[RPC] ルート");
    let xdc3 = new Xdc3(subItem["URL"]);
    subItem.ver = await xdc3.eth.getNodeInfo();
  }else if(item == "WSS" || item == "WSS_TEST"){
    // WSS系の場合
    console.log("[WSS] ルート");
    let xdc3 = new Xdc3(subItem["URL"]);
    console.log(subItem["URL"]);
    subItem.ver = await xdc3.eth.getNodeInfo();
  }else{
    console.log("ERROR: 対象外は無視("+item+")");
  }
}

module.exports = router;
