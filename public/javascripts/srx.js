$(function () {
  /** 
   * APIから取得した情報をテーブル出力する。
   * @param {string} data RPC/WSS 取得情報
  */
  const createTable = function(wList){
    try {
      const table1 = $("<br><table border='1' class='srx-tbl'><tbody>");
      table1.append("<tr class='header2'><th>説明</th><th>Walletアドレス</th><th>運用開始日</th><th>Stake枚数</th><th>Reputation</th><th>前回報酬獲得日</th><th>次回報酬まで</th><th>総獲得報酬枚数</th></tr>");

      for (let i = 0; i<wList.length; i++){
        if(wList[i]["srxInfo"].nextRedeemedTm == "報酬発生"){
          bgcolor = "redeem"; 
        }else if(wList[i]["srxInfo"].nextRedeemedTm.slice(0, 2).toString() < 3) {
          bgcolor = "redeemSoon"; 
        }else{
          bgcolor = "normal"; 
        } 
        let html = "<tr>\
                 <td>"+wList[i].name+"</td>\
                 <td>"+wList[i].addr+"</td>\
                 <td>"+wList[i]["srxInfo"].stakedTime+"</td>\
                 <td>"+wList[i]["srxInfo"].stakedAmount+"</td>\
                 <td>"+wList[i]["srxInfo"].reputation+"</td>\
                 <td>"+wList[i]["srxInfo"].lastRedeemedAt+"</td>\
                 <td class='" + bgcolor + "'>"+wList[i]["srxInfo"].nextRedeemedTm+"</td>\
                 <td>"+wList[i]["srxInfo"].totalRedeemed+"</td>\
                 </tr>";
        table1.append(html);
        html = "";
      }
      // 指定場所へHTML出力
      table1.append("</tbody></table>");
      $("#srxList").html(table1);
    } catch {
      console.log("createTable() 異常終了");
      console.log("テキスト：" + jqXHR.responseText);
      $("#networkList").html("<p>テーブルの作成に失敗しました。</p>");
    } finally {
    }
  }

  function toRedeemDays(dnumTarget) {
    // 本日日時を取得
    let nowDate = new Date();
    let dnumNow = nowDate.getTime();
    
    // 前回報酬日から30日後の日時を取得
    dnumTarget.setMonth( dnumTarget.getMonth() + 1);
    
    if(dnumTarget<dnumNow){
      // 報酬日を過ぎている場合
      result = "報酬発生";
    }else{
      // 次回報酬日までの残りの日数、時分を算出
      let diffDaysTmp = dnumTarget - dnumNow;
      let diffDays = Math.floor(diffDaysTmp/(1000*60*60*24));
      let diffHours = Math.floor(diffDaysTmp/(1000*60*60)-diffDays*24);
      let diffMinutes = Math.floor(diffDaysTmp/(1000*60)-diffDays*24*60-diffHours*60);
      result = diffDays.toString().padStart(2,"0")+"D "+diffHours.toString().padStart(2,"0")+":"+diffMinutes.toString().padStart(2,"0");
    }
    return result;
  }
    
  const VVV = (wList) => {
    try{
      // データ取得API呼び出し
      $.getJSON("https://farmerapi.storx.io/get-contract-data", (srxList) => {
        // API呼び出し正常終了
        let searchWallet = "";
        for(let i=0; i<wList.length; i++) {
          searchWallet = wList[i].addr.toLowerCase();
          if(!searchWallet.indexOf("xdc")){
            // プレフィクスがxdcの場合0xに置換
            searchWallet = searchWallet.replace("xdc", '0x');
          }

          if(srxList.data["stakeHolders"][searchWallet]){
            wList[i]["srxInfo"].reputation = srxList.data["stakeHolders"][searchWallet].reputation;
            wList[i]["srxInfo"].stakedAmount = Math.round(srxList.data["stakeHolders"][searchWallet]["stake"].stakedAmount / 1e18);
            wList[i]["srxInfo"].totalRedeemed = Math.floor(srxList.data["stakeHolders"][searchWallet]["stake"].totalRedeemed / 1e16)/100;
            wList[i]["srxInfo"].balance = srxList.data["stakeHolders"][searchWallet]["stake"].balance;
          
            // UNIX時間（秒）をJS用に合わせる（ミリ秒）
            var time = new Date(srxList.data["stakeHolders"][searchWallet]["stake"].lastRedeemedAt*1000);
            var month = time.getMonth()+1;
            wList[i]["srxInfo"].lastRedeemedAt = time.getFullYear()+"/"+month.toString().padStart(2,"0")+"/"+time.getDate().toString().padStart(2,"0")+" "+time.getHours().toString().padStart(2,"0")+":"+time.getMinutes().toString().padStart(2,"0");
            wList[i]["srxInfo"].nextRedeemedTm = toRedeemDays(time);


            time = new Date(srxList.data["stakeHolders"][searchWallet]["stake"].stakedTime*1000);
            month = time.getMonth()+1;
            wList[i]["srxInfo"].stakedTime = time.getFullYear()+"/"+month.toString().padStart(2,"0")+"/"+time.getDate().toString().padStart(2,"0")+" "+time.getHours().toString().padStart(2,"0")+":"+time.getMinutes().toString().padStart(2,"0");

            console.log("srxInfo.stakedTime=" + wList[i]["srxInfo"].stakedTime);
            console.log("srxInfo.stakedAmount=" + wList[i]["srxInfo"].stakedAmount);
            console.log("srxInfo.reputation=" + wList[i]["srxInfo"].reputation);
            console.log("srxInfo.totalRedeemed=" + wList[i]["srxInfo"].totalRedeemed);
            console.log("srxInfo.lastRedeemedAt=" + wList[i]["srxInfo"].lastRedeemedAt);
            console.log("srxInfo.nextRedeemedTm=" + wList[i]["srxInfo"].nextRedeemedTm);
            console.log("srxInfo.balance=" + wList[i]["srxInfo"].balance);
            console.log("name=" + wList[i].name);
            console.log(searchWallet);
          }else{
          console.log("SRX-LISTに該当Walletが見つかりません。（"+ searchWallet +"）");
          };
        }

        createTable(wList);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        // API呼び出し異常終了
        console.log("SRX-API異常終了");
        console.log("テキスト：" + jqXHR.responseText);
        $("#networkList").html("<p>データ取得中にエラーが発生しました。</p>");
        $("#networkList").append(jqXHR.responseText);
      })
      .always(function() {
        // 後処理
        $('#button').text('データ取得');
        $('#button').prop('disabled', false);
      })
    }catch(err){

    }finally{

    }
  }

  /** 
  * APIから最新情報を取得する。
  */
  const getData = () => {
    $('#button').prop('disabled', true);
    $('#button').text('データ取得中');
    $("#networkList").html("<img src='/images/712-24.gif' alt=''>&nbsp;&nbsp;リスト更新中（しばらくお待ちください）");

    // データ取得API呼び出し
    $.getJSON("/srxStatus/getWallet", (resultData) => {
      // API呼び出し正常終了
      VVV(resultData); 
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      // API呼び出し異常終了
      console.log("getStatus() 異常終了");
      console.log("テキスト：" + jqXHR.responseText);
      $("#networkList").html("<p>データ取得中にエラーが発生しました。</p>");
      $("#networkList").append(jqXHR.responseText);
    })
    .always(function() {
      // 後処理
      $('#button').text('データ取得');
      $('#button').prop('disabled', false);
    })
  }
  
    // 更新ボタン押下時イベント
    $('#getSRX').on("click", function() {
      console.log("aaaaaaaaa");
      getData();
    });
  });
