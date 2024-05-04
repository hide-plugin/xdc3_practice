const express = require('express');
const fs = require('fs');
const i_path = "./public/data/i_wallet.json";
const o_path = "./public/data/result/o_wallet.json";
const Xdc3 = require('xdc3');
const Contract = require('xdc3-eth-contract');
const router = express.Router();

/** 
 * 処理対象URLの各種情報を取得する
 * @param {string} url  処理対象のURL
 * @param {string} type 処理対象の種類（RPC/WSS）
 * @param {number} data 処理結果の格納領域
 */
async function getInfo(url, type, data){
  try {
    let startTime = Date.now(); // 開始時間
    let xdc3 = new Xdc3(url);
    if(type == "RPC"){
      // RPC系の場合
      data.ver = await xdc3.eth.getNodeInfo();
      data.blc = await xdc3.eth.getBlockNumber();
      data.gas = await xdc3.eth.getGasPrice() * 0.000000001;
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
    let endTime = Date.now(); // 終了時間
    data.ptm = ((endTime - startTime) * 0.001).toFixed(2);
  } catch(err) {
    data.sts = "接続エラー";
    console.log("■ 接続エラー（" + url + "）");
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
      typeAry[cnt].sts = "タイムアウト";
      console.log("    [Url] " + typeAry[cnt].url + " 情報取得");
      getInfo(typeAry[cnt].url, type, typeAry[cnt]);
    }
  } catch(err) {
    console.log("例外処理");
    next(err);
  }
}


// ウォレットの内部処理は同期をとる
// ウォレットごとは非同期で動かす

let tokenAddress = "xdc5d5f074837f5d4618b3916ba74de1bf9662a3fed";
let walletAddress = "xdca40525989aa9aec854312d69586060f40c4372e9";

let ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs:
      [
        {
          name: "",
          type: "uint8"
        }
      ],
    type: "function"
  }
];

let rpc = "https://erpc.xinfin.network";
let wss = "wss://aws.xinfin.network";

function sleep(waitMsec) {
  var startMsec = new Date();

  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

async function cryptInfo(symbol, tokenAddress, data, j){
  console.log("Wallet= "+data.smry+" /symbol=" + symbol);
  //  ABI とコントラクト（ERC20トークン）のアドレスから、コントラクトのインスタンスを取得 
  let xdc3 = new Xdc3(wss);
  let contract = new xdc3.eth.Contract(ABI, tokenAddress);
  let balance = await contract.methods.balanceOf(data.addr).call();
  balance = parseFloat(balance)
  let decimals = await contract.methods.decimals().call();
  decimals = parseFloat(decimals);
  balance = balance / 10 ** decimals
  console.log(balance.toString());
  data[symbol] = await balance.toString();
  console.log("Symbol= " + symbol + "/Address= " + tokenAddress + "balance= " + balance);
}


// 画面に表示する通貨リスト
let mainCryptList = 
[
  { symbol: "PLI",  address: "xdcff7412ea7c8445c46a8254dfb557ac1e48094391" },
  { symbol: "SRX",  address: "xdc5d5f074837f5d4618b3916ba74de1bf9662a3fed" },
  { symbol: "FXD",  address: "xdc49d3f7543335cf38Fa10889CCFF10207e22110B5" },
  { symbol: "FTHM", address: "xdc3279dBEfABF3C6ac29d7ff24A6c46645f3F4403c" },
  { symbol: "GBEX", address: "xdc34514748f86a8da01ef082306b6d6e738f777f5a" }
];

/** 
 * 各トークンの残高取得処理を呼び出す
 * @param {string} url  処理対象のURL
 * @param {string} type 処理対象の種類（RPC/WSS）
 * @param {number} data 処理結果の格納領域
 */
async function preProc(data){
  console.log("[DEBUG]-- [Start] getInfo3("+data.smry+")");

  console.log("[DEBUG] addr = " + data.addr);
  console.log("[DEBUG] smry = " + data.smry);

  // XDC残高取得-開始
  let xdc3 = new Xdc3(wss);
  let xdcBalance = await xdc3.eth.getBalance(data.addr);
  data.xdc = await xdc3.utils.fromWei(xdcBalance, "ether");
  console.log("[DEBUG] xdc = " + data.xdc);
  // XDC残高取得-終了
  let j = 2000;
  for(i=0; i < mainCryptList.length; i++){
    cryptInfo(mainCryptList[i].symbol, mainCryptList[i].address, data, j);
    console.log("[DEBUG]-- CALL END()");
    j = j - 250;
  }
  console.log("[DEBUG]-- [End] getInfo3("+data.smry+")");
}

router.get('/', async function(req, res, next) {
  try {
    console.log("[DEBUG]-- [Start] searchBalance()");
    let outData = new Array();

    if(fs.existsSync(i_path)){
      // jsonファイルをオブジェクトに変換
      const bufferData = fs.readFileSync(i_path);
      const dataJSON = bufferData.toString();
      const inData = JSON.parse(dataJSON)
  
      for (let i=0; i<inData.length; i++) {
        // Walletの数だけループ
        outData[i] = {addr: inData[i].addr};;  
        outData[i].smry = inData[i].smry;  
        preProc(outData[i]);
      }
    }else{
      console.log("ERROR: Walletアドレスが記載されたjsonファイルが見つかりません。("+i_path+")");
      throw TypeError("ERROR: Walletアドレスが記載されたjsonファイルが見つかりません。("+i_path+")");
    }

    const resultJSON = JSON.stringify(outData)
    fs.writeFileSync(o_path, resultJSON)
    console.log("[DEBUG]-- [End] searchBalance()");
    res.json(outData);
  } catch(err) {
    console.log("例外処理" + err);
    next(err);
  }
});

module.exports = router;
