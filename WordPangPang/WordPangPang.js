$(document).ready(()=>{
  var isIntegrity = true;
  try{
    Words = JSON.parse(JSON.stringify(ToeicWord)).Words;
  }catch{
    alert("파일을 불러오는 데 실패했습니다.");
    window.close();
  }
  regexEng = /^(?!\\s)(?!.*\\s$)[a-zA-Z\s]+$/;
  regexKor = /^(?!\\s)(?!.*\\s$)[가-힣!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+$/
  regexExEng = /^(?!\\s)(?!.*\\s$)[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+$/;
  regexExKor = /^(?!\\s)(?!.*\\s$)[가-힣0-9!@#$%^&*()_+{}\[\]:;<>,.?~\-\s']+$/;
  for(var i = 0; i<Words.length; i++){
    if(!Words[i].hasOwnProperty('English') || !Words[i].hasOwnProperty('Korean') || !Words[i].hasOwnProperty('ExampleKor') || !Words[i].hasOwnProperty('ExampleEng')){
      isIntegrity = false;
      break;
    }else{

      if(!regexEng.test(Words[i].English) || !regexKor.test(Words[i].Korean) || !regexExEng.test(Words[i].ExampleEng) || !regexExKor.test(Words[i].ExampleKor)){
        isIntegrity = false;
        break;
      }
    }
  }
  if(!isIntegrity){
    alert("파일을 불러오는 데 실패했습니다.");
    window.close();
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
function changePage(x) {
    const pages = ["page1", "page2", "page3", "page4"];
    for (i = 0; i < pages.length-1; i++) {
      if (i == x) {
        $('#' + pages[i]).show();
      }
      else {
        $('#' + pages[i]).hide();
      }
    }
    //만약 page4라면 window.close()해줌
    if(x == 3){
        window.close();
      
    }

  }

function MoveTo_menu(x){
    const menu = ["단어장 열람", "단어퀴즈", "미니 게임", "종료"];
    const menu_btn = ["btn1", "btn2", "btn3", "btn4"];
    //var menu_color = $('#' + menu_btn[x]).css('color', 'green');
    if(confirm("이동하시겠습니까?") == true){
      alert(menu[x] + "(으)로 이동하겠습니다.");
      changePage(x);
      $('#main').hide(); 
    }else{
      alert(menu[x] + "(으)로 이동하지 않겠습니다.");
    }
}

function BackTo_menu(x){
  const page = ["page1", "page2", "page3", "page4"];
  $('#'+page[x]).hide();
  $('#main').show();
}
function Login(){
  var textField = $('#login-field').val();
  const regex = /^[a-zA-Z0-9]{3,16}$/;
  if(regex.test(textField)){
    $('#login-page').hide();
    $('#main').show();
    //파일
    return;
  }
  else{
    alert("잘못된 아이디 형식입니다.");
    document.getElementById("login-field").value=null;
  }


}


