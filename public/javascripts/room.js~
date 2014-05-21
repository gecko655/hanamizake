/*プレイヤーに出す問題集
 * ["漢字とかなんでも","ひらがなorローマ字or記号"]
 * の形式で追加できます。
 * 第一要素は表示するだけなので
 * ["半値印証時間","はーふぷらいすらべりんぐたいむ"] とか
 * ["コナミコマンド",UUDDLRLRAB"] とかでも
 * おｋです*/
var problems=[
        ["おなか減った","おなかへった"],
        ["ここに文章を入れる","ここにぶんしょうをいれる"],
        ["ハローワールド","はろーわーるど"],
        ["三音は下げる","さんおんはさげる"],
        ["わんこそば","わんこそば"],
        ["「っえーい」","「っえーい」"],
       ];

$(function () {
  Init();
});


// ゲームの始めに呼ばれる関数, スペースでゲームをスタート
function Init() {
  $(document).bind('keydown', function (e) {
    if(keyCode(e)==8){//バックスペースが入力されたときは無効にする
      return false;
    }
  })
  $(document).bind('keypress', function (e) {
    /*入力されたキーがスペースだったとき*/
    if (32 == keyCode(e)) {
      $(document).unbind('keypress');
      /*3秒待ってからゲーム開始*/
      (function () {
        var count = 3;
        var timerFrame = $('#pressSpace').css('fontSize', "3.5rem").text(count);
        var timer = setInterval(function () {
          count--;
          if (count <= 0) {
            timerFrame.text('Start');
            clearInterval(timer);
            setTimeout('Start()', 1000);
            return;
          }
          timerFrame.text(count);
        }, 1000);
      })();
    }
  });
}



var gameCount=0;//問題番号
var startDate;//ゲーム開始時刻
var endDate;//ゲーム終了時刻
var sMissCount=0;//ミスした問題数
var combos=0;//連続正解した問題数
var scores= new Array();//点数を記録する配列
var times= new Array();//時間を記録する配列
var missCounts=new Array();//ミスしたキー数
var strlengths= new Array();//入力したキー数を記録する配列

var bgm//BGM

// ゲームスタート後始めに呼ばれる関数
function Start() {
　　
　/*BGMを再生*/
  bgm=document.getElementById("bgm");
  bgm.volume=0.75;
  bgm.play();

  startDate=new Date();
  oneSentence(gameCount);
  $('#time').show();
  timerDraw();
}
function timerDraw(){
  if(!$('#resultArea').attr('style')=="display:none;"){
    return;
  }
  //c($('#resultArea').attr('style')=="display:none;");
  $('#time').text("time:"+Math.round((new Date()-startDate)/1000,0));
  if($('#resultArea').attr('style')=="display:none;"){
    setTimeout("timerDraw()",100);
  }else{
    $('#time').hide();
  }
}

//ゲーム終了後に呼ばれる関数
function End(){
  endDate=new Date();
  var time = round(sum(times), 2);
  var strlength=sum(strlengths);
  var score = round(sum(scores)*(1+strlength/time), 0);
  var missCount = sum(missCounts);
  c("score"+score);
  c("missCount"+missCount);
  c("strlength"+strlength);
  c("missRate"+missCount/strlength);
  $("#time").val(time);
  $("#invalid_input_num").val(sMissCount);
  
  $('#inputArea').hide();
  $("#result_score").text(String(score));
  $("#result_time").text(String(time));
  $("#result_missCount").text(String(missCount));
  $('#resultArea').show();
  
  $.ajax({
	 url: "/typing/result",
	 type: "POST",
	 data: {category_id: category_id,
		 	authenticityToken: authenticityToken,
		 	score: score,
		 	time: time,
		 	missCount: missCount
		 	},
	 error: function(XMLHttpRequest, textStatus, errorThrown){
		 alert("申し訳ありませんが、エラーが発生いたしました。");
	 }
  });
}

