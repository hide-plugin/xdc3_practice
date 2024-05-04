# 1.概要
webからxdc3をどこまで使えるのか、javascript、jquery、bootstrap、postgresqlの練習も兼ねる。<br>
* 1.RPC/WSS状態確認<br>
* 2.（予定）Wallet残高確認<br>
* 3.SRXノード状態確認（次回報酬日、Rputation等）
* 4.（予定）pm2 logエラー一覧表示機能<br>
* 5.（予定）pm2 status一覧表示機能 SRX/PLI<br>
* 6.xxxxxx

# 2.事前準備
## (1) git clone
```
cd ~ && git clone https://github.com/hide-plugin/xdc3_practice.git
cd xdc3_practice
```
## (2) npm install
```
npm install
```
## (3) ポート開放
3000番ポートで接続するためportを開放する。
```
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw status
```
## (4) 常駐化
```
pm2 start npm --name xdc3_practice -- start
```

# 3.個別準備
## (1) 入力ファイル作成
```
cd ~/xdc3_practice/public/data/
nano walletList.json
```

# 4.画面表示
## (1) ブラウザからの接続
```
http://[IP-Address]:3000/
```

# 5.その他
## (1) プログラム修正後の差分を取得する場合
```
cd ~/xdc3_practice/
git pull
```
# 参考
XinFinOrg/XDC3：https://github.com/XinFinOrg/XDC3/blob/master/README-Web3.md
