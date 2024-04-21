const express = require('express');
const fs = require('fs');
const i_path = "./public/data/search.json";
const o_path = "./public/data/result.json";
const Xdc3 = require('xdc3');

const router = express.Router();

async function getInfo(type, data){
  console.log("例外処理");
}

async function getInfo2(type, data){
    try {
        return new Promise((resolve) => {
            // あえてタイムアウト時間より長い処理にする
            console.log("333");

            setTimeout(() => {
              resolve("ok");
            }, 5000);
          });
    }
    catch{
        console.log("error");
    }
}
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

async function myFunction() {
    // 長時間かかる処理
    await getInfo2(); // 例: 非同期の関数やPromiseを待機する
  
    // タイムアウトまでの待機時間
    const timeout = 3000; // 3秒 (ミリ秒単位)
    console.log("111");
  
    // タイムアウトの制御用Promiseを作成
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout')); // タイムアウトエラーを投げる
      }, timeout);
    });
  
    try {
        console.log("222");
        // オリジナルのawait処理とタイムアウト処理をPromise.raceで競争させる
      await Promise.race([getInfo2(), timeoutPromise]);
      
      // タイムアウトしなかった場合の後続処理
      console.log('Operation completed successfully');
    } catch (error) {
      // タイムアウトした場合の処理
      console.error('Operation timed out:', error.message);
      // ここで必要に応じてタイムアウト時の追加の処理を記述できます
    }
}

let dataAry = [];

async function bbbbb(i){
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const xxx = { cid: i, age: "33"}
  dataAry.push(xxx);
  console.log("引数=" + i);
}

async function aaaaa(){
//  setTimeout(callback, 1000)
console.log('Start - hoge')

  for(i=0; i<3; i++){
    bbbbb(i);
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("配列の長さ=" + dataAry.length);
  console.log("配列の値=" + dataAry[0] + dataAry[1] + dataAry[2]);
  console.log('End - hoge')
  console.log(dataAry);
}


router.get('/', async function(req, res, next) {
  try {
    console.log("-- [Start] testCode()");
    let data;

    // myFunctionを呼び出し
    aaaaa();

    console.log("-- [End] testCode()");
  
    res.json(data);
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
});

module.exports = router;