function oneSentence(){
  var jpStr=problems[gameCount][0];//問題文の漢字表現
  var hiraganaStr=problems[gameCount][1];//問題文のひらがな表現
  var index=0;//次に入力する文字は"index文字目"
  var str="";//入力済みの文字列
  var inputALetter="";//入力中の1(もしくは2)文字に対応した入力済みの文字列
  var sMiss=false;//問題で1度でもミスしたらtrue
  var missCount=0;
  setText(jpStr,hiraganaStr,str,index);//問題を表示
  var startDate=new Date();
  
  var critical=0;
  
  /*BGMがゲーム途中で終了していたら再生*/
  bgm.addEventListener("ended", function(){
	bgm.currentTime=0;
	bgm.play();
  },false);

  $(document).bind('keypress', function (e) {
    var keyMiss=false;//入力した文字が間違っていたらtrue
    /*string.fromCharCodeでキーを取得、アルファベットは大文字で取得できるので小文字に変換*/
    var key=String.fromCharCode(keyCode(e));
    inputALetter+=key;
    nextjpChar=fetchNext(hiraganaStr,index);//次の文字を取得
    /*次に入力すべき文字と入力した文字が部分一致した*/
    if(partMatch(nextjpChar,inputALetter)){
        str+=key;
    /*次に入力すべき文字が"っ"で、
     * その次に入力すべき文字の子音を入力した時
     * （例えば、"った" を入力すべき時に"t"を入力した時）*/
    }else if(nextjpChar=="っ"
      &&inputALetter.length==1
      &&partMatch(fetchNext(hiraganaStr,index+1),inputALetter)
      &&hiraganaStr.charAt(index+1).match(/[あいうえおなにぬねの]/)==null
      ){
        str+=key;
    /*次に入力すべき文字が"っ"で、
     * その次に入力すべき文字の子音を2連続で入力した時
     * （例えば、"った" を入力すべき時に"tt"を入力した時）*/
    }else if(nextjpChar=="っ"
      &&inputALetter.length==2
      &&inputALetter.charAt(0)==inputALetter.charAt(1)
      &&partMatch(fetchNext(hiraganaStr,index+1),inputALetter.charAt(0))
    ){
      str+=key;
      inputALetter=inputALetter.slice(1);//inputALetterの最初の1文字を捨てる
      index++;//一文字進める
      nextjpChar=fetchNext(hiraganaStr,index);//次の文字を取得
    /*次に入力すべき文字が"ん"で、
     * nとその次に入力すべき文字の子音を連続で入力した時
     * （例えば、"んた" を入力すべき時に "nt"を入力した時）*/
    }else if(nextjpChar=="ん"
      &&inputALetter.length==2
      &&partMatch(hiraganaStr.charAt(index+1),inputALetter.slice(1))
      &&hiraganaStr.charAt(index+1).match(/[あいうえお]/)==null
      )
    {
        str+=key;
        inputALetter=inputALetter.slice(1);//一文字捨てる
        index++;//一文字進める
        nextjpChar=fetchNext(hiraganaStr,index);//次の文字を取得
    /*ここまできたら正しい文字が入力されなかったことになる*/
    }else{
      inputALetter=inputALetter.substr(0,inputALetter.length-1);//間違った入力を捨てる
      sMiss=true;//ミスを記録
      keyMiss=true;
      missCount++;
    }
    /*ひらがな1(または2)文字分の入力が終わったとき*/
    if(i=conpleteMatch(nextjpChar,inputALetter)){
      index+=i;//一文字進める
      inputALetter="";//inputALetterを空にする
    }
    /*画面表示を更新*/
    setText(jpStr,hiraganaStr,str,index);
    if(keyMiss)$('#romanText').append("<span style=\"color:#ff0000;\">"+key+"</span>");
    keyboard(key,!keyMiss);
    
    /*キー音を再生*/
    if(keyMiss==false){
	    var audio=document.getElementById("keysound");
	    //c(audio.currentTime);
	    audio.volume=0.75;
	    audio.currentTime=0;
	    //c(audio.currentTime);
	    audio.play();
    }else{
	    var audio=document.getElementById("miss");
	    //c(audio.currentTime);
	    audio.currentTime=0;
	    //c(audio.currentTime);
	    audio.play();
    }
    
    /*1文の入力が全て終わった時*/
    if(index==hiraganaStr.length){
    
      /*単語終了音*/
      if(sMiss==false){
	    var audio=document.getElementById("bell");
	    //c(audio.currentTime);
	    audio.currentTime=0;
	    //c(audio.currentTime);
	    audio.play();
      }else{
	    var audio=document.getElementById("enter");
	    //c(audio.currentTime);
	    audio.currentTime=0;
	    //c(audio.currentTime);
	    audio.play();
      }
    
      $(document).unbind('keypress');
      var now=new Date();
      var time=(now-startDate)/1000;
      startDate=now;
      if(sMiss){
	sMissCount++;//ミスがあった時ミスカウントを増やす
	combos=0;//コンボ数を0に
      }else{
	combos++;//コンボ数を増やす
      }
      var score=Math.max(str.length*10*(str.length-missCount)/str.length*(Math.pow(1.1,combos))*(1+str.length*0.25/time),0);
      rnd=Math.random();
      if(rnd<0.01*(1+combos/20)*(1+(str.length*0.25-time)/str.length*0.25)){
	score*=7.77;
	critical=7.77;
      }else if(rnd<0.05*(1+combos/20)*(1+(str.length*0.25-time)/str.length*0.25)){
	score*=2.25;
	critical=2.25;
      }else if(rnd<0.15*(1+combos/20)*(1+(str.length*0.25-time)/str.length*0.25)){
	score*=1.5;
	critical=1.5;
      }
      scores.push(score);
      times.push(time);
      missCounts.push(missCount);
      strlengths.push(str.length);
      
      $('#inputArea').append("<p id=\"sentenceScore\">"+round(score,0)+"</p>");
      if(combos>0){
        var com = Math.pow(1.1,combos)*100;
        com=Math.round(com)/100;
      	$('#inputArea').append("<p id=\"sentenceCombos\">Combos ×"+com+"</p>");
      }
      if(critical>0){
      	$('#inputArea').append("<p id=\"sentenceCritical\">Critical ×"+critical+"</p>");
      }

      
      
      c(score);
      c(time);
      c(missCount);

      gameCount++;//問題番号を増やす
      //setTimeout("Start()",1000);
      /*すべての問題が終わった時*/
      if(gameCount==problems.length){
        
        bgm.pause();
        
        setTimeout("End()",1000);//終了処理
        return;
      }
      setTimeout("oneSentence(gameCount)",1000);//次の問題を表示
    }
  });
}

