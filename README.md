# 1.概要
webからxdc3をどこまで使えるのか、javascript、jquery、bootstrap、postgresqlの練習も兼ねる。<br>
実装機能（予定）を以下に記載する。<br>
* 1.RPC/WSS状態確認<br>
* 2.（予定）Wallet残高確認<br>
* 3.SRXノード状態確認（次回報酬日、Rputation等）
* 4.（予定）pm2 logエラー一覧表示機能<br>
* 5.（予定）pm2 status一覧表示機能 SRX/PLI<br>
* 6.xxxxxx

## (1) RPC/WSS状態確認
RPC/WSSの状態を一覧表示します。
![networkList](https://github.com/hide-plugin/xdc3_practice/assets/155524286/636246d7-46fa-4054-81f6-1c94453dec8d)<br>

## (3) SRXノード状態確認
Walletに紐づくStorX-Nodeの状態を一覧表示します。
![srxList](https://github.com/hide-plugin/xdc3_practice/assets/155524286/549ba21d-0298-45bd-8021-fa188f82733d)<br>

# 2.事前準備
## (1) git clone
ホームディレクトリにリポジトリの複製を作成します。
```
cd ~ && git clone https://github.com/hide-plugin/xdc3_practice.git
```
## (2) npm install
プロジェクトへ移動しnpmをインストールします。
```
cd xdc3_practice
npm install
```
## (3) ポート開放
3000番ポートで接続するためportを開放します。port番号は"bin/www"から変更できます。
```
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw status
```
## (4) 常駐化
```
pm2 start npm --name xdc3_practice -- start
```
<br>

# 3.INPUTファイル準備
## (1) RPC/WSS状態確認用 リスト作成
RPC/WSSを追加したい場合、既存ファイルを修正してください。
```
cd ~/xdc3_practice/public/data/
nano networkList.json
```
## (2) SRXノード状態確認用 リスト作成
SRXノードで利用しているウォレットアドレス（addr）と説明（name）を下記サンプルファイルを参考に新規作成してください。
```
cd ~/xdc3_practice/public/data/
nano walletList.json
```
＜サンプルファイル＞
> [<br>
> &emsp;{ "addr": "xdcjfdoifu98ru4rtjgrf8yuhg8ttujrfdgoiuf8duf", "name": "Wallet-01" },<br>
> &emsp;{ "addr": "xdc0fdif09jagfvoigjfsogiyhuyerhglfdjoaifdfu", "name": "Wallet-02" },<br>
> &emsp;{ "addr": "xdc32r9j9f8ur89agaffadfjadsfjdijgfh98euy92a", "name": "Wallet-03" }<br>
> ]<br>
<br>

# 4.画面表示
## (1) ブラウザからの接続
[IP-Address]はVPSサーバーのIPアドレスを指定してください。<br>
ローカルPCで実行する場合はループバックアドレス（127.0.0.1）を指定してください。
```
http://[IP-Address]:3000/
```
<br>

# 5.その他
## (1) プログラム修正後の差分を取得する場合
```
cd ~/xdc3_practice/
git pull
```
# 参考
XinFinOrg/XDC3：https://github.com/XinFinOrg/XDC3/blob/master/README-Web3.md
