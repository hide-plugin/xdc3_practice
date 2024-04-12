$(function () {
  // JSONデータの取得先
  const resultListPath = "./data/resultList.json";

  // 取得した情報を画面へテーブル形式で描画
  const createTable = function(){
    $.getJSON(resultListPath, function(data) {
      // JSONデータを受信した後に実行する処理
      // tableのrowspanを設定
      let mRLen = data["MAINNET"]["RPC"].length;
      let mWLen = data["MAINNET"]["WSS"].length;
      let aRLen = data["APOTHEM"]["RPC"].length;
      let aWLen = data["APOTHEM"]["WSS"].length;
      let netRowSpan = [mRLen+mWLen, aRLen+aWLen];
      let typRowSpan = [mRLen, mWLen, aRLen, aWLen];
 
      const table1 = $("<table border='1'><tbody>");
      $("<tr><td colspan='7'>作成日付：" + data.DATE + "</td></tr>").appendTo(table1);
      $("<tr><td>net</td><td>type</td><td>url</td><td>version</td><td>block</td><td>gas(Gwei)</td><td>0xPrefix</td></tr>").appendTo(table1);
  
      let html = "";
      let iCnt=0;
      let jCnt=0;
      for(let network in data) {
        if(network == "DATE"){
          break;
        }
        html = "<tr><td rowspan="+netRowSpan[iCnt]+">"+network+"</td>";
        for(let type in data[network]){
          if (html.indexOf("<tr>") < 0) {
            html += "<tr>";
          }
          html += "<td rowspan="+typRowSpan[jCnt]+">"+type+"</td>";
          for(let item in data[network][type]){
            let url = data[network][type][item]["url"];
            let ver = data[network][type][item]["ver"];
            let blc = data[network][type][item]["blc"];
            let gas = data[network][type][item]["gas"];
            let pfx = data[network][type][item]["pfx"];
            if(item!=0){
              html += "<tr>";
            }
            html += "<td>"+url+"</td><td>"+ver+"</td><td>"+blc+"</td><td>"+gas+"</td><td>"+pfx+"</td></tr>";
            $(html).appendTo(table1);
            html = "";
          }
          jCnt++;
        }
        iCnt++; 
      }
      // 指定場所へHTML出力
      $("</tbody></table>").appendTo(table1);
      $("#networkList").html(table1);
    }, function(){
      $("#networkList").html("<p>テーブルの作成に失敗しました。</p>");
    });
  }

  // APIから最新情報を取得
  const getData = function(){
    $('#button').prop('disabled', true);
    $('#button').text('データ取得中');
    $("#networkList").html("<img src='/images/712-24.gif' alt=''>&nbsp;&nbsp;リスト更新中（しばらくお待ちください）");

    // リスト更新API呼び出し
    $.getJSON("/createList", function() {
        // API呼び出し成功時
        createTable();
        $('#button').text('データ取得');
        $('#button').prop('disabled', false);
      }, function() {
        // API呼び出し失敗時
        $("#networkList").html("<p>データの取得に失敗しました。</p>");
    });
  }

  // 画面表示時イベント
  getData();

  // 更新ボタン押下時イベント
  $('#button').on("click", function() {
    getData();
  });
});