/*次に入力すべきひらがなを配列で返す。
 * たとえば、「ちゅうにびょうでもこいがしたい」で、最初にこの関数を呼ぶと、
 * ["ち","ちゅ"]を返す。*/
function fetchNext(hiraganaStr,index){
    var nextjpChar = hiraganaStr.charAt(index);
    /*「ちゅ」など、ひらがな2文字に対するローマ字表現が存在する時*/
    if(index!=hiraganaStr.length-1
        &&(typeof jpData[hiraganaStr.substr(index,2)]) !=="undefined"){
      nextjpChar=new Array(nextjpChar,hiraganaStr.substr(index,2));
    }
    return nextjpChar;
}

/*inputALetterがnextjpCharのすくなくとも1つの要素に前方一致していたらtrueを返す
 * たとえば、nextjpChar=["ち","ちゅ"]のとき
 * inputALetter="t","ti","ty","tyu","c","ch","chi"などのときtrue*/
function partMatch(nextjpChar,inputALetter){
  for(i=0;i<nextjpChar.length;i++){
    for(j=0;j<jpData[nextjpChar[i]].length;j++){
      if(inputALetter==jpData[nextjpChar[i]][j].substr(0,inputALetter.length)){//部分一致
        return true;
      }
    }
  }
  return false;
}

/*inputALetterがnextjpCharのすくなくとも1つの要素と完全一致していたらnextjpCharの日本語表現での文字数を返す。
 * たとえば、nextjpChar=["ち","ちゅ"]のとき
 * inputALetter="ti"なら1を
 * inputALetter="chu"なら2を
 * inputALetter="ch"ならfalse(0)を返す */
