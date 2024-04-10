$(function () {
  // JSONデータの取得先
  const url = "./data/resultList.json";
  let html = "";
  let htmlParts;
  $.getJSON(url, (data) => {
    htmlParts = data.DATE + "<br>";

    // JSONの各要素に対して
    for(let network in data) {
      if(network == "DATE"){
        break;
      }
      htmlParts += "<strong>" + network + "</strong><br>";
      for(let type in data[network]){
        htmlParts += "<strong>" + type + "</strong><br>";
        for(let item in data[network][type]){
          let url = data[network][type][item]["url"];
          let ver = data[network][type][item]["ver"];
          let blc = data[network][type][item]["blc"];
          let gas = data[network][type][item]["gas"];
          let pfx = data[network][type][item]["pfx"];
          htmlParts += url + "," + ver + "," + blc+ "," + gas + "," + pfx +"<br>";
        }
      }
      console.log(htmlParts);
      // 先述の変数の中に、出来上がったHTMLを格納
      html += htmlParts;
      htmlParts = "";
    }
    // 指定場所へHTML出力
    $("#rpc-list").html(html);
  }, function(){
    $("#rpc-list").html("<p>データの取得に失敗しました。</p>");
  });
});
  