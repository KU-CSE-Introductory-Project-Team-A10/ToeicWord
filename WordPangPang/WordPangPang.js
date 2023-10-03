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

  Search_word();  

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

function Search_word(){
  


  const now_word = document.getElementById("search-field").value;

  var searched_word = [];
  table_body = document.getElementById("wordtable-body");
  table_body.innerHTML = '';

  for (var i = 0; i < Words.length; i++) {

      if(Words[i].English.includes(now_word)){
  
          searched_word.push(Words[i]);
      }

      else if(Words[i].Korean.includes(now_word)){
  
          searched_word.push(Words[i]);
      }
  }

  searched_word.sort(function (a, b) {
            return a.English.localeCompare(b.English);
        });

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


  var mainInfoElements = document.querySelectorAll("#main-info");

 
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