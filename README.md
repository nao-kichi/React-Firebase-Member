<!-- 概要 -->
・ReactとFirebaseを連携させた会員機能となっています。
・新規登録画面・ログイン画面・マイページに移行することができる
・メール・パスワードはAuthで認証機能を持っています。
・入力されたメール、パスワードはcloud firestoreへデータ格納
・登録された画像に関しては、storageへ格納される。
・BrowserRouterを使用して、SPAとする。

<!-- 実際の起動 -->
・デフォルトの画面がhttps://react-firebase-192b5.web.app/register/に繋がるように
package.jsonに記している。

<!-- アップロード -->
・firebase deployを使用しているため、ルールに則った処理でデプロイをすること。

<!-- 注意 -->
・Firebase deployとGitHub deploy両方行うこと。
・firebase hostingは反映に時間がかかることがある。
・firebase hostingをする前に、npm buildが必要っぽい。