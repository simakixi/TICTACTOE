//ゲームの状態を表す2次元配列
let board=[];
//idがtableのものを定義
const table = document.getElementById("table");
//振るidを定義
let id = 0;
//○は1,×は2
let turn = 1;
let AIturn = 2;

//どちらが勝ったかをチェック
let circle = false;
let cross = false;

//プレイヤー側の定義
let player = true;

for( let i = 0 ; i < 3 ; i++ ){
    var tr = document.createElement("tr");  //tr要素を作成
    board[i] = [];      //i行目に空の配列を作成(新しい行を作成)
    for( let j = 0; j< 3 ; j++ ){
        var td = document.createElement("td");  //td要素を作成
        board[i][j] = 0;   //i行目のj列に0を代入(新しい列の作成)
        td.id = id;     //td要素にidを振る
        id++;
        td.addEventListener("click",click);   //cellクリック時にclickメソッドを追加する
        tr.appendChild(td);     //tr要素にtd要素を追加する
    }
    table.appendChild(tr);  //table要素にtr要素を追加する
}

//テーブルをクリックしたときの処理
function click(){
    if(!player)return;
    if(circle||cross)return;
    player = false;
    let place = event.target.id;    //クリックしたセルのidをplaceに代入する
    let [i,j] = locationid(place);
    if(board[i][j]==0){
        board[i][j]=turn;
        draw();
        if(GameCheck())return;
        AI();
        if(GameCheck())return;
    }
    player = true;
}

//board配列の形にする
function locationid(j){
    let i = 0;
    while(3<=j){
        j -= 3;
        i++;
    }
    return [i,j];
}

//ゲームの状態を更新
function draw(){
    let id = 0;
    for(let i = 0 ; i < 3 ; i++){
        for(let j = 0 ; j < 3 ; j++){
            if(board[i][j]==1){
                //丸の手番の場合文字を挿入し文字色を青にする
                document.getElementById(id).innerHTML="○";
                document.getElementById(id).style.color ="blue";
            }else if(board[i][j]==2){
                //バツの手番の場合文字を挿入し文字色を青にする
                document.getElementById(id).innerHTML="×";
                document.getElementById(id).style.color ="red";
            }else{
                document.getElementById(id).innerHTML="";
            }
            check(i,j);
            id++;
        }
    }
}

//丸かバツがそろっているか確認
function check(i,j){
    let thing = board[i][j];
    if(board[i][j]==0)return;
    let count = 0;
    let [y,x] = [i,j];
    while( y < 3 ){
        if(board[y][x]==thing)count++;
        y++;
    }
    if(countcheck(count,thing))return;
    count = 0;
    [y,x] = [i,j];
    while( x < 3 ){
        if(board[y][x]==thing)count++;
        x++;
    }
    if(countcheck(count,thing))return;
    count = 0;
    [y,x] = [i,j];
    while( y < 3 && x < 3 ){
        if(board[y][x]==thing)count++;
        y++;
        x++;
    }
    if(countcheck(count,thing))return;
    count = 0;
    [y,x] = [i,j];
    while( y < 3 && 0 <= x ){
        if(board[y][x]==thing)count++;
        y++;
        x--;
    }
    if(countcheck(count,thing))return;
}

//3つ揃ったかを確認
function countcheck(count,thing){
    if(count==3){
        if(thing==1){
            circle = true;
        }else{
            cross = true;
        }
        return true;
    }
}

//対戦相手をするAI(のようなもの)
function AI(){
    //リーチがある場合は優先的に配置する
    [i,j] = CheckReach();
    //リーチがない場合はランダムな場所に配置する
    if(i==3){
        i = Math.floor(Math.random() * ( 2 - 0 + 1));
        j = Math.floor(Math.random() * ( 2 - 0 + 1));
        while(board[i][j]!=0){
            i = Math.floor(Math.random() * ( 2 - 0 + 1));
            j = Math.floor(Math.random() * ( 2 - 0 + 1));
        }
    }
    board[i][j]=AIturn;
    draw();
}

//相手か自分にリーチが無いか確認する
function CheckReach(){
    let order = AIturn
    for(let i = 0;i<2;i++){
    //横のチェック
    for (let i = 0; i < 3; i++) {
        if (board[i][0] == 0 && board[i][1] == order && board[i][2] == order) return [i, 0];
        if (board[i][0] == order && board[i][1] == 0 && board[i][2] == order) return [i, 1];
        if (board[i][0] == order && board[i][1] == order && board[i][2] == 0) return [i, 2];
    }
    //縦のチェック
    for (let j = 0; j < 3; j++) {
        if (board[0][j] == 0 && board[1][j] == order && board[2][j] == order) return [0, j];
        if (board[0][j] == order && board[1][j] == 0 && board[2][j] == order) return [1, j];
        if (board[0][j] == order && board[1][j] == order && board[2][j] == 0) return [2, j];
    }
    //斜めのチェック
    if (board[0][0] == 0 && board[1][1] == order && board[2][2] == order) return [0, 0];
    if (board[0][0] == order && board[1][1] == 0 && board[2][2] == order) return [1, 1];
    if (board[0][0] == order && board[1][1] == order && board[2][2] == 0) return [2, 2];
    if (board[0][2] == 0 && board[1][1] == order && board[2][0] == order) return [0, 2];
    if (board[0][2] == order && board[1][1] == 0 && board[2][0] == order) return [1, 1];
    if (board[0][2] == order && board[1][1] == order && board[2][0] == 0) return [2, 0];
    order = turn;
    }
    return [3,3];
}

//ゲームが終了したかどうか確認する
function GameCheck(){
    if(circle==true){
        if(turn==1){
            alert("プレイヤーの勝利")
        }else{
            alert("AIの勝利");
        }
        return true;
    }else if(cross==true){
        if(turn==2){
            alert("プレイヤーの勝利")
        }else{
            alert("AIの勝利");
        }
        return true;
    }else{
        for(let i of board){
            for(let j of i){
                if(j==0){
                    return false;
                }
            }
        }
        alert("引き分け");
        return true;
    }
}

//盤面をリセットする
function reset(){
    for(let i = 0 ; i < 3 ; i++){
        for(let j = 0 ; j < 3 ; j++){
            board[i][j] = 0;
        }
    }
    draw();
    circle = false;
    cross = false;
    player = true;
    if(turn==2){
        AI();
    }
}

//先攻後攻を交代する
function change(){
    if(turn==1){
        turn=2;
        AIturn=1;
    }else{
        turn=1;
        AIturn=2;
    }
    reset();
}