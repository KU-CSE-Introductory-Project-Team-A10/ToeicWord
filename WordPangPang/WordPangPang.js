$(document).ready(() => {
  var isIntegrity = true;
  try {
    Words = JSON.parse(JSON.stringify(ToeicWord)).Words;
    Players = JSON.parse(localStorage.getItem("Players"));
  } catch {
    alert("파일을 불러오는 데 실패했습니다.");
    window.close();
  }
  const regexEng = /^(?!\\s)(?!.*\\s$)[a-zA-Z\s]+$/;
  const regexKor = /^(?!\\s)(?!.*\\s$)[가-힣!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+$/
  const regexExEng = /^(?!\\s)(?!.*\\s$)[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+$/;
  const regexExKor = /^(?!\\s)(?!.*\\s$)[가-힣0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+$/;
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
  console.log(Players)
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
function changePage(x) {
  $(".menu").hide();
  $(".menu").eq(x).show();
  if (x == 1) {
    openQuiz();
  }
  //만약 page4라면 window.close()해줌
  if (x == 3) {
    window.close();
  }
}

function MoveTo_menu(x) {
  $('#main').hide();
  changePage(x);
}

function BackTo_menu() {
  $('.menu').hide();
  $('#main').show();
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
      console.log(User.Score);
    } else { // 없음
      var NewUser = { ID: textField, Score: 0 };
      Players.push(NewUser);
      User = NewUser;
      console.log(User.Score);
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
// if (QUIZTYPE == 1) {
//   for (let i = 0; i < 10 ; i++) {
//     quizNum[i] = shuffledWords[i];
//   }
// }
// if (QUIZTYPE == 2) {
//   quizNum = shuffledWords;
// }

let quizIdx; //퀴즈 번호
let quizNum; //퀴즈 문항 배열
let quizScore; // 퀴즈 점수
var QUIZTYPE; // 퀴즈/미니게임 구분
var quizTime = 60; // 미니게임 제한시간
var timer; // 미니게임 제한시간 interval
var optionCount = 4;

function  resetQuiz() {
  quizScore = 0;
  quizNum = [];
  $("#quiz-main").show();
  $("#quiz-end").hide();
  $("#score-div").text("점수: 0");
}

function openQuiz() {
  if (Words.length >= 10) {
    QUIZTYPE = 1;
    initQuiz();
  }
  else {
    alert("퀴즈를 진행하려면 영단어가 10개 이상 있어야 합니다.")
    BackTo_menu();
  }
}

function initQuiz() { //퀴즈 문항 초기화
  if (quizTime == 60) {
    resetQuiz();
  }
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
  if (QUIZTYPE == 1) {
    for (let i = 0; i < 10 ; i++) {
      quizNum[i] = shuffledWords[i];
    }
  }
  if (QUIZTYPE == 2) {
    quizNum = shuffledWords;
  }
  generateQuiz();
}

function generateQuiz() { //퀴즈 생성
  $("#quiz-word").text(Words[quizNum[quizIdx]].English);
  $("#quiz-console").text(" ");
  let options = [];
  const wordLength = Words.length;
  //선지 생성
  options[0] = quizNum[quizIdx];
  for (let i = 1; i < optionCount ; i++) {
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
  for (let i = 0 ; i < optionCount ; i++) {
    $("#quiz-option-frame").append("<button class='quiz-option' onclick='selectOption(" + i + ")'>" + Words[options[i]].Korean + "</button>");
  }
}

function selectOption(idx) {
  if ($("#quiz-option-frame > button").eq(idx).text() == Words[quizNum[quizIdx]].Korean) {
    $("#quiz-option-frame > button").eq(idx).css("background-color", "lime");
    $("#quiz-console").text("정답입니다.");
    quizScore += 10;
    $("#score-div").text("점수: " + quizScore);
  }
  else {
    $("#quiz-option-frame > button").eq(idx).css("background-color", "red");
    for (let i = 0 ; i < optionCount ; i++) {
      if ($("#quiz-option-frame > button").eq(i).text() == Words[quizNum[quizIdx]].Korean) {
        $("#quiz-option-frame > button").eq(i).css("background-color", "lime");
        $("#quiz-console").text("오답입니다.");
      }
    }
  }
  quizIdx++;
  $(".quiz-option").attr('onclick', '').unbind('click');
  if (QUIZTYPE == 1) {
    if (quizIdx != 10) {
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
  if (QUIZTYPE == 2) {
    if (Words.length == quizIdx) {
      quizEnd();
    }
    else {
      setTimeout(function() {
        generateQuiz();
      }, 0);
    }
  }
}

function quizEnd() {
  $("#quiz-main").hide();
  $("#quiz-end").show();
  $("#quiz-end-score").text("점수: " + quizScore);
  $("#page2 h2").text("단어퀴즈");
  quizTime = 60;
  clearInterval(timer);
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
  if (Words.length >= 10) {
    QUIZTYPE = 2;
    $("#page3").hide();
    $("#page2").show();
    $("#page2 h2").text("미니게임 : 60s");
    initQuiz();
    timer = setInterval(() => {
      --quizTime;
      $("#page2 h2").text("미니게임 : " + quizTime + "s");
  
      if (quizTime == 0) {
        quizEnd();
      }
    }, 1000);
  }
  else {
    alert("퀴즈를 진행하려면 영단어가 10개 이상 있어야 합니다.")
    BackTo_menu();
  }
}