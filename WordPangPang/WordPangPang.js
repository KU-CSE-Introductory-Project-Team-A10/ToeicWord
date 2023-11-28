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
  $("#best-scores2").hide();
  $("#timer-select-page").hide();
  try {
    Words = JSON.parse(JSON.stringify(ToeicWord)).Words;
    Players = JSON.parse(localStorage.getItem("Players"));
  } catch {
    alert("파일을 불러오는 데 실패했습니다.");
    window.close();
  }
  if(Words == null) isIntegrity = false;
  const regexEng = /^(?![\s])(?!.*\\s$)[a-zA-Z\s]+(?<![ \t])$/;
  const regexKor = /^(?![\s])(?!.*\\s$)[가-힣!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+(?<![ \t])$/
  const regexExEng = /^(?![\s])(?!.*\\s$)[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+(?<![ \t])$/;
  const regexExKor = /^(?![\s])(?!.*\\s$)[가-힣0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+(?<![ \t])$/;
  if (isIntegrity) {
    if(Words.length<30) isIntegrity = false;
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
  /*
  function isDuplicatePlayer(id) {
    const isDup = Players.filter(player => player.ID == id);
    return isDup.length == 1;
  }
  */

  searchWord();  

});

let Words;
let Players; // 사용자들 데이터
let User; // 현 사용자
let wCount;

function changePage(x) {
  $(".menu").hide();
  $(".menu").eq(x).show();
  if (x == 1 || x == 2) {
    initQuizPage();
  }
  else if(x == 3){
    for (var i = 0; i < Players.length; i++) {
      if(Players[i].ID === User.ID) {
        if (Players[i].History.length == 0) {
           var wrongtable_body =  document.getElementById("wrongtable-body");
           wrongtable_body.innerHTML = "틀린 문제가 없습니다.";
        }
        else{
          MakeWrongtable(Players[i].History);
        }

      }
    }
  }
  //만약 page4라면 window.close()해줌
  else if (x == 4) {
    window.close();
  }
}

function MoveTo_menu(x) {
  $("#main-page").show();
  $('#main').hide();
  if(x == 2) {
    isMinigame = true;
    changePage(1);
  }
  else if (x == 5) {
    $("#page2").children().hide();
    $("option-select-page").show();
    if (isMinigame) {
      isMinigame = true;
      changePage(1);
    }
    else {
      isMinigame = false;
      changePage(1);
    }
  }
  else {
    isMinigame = false;
    changePage(x);
  }
}

function BackTo_menu() {
  $('.menu').hide();
  $('#main').show();
  $(".init-input").val("");
  if (isMinigame) {
    $("#best-scores").hide();
    $("#best-scores2").hide();
    clearInterval(timer);
  }
  $(".quiz-end").hide();
  $(".quizs").hide();
  $("#main").show();
}

function checkWordCountField(e) {
  $("#word-input").val($("#word-input").val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ''));
  try {
    if ((e.keyCode < 48 || e.keyCode > 57)&&(e.keyCode != 8)) {
      throw 'NaNEX';
    }
  }
  catch (ex) {
    if (ex == 'NaNEX') {
      e.preventDefault();
      $("#word-input").val("");
    }
  }
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
      var NewUser = { ID: textField, Score: [[0, 0, 0, 0], [0, 0, 0, 0]], History: [] };
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

function sortArray(searched_word) {

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

function makeWordtable(searched_word) {
  
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

function addEventlistener() {
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

function setHistory(quiz, answer) {
  var exist = false;
  for (var i = 0; i < Players.length; i++) {
    if(Players[i].ID === User.ID) {
      if (Players[i].History.length == 0) {
        Players[i].History.unshift([ quiz, answer, 1]);
      }
      else {
        for (var j = 0; j < Players[i].History.length; j++) {
          if (Players[i].History[j][0] == quiz) {
            var temp = Players[i].History[j];
            Players[i].History.splice(j, 1);
            temp[2] = temp[2] + 1;
            Players[i].History.unshift(temp);
            exist = true;
            break;
          }
        }
      }
      if (!exist) {
        Players[i].History.unshift([quiz, answer, 1]);
      }
    }
  }
  window.localStorage.setItem("Players", JSON.stringify(Players));
}

function searchWord(){
  
  var searched_word = [];


  sortArray(searched_word);

  makeWordtable(searched_word);

  addEventlistener();


}

const OPTION_COUNT = 4;
let quizIdx; //퀴즈 번호
let quizNum; //퀴즈 문항 배열
let quizScore; // 퀴즈 점수
var quizTime = 60; // 미니게임 제한시간
var timer; // 미니게임 제한시간 interval
var answerType = 0; // 주관식/객관식 : 객관식 = 0, 주관식 = 1
var timeType = 0; // 최고점수 기록 때 사용
var isMinigame = false;
var languageType = 0; // 퀴즈(미니게임) 언어 : 영어 = 0, 한국어 = 1

function quizConfirm() {
  if (!isMinigame) {
    let isValid;
    isValid = isWordCountValid();
    if (isValid) {
      wCount = parseInt($("#word-input").val());
    }
    else {
      return;
    }
    answerType = parseInt($("input[name=type]:checked").val());
    languageType = parseInt($("input[name=lang]:checked").val());
    showQuiz(0);
  }
  else {
    answerType = parseInt($("input[name=type]:checked").val());
    quizTime = parseInt($("input[name=time]:checked").val());
    languageType = parseInt($("input[name=lang]:checked").val());
    showQuiz(quizTime);
  }
}

function isWordCountValid() {
  let wcValue = $("#word-input").val();
  if (wcValue === "") {
    $("#word-input-alert").text("필수 입력 사항입니다.");
    return false;
  }
  else {
    wcValue = parseInt(wcValue);
    if (wcValue >= 10 && wcValue <= 30) {
      $("#word-input-alert").text("");
      return true;
    }
    else {
      $("#word-input-alert").text("퀴즈 문항은 10개에서 30개까지만 설정 가능합니다.");
      return false;
    }
  }
}

function initQuizPage() {
  if (!isMinigame) {
    $("#main-page").children().hide();
    $("#page2").show();
    $("#option-select-page").show();
    $("#option-main-header").text("단어퀴즈");
    $(".mg-type-option").hide();
    $(".quiz-type-option").show();
  }
  else {
    $("#main-page").children().hide();
    $("#page2").show();
    $("#option-select-page").show();
    $("#option-main-header").text("미니게임");
    $(".quiz-type-option").hide();
    $(".mg-type-option").show();
  }
}

function showQuiz(x) {
  timeType = x - 1;
  $("#option-select-page").hide();
  $(".quizs").eq(answerType).show();
  if (x != 0) {
    $("#page2").hide();
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
  
  if(isMinigame && (answerType == 0)){
    wCount = Words.length;
  }

  for (let i = 0; i < wCount ; i++) {
    quizNum[i] = shuffledWords[i];
  }
  
  if (isMinigame) {
    quizNum = shuffledWords;
    $(".quiz-time").show();
    $("#best-scores").show();
    $("#best-scores2").show();
  }
  generateQuiz();
}

function generateQuiz() { //퀴즈 생성
  if(answerType == 0){
    if (languageType == 0) {    
      $("#quiz-word").text(Words[quizNum[quizIdx]].English);
    }
    else {
      $("#quiz-word").text(Words[quizNum[quizIdx]].Korean);  
    }
    $(".quiz-console").text(" ");
    $(".quiz-wrong-answer-console").text(" ");
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
      if (languageType == 0) {
        $("#quiz-option-frame").append("<button class='quiz-option' onclick='selectOption(" + i + ")'>" + Words[options[i]].Korean + "</button>");
      }
      else {
        $("#quiz-option-frame").append("<button class='quiz-option' onclick='selectOption(" + i + ")'>" + Words[options[i]].English + "</button>"); 
      }
    }
  }
  else{
    if (languageType == 0) {
      $("#quiz-word2").text(Words[quizNum[quizIdx]].English);
    }
    else {
      $("#quiz-word2").text(Words[quizNum[quizIdx]].Korean);
    }
    $(".quiz-console").text(" ");
    $(".quiz-wrong-answer-console").text(" ");

  }
}

var isReloading = false;

function sub_word(){
  if (languageType == 0) {
    subWordEng();
  }
  else {
    subWordKor();
  }
}

function subWordEng() { // 영단어 퀴즈
  var means = '';
  var count = 0;
  const SUB_TEXT = document.getElementById("quiz-input").value;
 
  document.getElementById("quiz-input").value = "";

  if(!isReloading){
    isReloading = true;
    for(var i = 0; i < Words.length;i++){
      if($("#quiz-word2").text() == Words[i].English){
        means += Words[i].Korean + ", ";
        count++;
      }
    }

    var meanWords = means.split(",");
    var userWords = SUB_TEXT.split(",");

    var meanWords = meanWords.map(function(word) {
      return word.trim();
    });
    var userWords = userWords.map(function(word) {
      return word.trim();
    });
    var isWordsFound;
    if(userWords[0] != ''){
    isWordsFound = userWords.every(word => meanWords.includes(word));
    }else isWordsFound = false;

    if (isWordsFound) {
      $(".quiz-console").text("정답입니다.");
        quizScore += 10;
        $(".score-div").text("점수: " + quizScore);

    }else{
      $(".quiz-console").text("오답입니다.");
      var prt_text = '정답 : ';
      for(var o = 0; o < meanWords.length;o++){
        prt_text += meanWords[o]+" ";
      }
      $(".quiz-wrong-answer-console").text(prt_text);
      setHistory(Words[quizNum[quizIdx]].English, Words[quizNum[quizIdx]].Korean);
    }
    quizIdx++;
    if (quizIdx != wCount) {
      setTimeout(function() {
        generateQuiz();
        isReloading = false;
      }, 1500);
    }
    else {
      setTimeout(function() {
        quizEnd();
        isReloading = false;
      }, 1500);
    }
  }
}

function subWordKor() {
  var means = '';
  var count = 0;
  const SUB_TEXT = $("#quiz-input").val();
  $("#quiz-input").val("");

  if(!isReloading){
    isReloading = true;
    var isWordsFound;
    if(SUB_TEXT == Words[quizNum[quizIdx]].English) {
      isWordsFound = true;
    }
    else {
      isWordsFound = false;
    }

    if (isWordsFound) {
      $(".quiz-console").text("정답입니다.");
        quizScore += 10;
        $(".score-div").text("점수: " + quizScore);

    }else{
      $(".quiz-console").text("오답입니다.");
      var prt_text = '정답 : ';
      prt_text += Words[quizNum[quizIdx]].English;
      $(".quiz-wrong-answer-console").text(prt_text);
      setHistory(Words[quizNum[quizIdx]].Korean, Words[quizNum[quizIdx]].English);
    }
    quizIdx++;
    if (quizIdx != wCount) {
      setTimeout(function() {
        generateQuiz();
        isReloading = false;
      }, 1500);
    }
    else {
      setTimeout(function() {
        quizEnd();
        isReloading = false;
      }, 1500);
    }
  }
}

function selectOption(idx) {
  if (($("#quiz-option-frame > button").eq(idx).text() == Words[quizNum[quizIdx]].Korean) || ($("#quiz-option-frame > button").eq(idx).text() == Words[quizNum[quizIdx]].English)) {
    $("#quiz-option-frame > button").eq(idx).css("background-color", "lime");
    $(".quiz-console").text("정답입니다.");
    quizScore += 10;
    $(".score-div").text("점수: " + quizScore);
  }
  else {
    $("#quiz-option-frame > button").eq(idx).css("background-color", "red");
    for (let i = 0 ; i < OPTION_COUNT ; i++) {
      if ($("#quiz-option-frame > button").eq(i).text() == Words[quizNum[quizIdx]].Korean || ($("#quiz-option-frame > button").eq(i).text() == Words[quizNum[quizIdx]].English)) {
        $("#quiz-option-frame > button").eq(i).css("background-color", "lime");
        $(".quiz-console").text("오답입니다.");
        if (languageType == 0) {
          setHistory(Words[quizNum[quizIdx]].English, Words[quizNum[quizIdx]].Korean);
        }
        if (languageType == 1) {
          setHistory(Words[quizNum[quizIdx]].Korean, Words[quizNum[quizIdx]].English);
        }
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
  $(".minigame-btn").show();
  
  clearInterval(timer);

  $(".quiz-end-score").text("점수: " + quizScore);

  if (isMinigame) {
    timeType = (timeType + 1) / 15 - 1;
    for (var i = 0; i < Players.length; i++) {
      if(Players[i].ID === User.ID) {
        if (Players[i].Score[answerType][timeType] < quizScore) {
          Players[i].Score[answerType][timeType] = quizScore;
        }
        $(".quiz-end-score").html("My score: " + quizScore + "<br>High score: " + Players[i].Score[answerType][timeType]);
        break;
      }
    }

    Players.sort(function(a, b) {
      return a.ID.localeCompare(b.ID); // "ID"를 기준으로 사전순 정렬
    });

    Players.sort(function(a, b) {
      return b.Score[answerType][timeType] - a.Score[answerType][timeType]; // 내림차순 정렬, 오름차순을 원한다면 a.score - b.score로 변경
    });
    
    window.localStorage.setItem("Players", JSON.stringify(Players));
    
    if (answerType == 0) {
      if (Players[1] === undefined) {
        $("#best-scores").html("Rank 1) " + Players[0].ID + " : " + Players[0].Score[answerType][timeType]);
      }
      else if (Players[2] === undefined) {
        $("#best-scores").html("Rank 1) " + Players[0].ID + " : " + Players[0].Score[answerType][timeType] + "<br>Rank 2) " + Players[1].ID + " : " + Players[1].Score[answerType][timeType]);
      }
      else {
        $("#best-scores").html("Rank 1) " + Players[0].ID + " : " + Players[0].Score[answerType][timeType] + "<br>Rank 2) " + Players[1].ID + " : " + Players[1].Score[answerType][timeType] + "<br>Rank 3)" + Players[2].ID + " : " + Players[2].Score[answerType][timeType]);
      }
    }
    if (answerType == 1) {
      if (Players[1] === undefined) {
        $("#best-scores2").html("Rank 1) " + Players[0].ID + " : " + Players[0].Score[answerType][timeType]);
      }
      else if (Players[2] === undefined) {
        $("#best-scores2").html("Rank 1) " + Players[0].ID + " : " + Players[0].Score[answerType][timeType] + "<br>Rank 2) " + Players[1].ID + " : " + Players[1].Score[answerType][timeType]);
      }
      else {
        $("#best-scores2").html("Rank 1) " + Players[0].ID + " : " + Players[0].Score[answerType][timeType] + "<br>Rank 2) " + Players[1].ID + " : " + Players[1].Score[answerType][timeType] + "<br>Rank 3)" + Players[2].ID + " : " + Players[2].Score[answerType][timeType]);
      }
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

function MiniGame() {
  $("#page3").hide();
  $(".quizs").eq(answerType).show();
  $(".quiz-time").text(quizTime + "s");
  Countdown();
}

function Countdown(){
  $(".container").show();
  var counter = 4;
  var timer_minigame = setInterval( function() { 
    $('#countdown').remove();     
    counter--;
    var countdown = $('<span id="countdown">'+(counter==0?'Start':counter)+'</span>'); 
    countdown.appendTo($('.container'));
    setTimeout( () => {
       if (counter > -1) {
       $('#countdown').css({ 'font-size': '30vw', 'opacity': 0 }); 
       }
       else {
         $('#countdown').css({ 'font-size': '10vw', 'opacity': 50 });
       }
    },20);

    if (counter == -1) {
      $("#page2").show();
      $(".container").hide();
      clearInterval(timer_minigame);
      $('#countdown').remove();
      openQuiz();
      timer = setInterval(() => {
        --quizTime;
        $(".quiz-time").text(quizTime + "s");

        if (quizTime == 0) {
          quizEnd();
        }
      }, 1000);
    }
  }, 1000);
}

function MakeWrongtable(table) {
  var wrongtable_body = document.getElementById("wrongtable-body");
  wrongtable_body.innerHTML = "";

  for (var i = 0; i < table.length -1; i++) {
    let row = document.createElement('tr');

    appendCell(row, "틀린 문제", table[i][0]);
    appendCell(row, "정답", table[i][1]);
    appendCell(row, "틀린 횟수", table[i][2]);

    wrongtable_body.appendChild(row);
  }
}

function appendCell(row, label, value) {
  let cell = document.createElement('th');
  cell.innerHTML = label + " : " + value;
  cell.setAttribute('id', 'main-info');
  row.appendChild(cell);
}