function conpleteMatch(nextjpChar,inputALetter){
  for(i=0;i<nextjpChar.length;i++){
    for(j=0;j<jpData[nextjpChar[i]].length;j++){
      if(inputALetter==jpData[nextjpChar[i]][j]){//ひらがな1(または2)文字のローマ字表現と完全一致
	return nextjpChar[i].length;
      }
    }
  }
  return false;
}
/*
 * Sample
 * #romanText spanにCSSで黄色のcolorを設定している
 * <p id="normalText">ここに文章をいれる</p><p id="romanText"><span>kokoni</span>bunsyouwoireru</p>
 **/
// 日本語, ローマ字, 現在の位置を引数にとり表示する
function setText(jpStr ,hiraganaStr, str, index) {
  var text = '<p id="normalText">' + jpStr + '</p>' + '<p id="hiraganaText"><span>' + hiraganaStr.substr(0, index) + '</span>' + hiraganaStr.substr(index, hiraganaStr.length + 1) + '</p>' + '<p id="romanText">' + str +'</p>';
  $('#inputArea').html(text);
  c($('#inputArea p').get());
}

/*キーボードの表示
 * 正しいキー入力ならvalid=true,それ以外ならfalse*/
function keyboard(key,valid){
	key=key.toLowerCase();
	var num;
	switch(key){
	case "z":
		num=1;
		break;
	case "x":
		num=2;
		break;
	case "c":
		num=3;
		break;
	case "v":
		num=4;
		break;
	case "b":
		num=5;
		break;
	case "n":
		num=6;
		break;
	case "m":
		num=7;
		break;
	case "a":
		num=8;
		break;
	case "s":
		num=9;
		break;
	case "d":
		num=10;
		break;
	case "f":
		num=11;
		break;
	case "g":
		num=12;
		break;
	case "h":
		num=13;
		break;
	case "j":
		num=14;
		break;
	case "k":
		num=15;
		break;
	case "l":
		num=16;
		break;
	case "q":
		num=17;
		break;
	case "w":
		num=18;
		break;
	case "e":
		num=19;
		break;
	case "r":
		num=20;
		break;
	case "t":
		num=21;
		break;
	case "y":
		num=22;
		break;
	case "u":
		num=23;
		break;
	case "i":
		num=24;
		break;
	case "o":
		num=25;
		break;
	case "p":
		num=26;
		break;
	}
    
	try{
        draw(num,valid);
    }catch(e){

    }
}

/*配列の要素をすべて足した数を返す*/
function sum(array){
  var sum=0;
  for(i=0;i<array.length;i++){
    sum+=array[i];
  }
  return sum;
}

/*イベントからキーコードを取得
 * ブラウザ依存に対応*/
function keyCode(e){
  if(document.all)
    return  e.keyCode;
  else if(document.getElementById) 
    return (e.keyCode)? e.keyCode: e.charCode;
  else if(document.layers)
    return  e.which;
}


var jpData=new Array();

