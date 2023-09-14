$(document).ready(() => {
  function changePage(x) {
    const pages = ["default", "page1", "page2", "page3"];
    for (i = 0; i < pages.length; i++) {
      if (i == x) {
        $('#' + pages[i]).show();
      }
      else {
        $('#' + pages[i]).hide();
      }
    }
  }

  $("h1").click(() => {
    changePage(0);
  });

  $("#btn1").click(() => {
    changePage(1);
  });

  $("#btn2").click(() => {
    changePage(2);
  });

  $("#btn3").click(() => {
    changePage(3);
  });
});