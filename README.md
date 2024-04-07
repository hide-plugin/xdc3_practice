# 1.概要
Web画面からxdc3コマンドをどこまで使えるのか、node.jsの練習も兼ねる。

# 2.前提
Port3000を利用するため事前にportを開放する。
```
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw status
```

# 3.事前準備
## (1) git clone
```
git clone https://github.com/hide0918/xdc3_practice.git
cd xdc3_practice
```
## (2) npm install
```
npm install
```
## (3) node.jsの常駐化
```
pm2 start app.json
```
## (4) ブラウザでの画面表示
```
https://[IP-Address]:3000/
```

# 3.その他