jpData["あ"] = ["a"];
jpData["い"] = ["i"];
jpData["う"] = ["u", "wu", "whu"];
jpData["え"] = ["e"];
jpData["お"] = ["o"];
jpData["か"] = ["ka", "ca"];
jpData["き"] = ["ki"];
jpData["く"] = ["ku", "qu", "cu"];
jpData["け"] = ["ke"];
jpData["こ"] = ["ko", "co"];
jpData["さ"] = ["sa"];
jpData["し"] = ["si", "shi", "ci"];
jpData["す"] = ["su"];
jpData["せ"] = ["se", "ce"];
jpData["そ"] = ["so"];
jpData["た"] = ["ta"];
jpData["ち"] = ["ti", "chi"];
jpData["つ"] = ["tu", "tsu"];
jpData["て"] = ["te"];
jpData["と"] = ["to"];
jpData["な"] = ["na"];
jpData["に"] = ["ni"];
jpData["ぬ"] = ["nu"];
jpData["ね"] = ["ne"];
jpData["の"] = ["no"];
jpData["は"] = ["ha"];
jpData["ひ"] = ["hi"];
jpData["ふ"] = ["hu", "fu"];
jpData["へ"] = ["he"];
jpData["ほ"] = ["ho"];
jpData["ま"] = ["ma"];
jpData["み"] = ["mi"];
jpData["む"] = ["mu"];
jpData["め"] = ["me"];
jpData["も"] = ["mo"];
jpData["や"] = ["ya"];
jpData["ゆ"] = ["yu"];
jpData["よ"] = ["yo"];
jpData["ら"] = ["ra"];
jpData["り"] = ["ri"];
jpData["る"] = ["ru"];
jpData["れ"] = ["re"];
jpData["ろ"] = ["ro"];
jpData["わ"] = ["wa"];
jpData["を"] = ["wo"];
jpData["ん"] = ["nn", "n'"];
jpData["が"] = ["ga"];
jpData["ぎ"] = ["gi"];
jpData["ぐ"] = ["gu"];
jpData["げ"] = ["ge"];
jpData["ご"] = ["go"];
jpData["ざ"] = ["za"];
jpData["じ"] = ["zi", "ji"];
jpData["ず"] = ["zu"];
jpData["ぜ"] = ["ze"];
jpData["ぞ"] = ["zo"];
jpData["だ"] = ["da"];
jpData["ぢ"] = ["di"];
jpData["づ"] = ["du"];
jpData["で"] = ["de"];
jpData["ど"] = ["do"];
jpData["ば"] = ["ba"];
jpData["び"] = ["bi"];
jpData["ぶ"] = ["bu"];
jpData["べ"] = ["be"];
jpData["ぼ"] = ["bo"];
jpData["ぱ"] = ["pa"];
jpData["ぴ"] = ["pi"];
jpData["ぷ"] = ["pu"];
jpData["ぺ"] = ["pe"];
jpData["ぽ"] = ["po"];
jpData["ヴ"] = ["vu"];
jpData["っ"] = ["ltu", "xtu", "ltsu", "xtsu"];
jpData["ぁ"] = ["la", "xa"];
jpData["ぃ"] = ["li", "xi", "lyi", "xyi"];
jpData["ぅ"] = ["lu", "xu"];
jpData["ぇ"] = ["le", "xe", "lye", "xye"];
jpData["ぉ"] = ["lo", "xo"];
jpData["ゃ"] = ["lya", "xya"];
jpData["ゅ"] = ["lyu", "xyu"];
jpData["ょ"] = ["lyo", "xyo"];
jpData["ゎ"] = ["lwa", "xwa"];
jpData["ヵ"] = ["lka", "xka"];
jpData["ヶ"] = ["lke", "xke"];

