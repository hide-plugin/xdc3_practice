$(function () {
    // JSONデータの取得先
    const url = "./data/resultList.json";
    let html = "";
  
    $.getJSON(url, (data) => {
      // JSONの各要素に対して
      for(let item in data) {
          let htmlParts = "<strong>" + item + "</strong><br>";
          for(let subItem in data[item]){
              let url = data[item][subItem]["url"];
              let ver = data[item][subItem]["ver"];
              let blc = data[item][subItem]["blc"];
              let gas = data[item][subItem]["gas"]*0.000000001;
              let pfx = data[item][subItem]["pfx"];
              htmlParts += url + "," + ver + "," + blc+ "," + gas + "," + pfx +"<br>";
          }
          console.log(htmlParts);
          // 先述の変数の中に、出来上がったHTMLを格納
          html += htmlParts;
      }
      // 指定場所へHTML出力
      $("#rpc-list").html(html);
    }, function(){
      $("#rpc-list").html("<p>データの取得に失敗しました。</p>");
    });
  });
    