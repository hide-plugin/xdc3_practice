# 1.概要
Web画面からxdc3コマンドをどこまで使えるのか、node.js、javascript、jqueryの練習も兼ねる。<br>
* 1.RPC/WSS状態確認機能<br>
* 2.Wallet残高確認機能<br>
* 3.xxxxxx

# 2.事前準備
## (1) git clone
```
cd ~ && git clone https://github.com/hide0918/xdc3_practice.git
cd xdc3_practice
```
## (2) npm install
```
npm install
```
## (3) ポート開放
3000番ポートを使って接続するため、事前にportを開放する。
（あとで修正予定）
```
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw status
```
## (4) 常駐化
```
pm2 start npm --name xdc3_practice -- start
```

# 3.画面表示
## (1) ブラウザからの接続
```
http://[IP-Address]:3000/
```

# 3.その他
## (1) プログラム修正後の差分を取得する場合
```
cd ~/xdc3_practice/
git pull
```