jpData["きゃ"] = ["kya"];
jpData["きぃ"] = ["kyi"];
jpData["きゅ"] = ["kyu"];
jpData["きぇ"] = ["kye"];
jpData["きょ"] = ["kyo"];
jpData["しゃ"] = ["sya", "sha"];
jpData["しぃ"] = ["syi"];
jpData["しゅ"] = ["syu", "shu"];
jpData["しぇ"] = ["sye", "she"];
jpData["しょ"] = ["syo", "sho"];
jpData["ちゃ"] = ["tya", "cha", "cya"];
jpData["ちぃ"] = ["tyi", "cyi"];
jpData["ちゅ"] = ["tyu", "chu", "cyu"];
jpData["ちぇ"] = ["tye", "che", "cye"];
jpData["ちょ"] = ["tyo", "cho", "cyo"];
jpData["にゃ"] = ["nya"];
jpData["にぃ"] = ["nyi"];
jpData["にゅ"] = ["nyu"];
jpData["にぇ"] = ["nye"];
jpData["にょ"] = ["nyo"];
jpData["ひゃ"] = ["hya"];
jpData["ひぃ"] = ["hyi"];
jpData["ひゅ"] = ["hyu"];
jpData["ひぇ"] = ["hye"];
jpData["ひょ"] = ["hyo"];
jpData["みゃ"] = ["mya"];
jpData["みぃ"] = ["myi"];
jpData["みゅ"] = ["myu"];
jpData["みぇ"] = ["mye"];
jpData["みょ"] = ["myo"];
jpData["りゃ"] = ["rya"];
jpData["りぃ"] = ["ryi"];
jpData["りゅ"] = ["ryu"];
jpData["りぇ"] = ["rye"];
jpData["りょ"] = ["ryo"];
jpData["ぎゃ"] = ["gya"];
jpData["ぎぃ"] = ["gyi"];
jpData["ぎゅ"] = ["gyu"];
jpData["ぎぇ"] = ["gye"];
jpData["ぎょ"] = ["gyo"];
jpData["じゃ"] = ["zya", "ja", "jya"];
jpData["じぃ"] = ["zyi", "jyi"];
jpData["じゅ"] = ["zyu", "ju", "jyu"];
jpData["じぇ"] = ["zye", "je", "jye"];
jpData["じょ"] = ["zyo", "jo", "jyo"];
jpData["ぢゃ"] = ["dya"];
jpData["ぢぃ"] = ["dyi"];
jpData["ぢゅ"] = ["dyu"];
jpData["ぢぇ"] = ["dye"];
jpData["ぢょ"] = ["dyo"];
jpData["びゃ"] = ["bya"];
jpData["びぃ"] = ["byi"];
jpData["びゅ"] = ["byu"];
jpData["びぇ"] = ["bye"];
jpData["びょ"] = ["byo"];
jpData["ぴゃ"] = ["pya"];
jpData["ぴぃ"] = ["pyi"];
jpData["ぴゅ"] = ["pyu"];
jpData["ぴぇ"] = ["pye"];
jpData["ぴょ"] = ["pyo"];

jpData["いぇ"] = ["ye"];
jpData["うぁ"] = ["wha"];
jpData["うぃ"] = ["wi", "whi"];
jpData["うぇ"] = ["we", "whe"];
jpData["うぉ"] = ["who"];
jpData["くぁ"] = ["qa", "kwa"];
jpData["くぃ"] = ["qi", "kwi"];
jpData["くぇ"] = ["qe", "kwe"];
jpData["くぉ"] = ["qo", "kwo"];
jpData["つぁ"] = ["tsa"];
jpData["つぃ"] = ["tsi"];
jpData["つぇ"] = ["tse"];
jpData["つぉ"] = ["tso"];
jpData["てゃ"] = ["tha"];
jpData["てぃ"] = ["thi"];
jpData["てゅ"] = ["thu"];
jpData["てぇ"] = ["the"];
jpData["てょ"] = ["tho"];
jpData["とぁ"] = ["twa"];
jpData["とぃ"] = ["twi"];
jpData["とぅ"] = ["twu"];
jpData["とぇ"] = ["twe"];
jpData["とぉ"] = ["two"];
jpData["ふぁ"] = ["fa"];
jpData["ふゃ"] = ["fya"];
jpData["ふぃ"] = ["fi"];
jpData["ふゅ"] = ["fyu"];
jpData["ふぇ"] = ["fe"];
jpData["ふぉ"] = ["fo"];
jpData["ふょ"] = ["fyo"];
jpData["ぐぁ"] = ["gwa"];
jpData["でゃ"] = ["dha"];
jpData["でぃ"] = ["dhi"];
jpData["でゅ"] = ["dhu"];
jpData["でぇ"] = ["dhe"];
jpData["でょ"] = ["dho"];
jpData["どぁ"] = ["dwa"];
jpData["どぃ"] = ["dwi"];
jpData["どぅ"] = ["dwu"];
jpData["どぇ"] = ["dwe"];
jpData["どぉ"] = ["dwo"];
jpData["ヴぁ"] = ["va"];
jpData["ヴゃ"] = ["vya"];
jpData["ヴぃ"] = ["vi", "vyi"];
jpData["ヴゅ"] = ["vyu"];
jpData["ヴぇ"] = ["ve", "vye"];
jpData["ヴぉ"] = ["vo"];
jpData["ヴょ"] = ["vyo"];

