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
  const regexID = /^[a-zA-Z0-9]{3,16}$/;
  const regexScore = /^[0-9]+$/;
  if (isIntegrity) {
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
    else {
      for (var i = 0; i < Players.length; i++) {
        if (!Players[i].hasOwnProperty('ID') || !Players[i].hasOwnProperty('Score')) {
          isIntegrity = false;
          break;
        } else {
          if (!regexID.test(Players[i].ID) || !regexScore.test(Players[i].Score)) {
            isIntegrity = false;
            break;
          } else {
            if (!isDuplicatePlayer(Players[i].ID)) {
              isIntegrity = false;
              break;
            }
          }
        }
      }
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

});
// $(document).ready(() => {



// //   $("#btn1").click(() => {
// //     //$('#btn1').css('background-color', 'green');
// //     changePage(0);
// //     $('#main').hide(); // 버튼 클릭 시 main 요소를 숨김
// //   });

// //   $("#btn2").click(() => {
// //     changePage(1);
// //     $('#main').hide();
// //   });

// //   $("#btn3").click(() => {
// //     changePage(2);
// //     $('#main').hide();
// //   });

// //   $("#btn4").click(() => {
// //     changePage(3);
// //     $('#main').hide();
// //   });

// });
let Words;
let Players; // 사용자들 데이터
let User; // 현 사용자
function changePage(x) {
  const pages = ["page1", "page2", "page3", "page4"];
  for (i = 0; i < pages.length - 1; i++) {
    if (i == x) {
      $('#' + pages[i]).show();
      if (x == 1) {
        initQuiz();
      }
    }
    else {
      $('#' + pages[i]).hide();
    }
  }
  //만약 page4라면 window.close()해줌
  if (x == 3) {
    window.close();

  }

}

function MoveTo_menu(x) {
  const menu = ["단어장 열람", "단어퀴즈", "미니 게임", "종료"];
  const menu_btn = ["btn1", "btn2", "btn3", "btn4"];
  //var menu_color = $('#' + menu_btn[x]).css('color', 'green');
  if (confirm("이동하시겠습니까?") == true) {
    alert(menu[x] + "(으)로 이동하겠습니다.");
    changePage(x);
    $('#main').hide();
  } else {
    alert(menu[x] + "(으)로 이동하지 않겠습니다.");
  }
}

function BackTo_menu(x) {
  const page = ["page1", "page2", "page3", "page4"];
  $('#' + page[x]).hide();
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

let quizIdx; //퀴즈 번호
let quizNum; //퀴즈 문항 배열
let quizScore; // 퀴즈 점수

function initQuiz() { //퀴즈 문항 초기화
  quizIdx = 0;
  quizScore = 0;
  quizNum = [];
  $("#quiz-main").show();
  $("#quiz-end").hide();
  $("#score-div").text("점수: 0");
  const wordLength = Words.length;
  for (let i = 0; i < 10 ; i++) {
    let isUsedNum = false;
    let rand = Math.floor(Math.random()*wordLength);
    for (let j = 0 ; j < i ; j++) {
      if (rand == quizNum[j]) {
        isUsedNum = true;
      }
    }
    if (isUsedNum) {
      i--;
    }
    else {
      quizNum[i] = rand;
    }
  }
  generateQuiz();
}

function generateQuiz() { //퀴즈 생성
  $("#quiz-word").text(Words[quizNum[quizIdx]].English);
  $("#quiz-console").text(" ");
  let options = [];
  const wordLength = Words.length;
  options[0] = quizNum[quizIdx];
  for (let i = 1; i < 4 ; i++) {
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
  for (let i = 0 ; i < 4 ; i++) {
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
    for (let i = 0 ; i < 4 ; i++) {
      if ($("#quiz-option-frame > button").eq(i).text() == Words[quizNum[quizIdx]].Korean) {
        $("#quiz-option-frame > button").eq(i).css("background-color", "lime");
        $("#quiz-console").text("오답입니다.");
      }
    }
  }
  quizIdx++;
  if (quizIdx != 10) {
    setTimeout(function() {
      generateQuiz();
    }, 1500);
  }
  else {
    quizEnd();
  }
}

function quizEnd() {
  $("#quiz-main").hide();
  $("#quiz-end").show();
  $("#quiz-end-score").text("점수: " + quizScore);
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