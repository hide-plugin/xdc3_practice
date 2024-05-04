$(function () {
  /** 
  * APIから取得した情報をテーブル出力する。
  * @param {string} data RPC/WSS 取得情報
  */
  const createTable = function(data){
    try {
      // tableのrowspanを設定
      let mRLen = data["MAINNET"]["RPC"].length;  // Mainnet/RPCの項目数
      let mWLen = data["MAINNET"]["WSS"].length;  // Mainnet/WSSの項目数
      let aRLen = data["APOTHEM"]["RPC"].length;  // Apothem/RPCの項目数
      let aWLen = data["APOTHEM"]["WSS"].length;  // Apothem/WSSの項目数
      let netLength = [mRLen+mWLen, aRLen+aWLen];
      let typLength = [mRLen, mWLen, aRLen, aWLen];
 
      const table1 = $("<br><table border='1' class='network-tbl'><tbody>");
//      table1.append("<tr class='header1'><th colspan='9' >作成日付：" + data.DATE + "</th></tr>");
      table1.append("<tr class='header2'><th>Network</th><th>Type</th><th>URL</th><th>Version</th><th>Block</th><th>Gas(Gwei)</th><th>Prefix</th><th>ChainID</th><th>Status</th></tr>");
  
      let iCnt=0;
      let jCnt=0;
      for(let network in data) {
        let html = "<tr><td rowspan="+netLength[iCnt]+">"+network+"</td>";
        for(let type in data[network]){
          if (html.indexOf("<tr>") < 0) {
            html += "<tr><td style='display: none;'></td>";
          }
          html += "<td rowspan="+typLength[jCnt]+">"+type+"</td>";
          for(let item in data[network][type]){
            let url = data[network][type][item]["url"];
            let ver = data[network][type][item]["ver"];
            let blc = data[network][type][item]["blc"];
            let gas = data[network][type][item]["gas"];
            let pfx = data[network][type][item]["pfx"];
            let cid = data[network][type][item]["cid"];
            let sts = data[network][type][item]["sts"];
            if(item!=0){
              html += "<tr><td style='display: none;'></td><td style='display: none;'></td>";
            }
            if(sts == "タイムアウト"){
              bgcolor = "getError"; 
            } else if (sts == "接続エラー"){
              bgcolor = "connectError"; 
            } else {
              bgcolor = "normal"; 
            } 
            html += "<td class='" + bgcolor + "'>"+url+"</td><td class='" + bgcolor + "'>"+ver+"</td><td class='" + bgcolor + "'>"+blc+"</td><td class='" + bgcolor + "'>"+gas+"</td><td class='" + bgcolor + "'>"+pfx+"</td><td class='" + bgcolor + "'>"+cid+"</td><td class='" + bgcolor + "'>"+sts+"</td></tr>";

            table1.append(html);
            html = "";
          }
          jCnt++;
        }
        iCnt++; 
      }
      // 指定場所へHTML出力
      table1.append("</tbody></table>");
      $("#networkList").html(table1);
    } catch {
      console.log("createTable() 異常終了");
      console.log("テキスト：" + jqXHR.responseText);
      $("#networkList").html("<p>テーブルの作成に失敗しました。</p>");
    } finally {
    }
  }

  /** 
  * APIから最新情報を取得する。
  * @param {string} timeout  処理待ち時間
  */
  const getData = (timeout) => {
    $('#button').prop('disabled', true);
    $('#button').text('データ取得中');
    $("#networkList").html("<img src='/images/712-24.gif' alt=''>&nbsp;&nbsp;リスト更新中（しばらくお待ちください）");

    // データ取得API呼び出し
    $.getJSON("/networkStatus/getStatus?timeout="+timeout, (resultData) => {
      // API呼び出し正常終了
      createTable(resultData);
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
  $('#getInfo').on("click", function() {
    let element = document.getElementById('timeout');
    $("#errMsg").html("");
    if(element.value == ""){
      // 必須エラー
      $("#errMsg").html("<p class='error'>【入力エラー】「応答待ち時間」は必須入力項目です。</p>");
    } else if (element.value < 1 || element.value > 60) {
      // 入力エラー
      $("#errMsg").html("<p class='error'>【入力エラー】「応答待ち時間」は1-60（秒）の間で入力してください。</p>");
    } else {
      // 正常
      getData(element.value);
    }
  });
});