jpData["a"] = ["a"];
jpData["b"] = ["b"];
jpData["c"] = ["c"];
jpData["d"] = ["d"];
jpData["e"] = ["e"];
jpData["f"] = ["f"];
jpData["g"] = ["g"];
jpData["h"] = ["h"];
jpData["i"] = ["i"];
jpData["j"] = ["j"];
jpData["k"] = ["k"];
jpData["l"] = ["l"];
jpData["m"] = ["m"];
jpData["n"] = ["n"];
jpData["o"] = ["o"];
jpData["p"] = ["p"];
jpData["q"] = ["q"];
jpData["r"] = ["r"];
jpData["s"] = ["s"];
jpData["t"] = ["t"];
jpData["u"] = ["u"];
jpData["v"] = ["v"];
jpData["w"] = ["w"];
jpData["x"] = ["x"];
jpData["y"] = ["y"];
jpData["z"] = ["z"];

jpData["A"] = ["A"];
jpData["B"] = ["B"];
jpData["C"] = ["C"];
jpData["D"] = ["D"];
jpData["E"] = ["E"];
jpData["F"] = ["F"];
jpData["G"] = ["G"];
jpData["H"] = ["H"];
jpData["I"] = ["I"];
jpData["J"] = ["J"];
jpData["K"] = ["K"];
jpData["L"] = ["L"];
jpData["M"] = ["M"];
jpData["N"] = ["N"];
jpData["O"] = ["O"];
jpData["P"] = ["P"];
jpData["Q"] = ["Q"];
jpData["R"] = ["R"];
jpData["S"] = ["S"];
jpData["T"] = ["T"];
jpData["U"] = ["U"];
jpData["V"] = ["V"];
jpData["W"] = ["W"];
jpData["X"] = ["X"];
jpData["Y"] = ["Y"];
jpData["Z"] = ["Z"];

jpData["0"] = ["0"];
jpData["1"] = ["1"];
jpData["2"] = ["2"];
jpData["3"] = ["3"];
jpData["4"] = ["4"];
jpData["5"] = ["5"];
jpData["6"] = ["6"];
jpData["7"] = ["7"];
jpData["8"] = ["8"];
jpData["9"] = ["9"];

jpData["-"] = ["-"];
jpData["ー"] = ["-"];
jpData[" "] = [" "];
jpData["　"] = [" "];
jpData["!"] = ["!"];
jpData["！"] = ["!"];
jpData["?"] = ["?"];
jpData["？"] = ["?"];
jpData[","] = [","];
jpData["、"] = [","];
jpData["."] = ["."];
jpData["。"] = ["."];
jpData["\["] = ["\["];
jpData["\]"] = ["\]"];
jpData["「"] = ["\["];
jpData["」"] = ["\]"];
jpData["\""] = ["\""];
jpData["\'"] = ["\'"];
jpData[":"] = [":"];
jpData[";"] = [";"];
jpData[">"] = [">"];
jpData["<"] = ["<"];
jpData["+"] = ["+"];
jpData["@"] = ["@"];
jpData["#"] = ["#"];
jpData["$"] = ["$"];
jpData["%"] = ["%"];
jpData["^"] = ["^"];
jpData["&"] = ["&"];
jpData["*"] = ["*"];
jpData["("] = ["("];
jpData[")"] = [")"];

var c = function(obj){console.log(obj)};

/* 第１引数に数値を,第２引数に少数点以下の桁を指定し
 * 指定した桁未満を切り捨てた数値を返す
 */ 
function round(number, decimal_point){
	if (!(typeof(number) == "number")) {
		console.error("number: 引数にnumber型を指定してください");
		return null;
	}
	else if (!(typeof(decimal_point) == "number")) {
		console.error("decimal_point: 引数にnumber型を指定してください");
		return null;
	}
	
	number = number * Math.pow(10, decimal_point);
	number = Math.round(number);
	return number / Math.pow(10, decimal_point);
}
