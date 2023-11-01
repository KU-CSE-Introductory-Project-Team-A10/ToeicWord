/*상수 변수 함수 클래스 이름짓기

상수: 전부 대문자 (띄어쓰기 언더바)-> Ex) MAXSIZE, MIN_TIME

변수:
  1) 카멜: quizTime, quizScore (첫 글자 소문자)
  2) 언더바: quiz_time, quiz_score
  - 보통 변수명엔 언더바 많이 쓰긴 하는데 둘 다 상관 없음
  - 둘이 섞어서 안 씀
  Ex) allWords_Found처럼 안 씀
  - boolean 변수엔 is, has, can 등으로 시작
  Ex) isUsedNum, hasNext, canOperate

함수:
  카멜인데 동사-목적어 순으로 많이 씀 (첫 글자 소문자)
  Ex)
  shuffleArray() -> 배열 섞기
  selectOption() -> 옵션 선택

  BackTo_menu() 처럼 함수 명엔 언더바 안 씀

클래스:
  카멜로 쓰되, 첫 글자 대문자
  Ex) Player, Words, MainClass*/

$(document).ready(() => {
  var isIntegrity = true;
  $(".quiz-time").hide();
  $("#best-scores").hide();
  $("#timer-select-page").hide();
  try {
    Words = JSON.parse(JSON.stringify(ToeicWord)).Words;
    Players = JSON.parse(localStorage.getItem("Players"));
  } catch {
    alert("파일을 불러오는 데 실패했습니다.");
    window.close();
  }
  const regexEng = /^(?!\\s)(?!.*\\s$)[a-zA-Z\s]+(?<![ \t])$/;
  const regexKor = /^(?![\s])(?!.*\\s$)[가-힣!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+(?<![ \t])$/
  const regexExEng = /^(?![\s])(?!.*\\s$)[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+(?<![ \t])$/;
  const regexExKor = /^(?!\\s)(?!.*\\s$)[가-힣0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+(?<![ \t])$/;
  if (isIntegrity) {
    if(Words.length<10) isIntegrity = false;
    for (var i = 0; i < Words.length; i++) {
      if (!Words[i].hasOwnProperty('English') || !Words[i].hasOwnProperty('Korean') || !Words[i].hasOwnProperty('ExampleKor') || !Words[i].hasOwnProperty('ExampleEng')) {
        isIntegrity = false;
        break;
      } else {
        if (!regexEng.test(Words[i].English) || !regexKor.test(Words[i].Korean) || !regexExEng.test(Words[i].ExampleEng) || !regexExKor.test(Words[i].ExampleKor)) {
          isIntegrity = false;
          break;
        } else {
          if (!isDuplicateWord(Words[i].English)) {
            isIntegrity = false;
            break;
          }
        }
      }
    }
  }
  if (isIntegrity) {
    if (Players == null) {
      Players = [];
      localStorage.setItem("Players", JSON.stringify(Players));
    }
  }
  if (!isIntegrity) {
    alert("파일을 불러오는 데 실패했습니다.");
    window.close();
  }
  window.localStorage.setItem("ToeicWord", JSON.stringify(ToeicWord));
  window.localStorage.setItem("Players", JSON.stringify(Players));
  function isDuplicateWord(eng) {
    const isDup = Words.filter(word => word.English == eng);
    return isDup.length == 1;
  }
  function isDuplicatePlayer(id) {
    const isDup = Players.filter(player => player.ID == id);
    return isDup.length == 1;
  }

  Search_word();  

});

let Words;
let Players; // 사용자들 데이터
let User; // 현 사용자
let nowPage; // 현재 페이지 0: 메인 1: 단어장 2: 퀴즈 3: 미니게임

function changePage(x) {
  nowPage = x;
  $(".menu").hide();
  $(".menu").eq(x).show();
  if (x == 1) {
    initQuizPage();
  }
  //만약 page4라면 window.close()해줌
  if (x == 3) {
    window.close();
  }
}

function MoveTo_menu(x) {
  nowPage = 0;
  $('#main').hide();
 if(x == 2){
  isMinigame = true;
  $("#page3").hide();
  $("#page2").show();
  $("#page2").children().hide();
  $("#select_page").show();
 }else{
  isMinigame = false;
  changePage(x);
 }
}

function BackTo_menu() {
  nowPage = 0;
  $('.menu').hide();
  $('#main').show();
  if (isMinigame) {
    $("#best-scores").hide();
  }
  $(".quiz-end").hide();
  $(".quizs").hide();
  $("#select_page").show();
}

function initQuizPage() {
  $("#page2").children().hide();
  $("#word-count").show();
}

function checkWordCountField(e) {
   $("#word-input").val($("#word-input").val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ''));
  if (e.keyCode == 13) {
    let input = $("#word-input").val();
    let wordCount = parseInt(input);
    if (wordCount >= 10 && wordCount <= 30) {
      setWordCount(wordCount);
    }
    else {
      alert("퀴즈 문항은 10개에서 30개까지만 설정 가능합니다.");
      $("#word-input").val("");
    }
  }
  else {
    try {
      if ((e.keyCode < 48 || e.keyCode > 57)&&(e.keyCode != 8)) {
        throw 'NaNEX';
      }
    }
    catch (ex) {
      if (ex == 'NaNEX') {
        alert("숫자만 입력해주세요.");
        e.preventDefault();
      }
    }
  }
}

let wCount;

function setWordCount(wordCount) {
  if (Words.length < wordCount) {
    alert("저장된 영단어 수가 "+wordCount+"개보다 적습니다.");
  }
  else {
    wCount = wordCount;
    if (nowPage == 1) {
      openQuizSelectionPage();
    }
  }
}

function openQuizSelectionPage() {
  $("#page2").children().hide();
  $("#select_page").show();
}

function Login() {
  var textField = $('#login-field').val();
  const regex = /^[a-zA-Z0-9]{3,16}$/;
  if (regex.test(textField)) {
    $('#login-page').hide();
    $('#main').show();
    const user = Players.filter(player => player.ID == textField);
    if (user.length == 1) { // 있음
      User = user[0];
    } else { // 없음
      var NewUser = { ID: textField, Score: [[0, 0, 0, 0], [0, 0, 0, 0]] };
      Players.push(NewUser);
      User = NewUser;
      window.localStorage.setItem("Players", JSON.stringify(Players));
    }
    return;
  }
  else {
    alert("잘못된 아이디 형식입니다.");
    document.getElementById("login-field").value = null;
  }
}

function push_and_sort(searched_word) {

   const now_word = document.getElementById("search-field").value.toLowerCase();

    table_body = document.getElementById("wordtable-body");
    table_body.innerHTML = '';

    for (var i = 0; i < Words.length; i++) {
      const eng_tmp = Words[i].English;
      const kor_tmp = Words[i].Korean;
        if(eng_tmp.replace(" ","").includes(now_word)){
    
            searched_word.push(Words[i]);
        }

        else if(kor_tmp.replace(" ","").includes(now_word)){
    
            searched_word.push(Words[i]);
        }
    }

    searched_word.sort(function (a, b) {
              return a.English.localeCompare(b.English);
          });
}

function make_Wordtable(searched_word) {
  
  for (var i = 0; i < searched_word.length; i++) {
    let row_1 = document.createElement('tr');

    let element_1 = document.createElement('th');
    element_1.innerHTML = searched_word[i].English;
    element_1.setAttribute('id', 'main-info'); // element_1에 id "main" 추가

    let element_2 = document.createElement('th');
    element_2.innerHTML = searched_word[i].Korean;
    element_2.setAttribute('id', 'main-info'); // element_2에 id "main" 추가

    let element_3 = document.createElement('th');
    element_3.innerHTML = "▷"+searched_word[i].ExampleEng;
    element_3.setAttribute('id', 'detail'); // element_3에 id "detail" 추가

    let element_4 = document.createElement('th');
    element_4.innerHTML = "▶"+searched_word[i].ExampleKor;
    element_4.setAttribute('id', 'detail'); // element_4에 id "detail" 추가

    row_1.appendChild(element_1);
    row_1.appendChild(element_2);
    row_1.appendChild(element_3);
    row_1.appendChild(element_4);
    table_body.appendChild(row_1);
  }
}

function add_eventlistener() {
  const mainInfoElements = document.querySelectorAll("#main-info");

 
  mainInfoElements.forEach(function (element) {
      element.addEventListener("click", function () {
           var childElements = element.parentElement.children;

           for (var i = 0; i < childElements.length; i++) {
              if (i === 2 || i === 3) {
                  if(childElements[i].style.display != "inline-block")
                  childElements[i].style.display = "inline-block";
                  else childElements[i].style.display = "none";
              } 
           }
      });
  });



}

function Search_word(){
  
  var searched_word = [];


  push_and_sort(searched_word);

  make_Wordtable(searched_word);

  add_eventlistener();


}
// if (QUIZTYPE2 == 1) {
//   for (let i = 0; i < 10 ; i++) {
//     quizNum[i] = shuffledWords[i];
//   }
// }
// if (QUIZTYPE2 == 2) {
//   quizNum = shuffledWords;
// }

const OPTION_COUNT = 4;
let quizIdx; //퀴즈 번호
let quizNum; //퀴즈 문항 배열
let quizScore; // 퀴즈 점수
var quizTime = 60; // 미니게임 제한시간
var timer; // 미니게임 제한시간 interval
var answerType = 0; // 주관식/객관식 : 객관식 = 0, 주관식 = 1
var timeType = 0; // 최고점수 기록 때 사용
var isMinigame = false;

function selectAnswerType(x) {
  answerType = x;
  $("#select_page").hide();
  if (isMinigame) {
    $("#timer-select-page").show();
  }
  else {
    showQuiz(0);
  }
}

function showQuiz(x) {
  timeType = x - 1;
  $("#select_page").hide();
  $("#timer-select-page").hide();
  $(".quizs").eq(answerType).show();
  if (x != 0) {
    $("#page2").hide();
    quizTime = x * 15;
    $("#page3").show();
  }
  else {
    openQuiz();
  }
}

function resetQuiz() {
  quizScore = 0;
  quizNum = [];
  $(".quiz-main").show();
  $(".quiz-end").hide();
  $(".score-div").text("점수: 0");  
}

function openQuiz() {
  // $('#countdown').remove(); 
  resetQuiz();
  initQuiz();
}

function initQuiz() { //퀴즈 문항 초기화
  const allWords = [...new Array(Words.length)].map((_, i) => i);
  var shuffledWords = allWords.sort(() => Math.random() - 0.5);
  quizIdx = 0;
  const wordLength = Words.length;
  // for (let i = 0; i < 10 ; i++) {
  //   let isUsedNum = false;
  //   let rand = Math.floor(Math.random()*wordLength);
  //   for (let j = 0 ; j < i ; j++) {
  //     if (rand == quizNum[j]) {
  //       isUsedNum = true;
  //     }
  //   }
  //   if (isUsedNum) {
  //     i--;
  //   }
  //   else {
  //     quizNum[i] = rand;
  //   }
  // }
  for (let i = 0; i < wCount ; i++) {
    quizNum[i] = shuffledWords[i];
  }
  
  if (isMinigame) {
    quizNum = shuffledWords;
    $(".quiz-time").show();
    $("#quiz-word").css("margin-left", "-600px");
    $("#best-scores").show();
  }
  generateQuiz();
}

function generateQuiz() { //퀴즈 생성
  if(answerType == 0){    
    $("#quiz-word").text(Words[quizNum[quizIdx]].English);
    $(".quiz-console").text(" ");
    let options = [];
    const wordLength = Words.length;
    //선지 생성
    options[0] = quizNum[quizIdx];
    for (let i = 1; i < OPTION_COUNT ; i++) {
      let isUsedNum = false;
      let rand = Math.floor(Math.random()*wordLength);
      for (let j = 0 ; j < i ; j++) {
        if (rand == options[j]) {
          isUsedNum = true;
        }
      }
      if (isUsedNum) {
        i--;
      }
      else {
        options[i] = rand;
      }
    }
    options = shuffleArray(options);
    $("#quiz-option-frame").html("");
    for (let i = 0 ; i < OPTION_COUNT ; i++) {
      $("#quiz-option-frame").append("<button class='quiz-option' onclick='selectOption(" + i + ")'>" + Words[options[i]].Korean + "</button>");
    }
  }
  else{
    $("#quiz-word2").text(Words[quizNum[quizIdx]].English);
    $(".quiz-console").text(" ");

  }
}

var reroading = false;

function sub_word(){

  var means = '';
  var count = 0;
  const sub_text = document.getElementById("quiz-input").value;
 
  document.getElementById("quiz-input").value = "";

  if(!reroading){
    reroading = true;
    for(var i = 0; i < Words.length;i++){
      if($("#quiz-word2").text() == Words[i].English){
        means += Words[i].Korean + ", ";
        count++;
      }
    }

    var meanWords = means.split(",");
    var userWords = sub_text.split(",");

    var meanWords = meanWords.map(function(word) {
      return word.trim();
    });
    var userWords = userWords.map(function(word) {
      return word.trim();
    });
    var allWordsFound;
    if(userWords[0] != ''){
    allWordsFound = userWords.every(word => meanWords.includes(word));
    }else allWordsFound = false;

    if (allWordsFound) {
      $(".quiz-console").text("정답입니다.");
        quizScore += 10;
        $(".score-div").text("점수: " + quizScore);

    }else{
      var prt_text = '오답입니다. 정답 : ';
      for(var o = 0; o < meanWords.length;o++){
        prt_text += meanWords[o]+" ";
      }
      $(".quiz-console").text(prt_text);
    }
    quizIdx++;
    if (quizIdx != wCount) {
      setTimeout(function() {
        generateQuiz();
        reroading = false;
      }, 1500);
    }
    else {
      setTimeout(function() {
        quizEnd();
        reroading = false;
      }, 1500);
    }
  }
}

function selectOption(idx) {
  if ($("#quiz-option-frame > button").eq(idx).text() == Words[quizNum[quizIdx]].Korean) {
    $("#quiz-option-frame > button").eq(idx).css("background-color", "lime");
    $(".quiz-console").text("정답입니다.");
    quizScore += 10;
    $(".score-div").text("점수: " + quizScore);
  }
  else {
    $("#quiz-option-frame > button").eq(idx).css("background-color", "red");
    for (let i = 0 ; i < OPTION_COUNT ; i++) {
      if ($("#quiz-option-frame > button").eq(i).text() == Words[quizNum[quizIdx]].Korean) {
        $("#quiz-option-frame > button").eq(i).css("background-color", "lime");
        $(".quiz-console").text("오답입니다.");
      }
    }
  }
  quizIdx++;
  $(".quiz-option").attr('onclick', '').unbind('click');
  if (quizIdx != wCount) {
    setTimeout(function() {
      generateQuiz();
    }, 1500);
  }
  else {
    setTimeout(function() {
      quizEnd();
    }, 1500);
  }
}

function quizEnd() {
  $(".quiz-main").hide();
  $(".quiz-end").show();
  $(".quiz-time").hide();
  $("#quiz-word").css("margin-left", "");
  $(".minigame-btn").show();
  var names = [];
  var scores = [];

  console.log(answerType, timeType)
  
  clearInterval(timer);
  if (answerType == 0) {
    $(".quiz-end-score").text("점수: " + quizScore);
  }
  if (answerType == 1) {
    $(".quiz-end-score").text("점수: " + quizScore);
  }
  if (isMinigame && answerType == 0) {
    for (var i = 0; i < Players.length; i++) {
      if(Players[i].ID === User.ID) {
        if (Players[i].Score[answerType][timeType] < quizScore) {
          Players[i].Score[answerType][timeType] = quizScore;
        }
        $(".quiz-end-score").html("My score: " + quizScore + "<br>High score: " + Players[i].Score[answerType][timeType]);
        break;
      }
    }
    
    window.localStorage.setItem("Players", JSON.stringify(Players));
    console.log(JSON.stringify(Players))
    
    names[0] = Players[0].ID;
    scores[0] = Players[0].Score[answerType][timeType];
    for (var i = 1; i < Players.length; i++) {
      var isUsed = false;
      for (var j = 0; j <  names.length; j++) {
        if (scores[j] >= Players[i].Score[answerType][timeType] && names[j] !== Players[i].ID) {
          if (j == 0) {
            names.unshift(Players[i].ID);
            scores.unshift(Players[i].Score[answerType][timeType]);
          }
          else {
            names.splice(j - 1, 0, Players[i].ID);
            scores.splice(j - 1, 0, Players[i].Score[answerType][timeType]);
          }
          isUsed = !isUsed;
          break;
        }
      }
      if (!isUsed) {
        names.push(Players[i].ID);
        scores.push(Players[i].Score[answerType][timeType]);
      }
    }
    names = names.reverse();
    scores = scores.reverse();

    if (names[1] === undefined) {
      $("#best-scores").html("Rank 1) " + names[0] + " : " + scores[0]);
    }
    else if (names[2] === undefined) {
      $("#best-scores").html("Rank 1) " + names[0] + " : " + scores[0] + "<br>Rank 2) " + names[1] + " : " + scores[1]);
    }
    else {
      $("#best-scores").html("Rank 1) " + names[0] + " : " + scores[0] + "<br>Rank 2) " + names[1] + " : " + scores[1] + "<br>Rank 3)" + names[2] + " : " + scores[2]);
    }
  }
  if (answerType == 1 && isMinigame) {
    for (var i = 0; i < Players.length; i++) {
      if(Players[i].ID === User.ID) {
        if (Players[i].Score[answerType][timeType] < quizScore) {
          Players[i].Score[answerType][timeType] = quizScore;
        }
        $(".quiz-end-score").html("My score: " + quizScore + "<br>High score: " + Players[i].Score[answerType][timeType]);
        break;
      }
    }
    
    window.localStorage.setItem("Players", JSON.stringify(Players));
    
    names[0] = Players[0].ID;
    scores[0] = Players[0].Score;
    for (var i = 1; i < Players.length; i++) {
      var isUsed = false;
      for (var j = 0; j <  names.length; j++) {
        if (scores[j] >= Players[i].Score && names[j] !== Players[i].ID) {
          if (j == 0) {
            names.unshift(Players[i].ID);
            scores.unshift(Players[i].Score);
          }
          else {
            names.splice(j - 1, 0, Players[i].ID);
            scores.splice(j - 1, 0, Players[i].Score);
          }
          isUsed = !isUsed;
          break;
        }
      }
      if (!isUsed) {
        names.push(Players[i].ID);
        scores.push(Players[i].Score);
      }
    }
    names = names.reverse();
    scores = scores.reverse();

    if (names[1] === undefined) {
      $("#best-scores2").html("Rank 1) " + names[0] + " : " + scores[0]);
    }
    else if (names[2] === undefined) {
      $("#best-scores2").html("Rank 1) " + names[0] + " : " + scores[0] + "<br>Rank 2) " + names[1] + " : " + scores[1]);
    }
    else {
      $("#best-scores2").html("Rank 1) " + names[0] + " : " + scores[0] + "<br>Rank 2) " + names[1] + " : " + scores[1] + "<br>Rank 3)" + names[2] + " : " + scores[2]);
    }
  }

  quizTime = 60;

}

function shuffleArray(arr) {
  let randArr = [];
  let clone = [];
  for (let i = 0 ; i < arr.length ; i++) {
    let isUsedNum = false;
    let rand = Math.floor(Math.random()*arr.length);
    for (let j = 0 ; j < i ; j++) {
      if (rand == randArr[j]) {
        isUsedNum = true;
      }
    }
    if (isUsedNum) {
      i--;
    }
    else {
      randArr[i] = rand;
    }
  }
  for (let i = 0 ; i < arr.length ; i++) {
    clone[randArr[i]] = arr[i];
  }
  return clone;
}

function wait(sec) {
  let start = Date.now(), now = start;
  while (now - start < sec * 1000) {
      now = Date.now();
  }
}

function countDown() {
  var countDown = 3;
  var countInt = setInterval(() => {
    $("#minigame-title").text(countDown);
    if (countDown == 0) {
      clearInterval(countInt);
    }
  }, 1000);
  wait(3);
  MiniGame();
}

function MiniGame() {
  $("#page3").hide();
  $(".quizs").eq(answerType).show();
  $(".quiz-time").text(quizTime + "s");
   Countdown();
  //openQuiz();
  // timer_minigame = setInterval(() => {
  //   --quizTime;
  //   $(".quiz-time").text(quizTime + "s");

  //   if (quizTime == 0) {
  //     quizEnd();
  //   }
  // }, 1000);
}

function Countdown(){
  var counter = 4;
  var timer = setInterval( function() { 
    $('#countdown').remove();     
    counter--;
    var countdown = $('<span id="countdown">'+(counter==0?'Start':counter)+'</span>'); 
    countdown.appendTo($('.container'));
    setTimeout( () => {
       if (counter >-1) {
       $('#countdown').css({ 'font-size': '40vw', 'opacity': 0 }); 
       } else {
         $('#countdown').css({ 'font-size': '10vw', 'opacity': 50 });
       }
    },20);

    if (counter == -1) {
      $("#page2").show();
      clearInterval(timer);
      $('#countdown').remove();
      openQuiz();
      timer_minigame = setInterval(() => {
        --quizTime;
        $(".quiz-time").text(quizTime + "s");

        if (quizTime == 0) {
          quizEnd();
        }
      }, 1000);
    }
  }, 1000);


}
