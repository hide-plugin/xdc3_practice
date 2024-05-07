const express = require('express');
const Xdc3 = require('xdc3');
const fs = require('fs');
const i_path = "./public/data/networkList.json";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.render('networkStatus', { title: "RPC/WSS Status" });
  } catch(err) {
    next(err);
  }
});

/** 
 * ネットワーク状態取得API。
 * 入力ファイルを元にRPC/WSSのデータ格納用オブジェクトを生成する。
 * @param {string} timeout  処理待ち時間
*/
router.get('/getStatus', async function(req, res, next) {
  try {
    if(!fs.existsSync(i_path)){
      throw TypeError("ERROR: RPC/WCCが記載されたjsonファイルが見つかりません。("+i_path+")");
    }
    const bufferData = fs.readFileSync(i_path);
    const dataJSON = bufferData.toString();
    const inData = JSON.parse(dataJSON)
    let outData = new Object();
  
    for (const network in inData) {
      // 入力ファイルのNETWORK数（MAINNET/APOTHEM）ループ
      outData[network] = new Object();

      for(const type in inData[network]) {
        // TYPE数（RPC/WSS）だけループ
        outData[network][type] = new Array();

        for(let cnt in inData[network][type]){
          // 初期化＋データ関数呼び出し
          outData[network][type][cnt] = {url: inData[network][type][cnt]["url"]};
          outData[network][type][cnt].cid = "未取得";
          outData[network][type][cnt].ver = "未取得";
          outData[network][type][cnt].blc = "未取得";
          outData[network][type][cnt].gas = "未取得";
          outData[network][type][cnt].pfx = "未取得";
          outData[network][type][cnt].sts = "タイムアウト";
          getInfo(type, outData[network][type][cnt]);
        }
      }
    }
    // 非同期処理を画面で指定した秒数だけ待機
    await new Promise((resolve) => setTimeout(resolve, req.query.timeout*1000));
    res.json(outData);
  } catch(err) {
    console.log(err);
    next(err);
  }
});

/** 
 * 引数に指定した接続先の各種情報を取得する
 * @param {string} type 処理対象（RPC/WSS）
 * @param {number} data 処理結果の格納領域
*/
async function getInfo(type, data){
  try {
    let xdc3 = new Xdc3(data.url);
    if(type == "RPC"){
      // RPC系の場合
      data.ver = await xdc3.eth.getNodeInfo();
      data.blc = await xdc3.eth.getBlockNumber();
      data.gas = await xdc3.eth.getGasPrice() / 1e9;
      if(await xdc3.utils.isHexStrict(await xdc3.eth.getCoinbase())){
        data.pfx = "0x";
      }else{
        data.pfx = "XDC";
      }
      data.cid = await xdc3.eth.getChainId();
    }else if(type == "WSS"){
      // WSS系の場合
      data.blc = "-";
      data.gas = "-";
      data.pfx = "-";
      data.ver = await xdc3.eth.getNodeInfo();
      data.cid = await xdc3.eth.getChainId();
    }else{
      console.log("ERROR: 処理対象外の場合は無視("+type+")");
    }
    data.sts = "正常";
  } catch(err) {
    data.sts = "接続エラー";
    console.log("接続エラー（"+data.url+"）");
  }
}

module.exports = router;
