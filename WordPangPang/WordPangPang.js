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



