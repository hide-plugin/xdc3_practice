$(function () {
  // JSONデータの取得先
  const url = "./data/resultList.json";

  $.getJSON(url, (data) => {
    let mainRpcLen = data["MAINNET"]["RPC"].length;
    let mainWssLen = data["MAINNET"]["WSS"].length;
    let aptmRpcLen = data["APOTHEM"]["RPC"].length;
    let aptmWssLen = data["APOTHEM"]["WSS"].length;
    let netRowSpan = [mainRpcLen+mainWssLen, aptmRpcLen+aptmWssLen];
    let typeRowSpan = [mainRpcLen, mainWssLen, aptmRpcLen, aptmWssLen];

    const table1 = $("<table border='1'><tbody>");
    $("<tr><td colspan='7'>作成日付：" + data.DATE + "</td></tr>").appendTo(table1);
    $("<tr><td>net</td><td>type</td><td>url</td><td>version</td><td>block</td><td>gas(Gwei)</td><td>0xPrefix</td></tr>").appendTo(table1);

    let netCnt=0;
    let typeCnt=0;
    let itemCnt=0;
    let html = "";
    // JSONの各要素に対して
    for(let network in data) {
      if(network == "DATE"){
        break;
      }
      html = "<tr><td rowspan="+netRowSpan[netCnt]+">"+network+"</td>";
      for(let type in data[network]){
        if(typeCnt!=0){
          html += "<tr>";
        }
        html += "<td rowspan="+typeRowSpan[typeCnt]+">"+type+"</td>";
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
          itemCnt++;
        }
        itemCnt=0;
        typeCnt++;
      }
      typeCnt=0;
      netCnt++; 
    }
    // 指定場所へHTML出力
    $("</tbody></table>").appendTo(table1);
    $("#networkList").append(table1);
  }, function(){
    $("#networkList").html("<p>データの取得に失敗しました。</p>");
  });
});
  