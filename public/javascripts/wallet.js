$(function () {
    // JSONデータの取得先
    const resultPath = "./data/result/w_result.json";
      
    // APIから最新情報を取得
    const getData = function(){
  
      $.getJSON("/searchBalance", function() {
        console.log("getData() 正常終了");
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        // API呼び出し失敗時、画面へエラー詳細を出力
        console.log("getData() 異常終了");
      })
      .always(function() {
        // 後処理
        console.log("getData() 完了");
      })
    }
  
    // 更新ボタン押下イベント
    $('#getInfo').on("click", function() {
      $("#errMsg").html("");
      getData();
    });
  });
  