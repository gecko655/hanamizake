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
  $(document).bind('keypress', function (e) {
    /*入力されたキーがスペースだったとき*/
    if (32 == keyCode(e)) {
      $(document).unbind('keypress');
      /*3秒待ってからゲーム開始*/
      (function () {
        var count = 3;
        var timerFrame = $('#inputArea p').css('fontSize', "3.5rem").text(count);        
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
var missCount=0;//ミスした問題数

// ゲームスタート後始めに呼ばれる関数
function Start() {
  startDate=new Date();
  oneSentence(gameCount);
}

//ゲーム終了後に呼ばれる関数
function End(){
  endDate=new Date();
  var time = (endDate-startDate)/1000
  $("#time").val(time);
  $("#invalid_input_num").val(missCount);
  
  //$("form#result").submit();
  //alert((endDate-startDate)/1000 + "sec(s)");//タイピングした時間を取得。
  //alert("miss count: " + missCount);//ミスした単語数を取得
}

function oneSentence(){
  var jpStr=problems[gameCount][0];//問題文の漢字表現
  var hiraganaStr=problems[gameCount][1];//問題文のひらがな表現
  var index=0;//次に入力する文字は"index文字目"
  var str="";//入力済みの文字列
  var inputALetter="";//入力中の1(もしくは2)文字に対応した入力済みの文字列
  var miss=false;//bool ミスしたらtrue
  setText(jpStr,hiraganaStr,str,index);//問題を表示
  $(document).bind('keypress', function (e) {
    /*string.fromCharCodeでキーを取得、アルファベットは大文字で取得できるので小文字に変換*/
    var key=String.fromCharCode(keyCode(e));
    if(key.search(/[A-Z]/)==0){key=key.toLowerCase();}
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
      miss=true;//ミスを記録
    }
    /*ひらがな1(または2)文字分の入力が終わったとき*/
    if(i=conpleteMatch(nextjpChar,inputALetter)){
      index+=i;//一文字進める
      inputALetter="";//inputALetterを空にする
    }
    /*画面表示を更新*/
    setText(jpStr,hiraganaStr,str,index);
    /*1文の入力が全て終わった時*/
    if(index==hiraganaStr.length){
      $(document).unbind('keypress');
      if(miss)missCount++;//ミスがあった時ミスカウントを増やす
      gameCount++;//問題番号を増やす
      //setTimeout("Start()",1000);
      /*すべての問題が終わった時*/
      if(gameCount==problems.length){
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

jpData["A"] = ["a"];
jpData["B"] = ["b"];
jpData["C"] = ["c"];
jpData["D"] = ["d"];
jpData["E"] = ["e"];
jpData["F"] = ["f"];
jpData["G"] = ["g"];
jpData["H"] = ["h"];
jpData["I"] = ["i"];
jpData["J"] = ["j"];
jpData["K"] = ["k"];
jpData["L"] = ["l"];
jpData["M"] = ["m"];
jpData["N"] = ["n"];
jpData["O"] = ["o"];
jpData["P"] = ["p"];
jpData["Q"] = ["q"];
jpData["R"] = ["r"];
jpData["S"] = ["s"];
jpData["T"] = ["t"];
jpData["U"] = ["u"];
jpData["V"] = ["v"];
jpData["W"] = ["w"];
jpData["X"] = ["x"];
jpData["Y"] = ["y"];
jpData["Z"] = ["z"];

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
