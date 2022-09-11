function initializeVariables(difficulty) {
  if (difficulty == "Easy") {
    totalR = 5;
    totalC = 5;
    totalFilledBoxCount = 12;
  } else if (difficulty == "Medium") {
    totalR = 10;
    totalC = 10;
    totalFilledBoxCount = 50;
  } else if (difficulty == "Hard") {
    totalR = 15;
    totalC = 15;
    totalFilledBoxCount = 150;
  }
}

function scaleIfNedded() {
  let scaleAmount = 1;

  if (
    !(
      parseInt($("#tableContainer").css("height")) >
      parseInt(
        $("#playScreen").css("height") ||
          parseInt($("#tableContainer").css("width")) >
            parseInt($("#playScreen").css("width"))
      )
    )
  ) {
    $("#tableContainer").css("transform", `scale(${scaleAmount})`);
  } else
    while (
      parseInt($("#tableContainer").css("height")) * scaleAmount >
      parseInt(
        $("#playScreen").css("height") ||
          parseInt($("#tableContainer").css("width")) * scaleAmount >
            parseInt($("#playScreen").css("width"))
      )
    ) {
      scaleAmount -= 0.05;
      $("#tableContainer").css("transform", `scale(${scaleAmount})`);
    }
}

function difficultyButtonCssChanges(e) {
  let difficulty = $(e)
    .html()
    .replaceAll("\n", "")
    .replaceAll("            ", "")
    .replaceAll("          ", "");

  $(".DifficultyButton").css({
    "background-color": "aliceblue",
    transform: "scale(1)",
  });

  if (difficulty == "Easy") {
    $(e).css({
      "box-shadow": "2px 2px 4px black",
      "background-color": "lightgreen",
      "text-shadow": "1.5px 1.5px 1.5px white",
      transform: "scale(1.2)",
    });
  } else if (difficulty == "Medium") {
    $(e).css({
      "box-shadow": "2px 2px 4px black",
      "background-color": "yellow",
      "text-shadow": "1.5px 1.5px 1.5px white",
      transform: "scale(1.2) ",
    });
  } else if (difficulty == "Hard") {
    $(e).css({
      "box-shadow": "2px 2px 4px black",
      "background-color": "orangered",
      "text-shadow": "1.5px 1.5px 1.5px white",
      transform: "scale(1.2) ",
    });
  }
}

function changeCurDifficulty(element) {
  // change css properties
  difficultyButtonCssChanges(element);

  // change difficulty
  element = $(element)
    .html()
    .replaceAll("\n", "")
    .replaceAll("            ", "")
    .replaceAll("          ", "");
  currentDifficulty = element;
}

function startScreenStartGame() {
  if (currentPage == "start") {
    $("#playScreenContainer").css({ display: "block", opacity: "1" });
    $("#startScreenContainer").animate({ opacity: 0 }, 1000, function () {
      $("#startScreenContainer").css("display", "none");

      // change zindex for animation
      $("#startScreenContainer").css("z-index", "0");
      $("#playScreenContainer").css("z-index", "1");
      $("#endScreenContainer").css("z-index", "2");
    });
    currentPage = "end";

    startGame(currentDifficulty);
  }
}

function gameFinish() {
  setTimeout(function () {
    // display end screen
    $("#endScreenContainer").css("display", "flex");
    $("#endScreenContainer").animate({ opacity: "1" }, 500);
  }, 500);
  console.log("Game Over Congratulations");
}

function generateBoxes() {
  // generate box and append
  for (let r = 0; r < totalR; r++) {
    if (r == 0) {
      $("#tableContainer").append(`<div id="garbageBox"></div>`);

      for (let c = 0; c < totalC; c++)
        $("#tableContainer").append(
          `<div id="boxInfoColumnWise-${c}" class="boxInfoContainerColumnWise">${c}</div>`
        );
    }

    $("#tableContainer").append(
      `<div id="boxInfoRowWise-${r}"  class="boxInfoContainerRowWise">${r}</div>`
    );

    for (let c = 0; c < totalC; c++) {
      // `<div id="${r}-${c}" class="box">${r}-${c}</div>`
      $("#tableContainer").append(`<div id="${r}-${c}" class="box"></div>`);
    }
  }
}

function adjustContainerSize() {
  let width =
    parseInt($(".box").css("width")) * totalC +
    parseFloat($(".boxInfoContainerRowWise").css("width"));
  let height =
    parseInt($(".box").css("height")) * totalR +
    parseFloat($(".boxInfoContainerColumnWise").css("height"));
  $("#tableContainer").css({ width: `${width}px`, height: `${height}px` });
}

function adjustTableBorders() {
  let thickness = "4px";
  let r = null;
  let c = null;
  $(".box").each(function () {
    r = $(this).attr("id").split("-")[0];
    c = $(this).attr("id").split("-")[1];
    if (c % 5 == 4) $(this).css("border-right", `${thickness} solid black`);
    if (r % 5 == 4) $(this).css("border-bottom", `${thickness} solid black`);
    if (c == 0) $(this).css("border-left", `${thickness} solid black`);
    if (r == 0) $(this).css("border-top", `${thickness} solid black`);
  });

  $(".boxInfoContainerRowWise").each(function () {
    r = $(this).attr("id").split("-")[1];
    if (r % 5 == 4) $(this).css("border-bottom", `${thickness} solid gray`);
    if (r == 0) $(this).css("border-top", `${thickness} solid gray`);
  });

  $(".boxInfoContainerColumnWise").each(function () {
    r = $(this).attr("id").split("-")[1];
    if (r % 5 == 4) $(this).css("border-right", `${thickness} solid gray`);
    if (r == 0) $(this).css("border-left", `${thickness} solid gray`);
  });
}

function fillBoxesRandomly() {
  let filledAr = [];

  for (let i = 0; i < totalFilledBoxCount; i++) {
    let r = Math.floor(Math.random() * totalR);
    let c = Math.floor(Math.random() * totalC);
    let str = r + "-" + c;
    if (filledAr.includes(str)) {
      i--;
    } else {
      filledAr.push(str);
    }
  }

  for (let i = 0; i < totalFilledBoxCount; i++) {
    $(`#${filledAr[i]}`).addClass("mustFilled");
  }

  // unfill otherboxes
  $(".box").each(function () {
    if (!$(this).hasClass("mustFilled")) $(this).addClass("mustUnFilled");
  });

  // cheat
  // $(".mustFilled").css("background-color", "red");
}

function fillInfoBoxes() {
  let count = 0;
  let ar = null;

  for (let r = 0; r < totalR; r++) {
    count = 0;
    ar = [];

    for (let c = 0; c < totalC; c++) {
      if ($(`#${r}-${c}`).hasClass("mustFilled")) count++;

      if (!$(`#${r}-${c}`).hasClass("mustFilled") || c + 1 == totalC) {
        ar.push(count);
        count = 0;
      }
    }

    for (let i = 0; i < ar.length; i++)
      if (ar[i] == 0) {
        ar.splice(i, 1);
        i--;
      }

    $(`#boxInfoRowWise-${r}`).html("");
    for (let i = 0; i < ar.length; i++)
      $(`#boxInfoRowWise-${r}`).append(
        `<div class="InfoCountBox">${ar[i]}</div>`
      );
  }

  for (let c = 0; c < totalC; c++) {
    count = 0;
    ar = [];

    for (let r = 0; r < totalR; r++) {
      if ($(`#${r}-${c}`).hasClass("mustFilled")) count++;

      if (!$(`#${r}-${c}`).hasClass("mustFilled") || r + 1 == totalR) {
        ar.push(count);
        count = 0;
      }
    }

    for (let i = 0; i < ar.length; i++)
      if (ar[i] == 0) {
        ar.splice(i, 1);
        i--;
      }

    $(`#boxInfoColumnWise-${c}`).html("");
    for (let i = 0; i < ar.length; i++)
      $(`#boxInfoColumnWise-${c}`).append(
        `<div class="InfoCountBox" >${ar[i]}</div>`
      );
  }

  // insert 0
  for (let r = 0; r < totalR; r++) {
    if ($(`#boxInfoRowWise-${r}`).html() == "")
      $(`#boxInfoRowWise-${r}`).append(`<div class="InfoCountBox" >0</div>`);
  }
  for (let c = 0; c < totalC; c++) {
    if ($(`#boxInfoColumnWise-${c}`).html() == "")
      $(`#boxInfoColumnWise-${c}`).append(`<div class="InfoCountBox" >0</div>`);
  }
}

function checkEndGame() {
  // all of the filled and unfilled box should be same
  let pass = true;
  let filledCount = $(".filled").length;
  let mustUnFilledCount = totalC * totalR - filledCount;
  let unfilledCount = $(".unfilled").length;
  let childCount = null;
  let str = null;
  let mustAr = null;
  let userAr = null;
  let count = null;

  // first check the counts
  if (filledCount == totalFilledBoxCount) {
    // secondly check all the boxes info boxes and box itself
    // check rows
    for (let r = 0; r < totalR; r++) {
      mustAr = [];
      childCount = $(`#boxInfoRowWise-${r}`).children().length;
      for (let i = 0; i < childCount; i++) {
        mustAr.push(
          $(`#boxInfoRowWise-${r} > div:nth-child(${i + 1}) `).html()
        );
      }

      if (mustAr[0] == 0) mustAr = [];

      count = 0;
      userAr = [];
      for (let c = 0; c < totalC; c++) {
        if ($(`#${r}-${c}`).hasClass("filled")) {
          count++;
        }

        if (
          (!$(`#${r}-${c}`).hasClass("filled") || c == totalC - 1) &&
          count != 0
        ) {
          userAr.push(count);
          count = 0;
        }
      }

      if (userAr.length == mustAr.length) {
        for (let i = 0; i < userAr.length; i++)
          if (!(userAr[i] == mustAr[i])) pass = false;
      } else pass = false;
    }

    // check columns
    if (pass) {
      for (let c = 0; c < totalC; c++) {
        mustAr = [];
        childCount = $(`#boxInfoColumnWise-${c}`).children().length;
        for (let i = 0; i < childCount; i++) {
          mustAr.push(
            $(`#boxInfoColumnWise-${c} > div:nth-child(${i + 1}) `).html()
          );
        }

        if (mustAr[0] == 0) mustAr = [];

        count = 0;
        userAr = [];
        for (let r = 0; r < totalR; r++) {
          if ($(`#${r}-${c}`).hasClass("filled")) {
            count++;
          }

          if (
            (!$(`#${r}-${c}`).hasClass("filled") || r == totalR - 1) &&
            count != 0
          ) {
            userAr.push(count);
            count = 0;
          }
        }

        if (userAr.length == mustAr.length) {
          for (let i = 0; i < userAr.length; i++)
            if (!(userAr[i] == mustAr[i])) pass = false;
        } else pass = false;
      }
    }

    if (pass) {
      gameFinish();
    }
  }
}

function findMaxRowElement() {
  let max = 0;
  for (let r = 0; r < totalR; r++) {
    if (max < $(`#boxInfoRowWise-${r}`).children().length)
      max = $(`#boxInfoRowWise-${r}`).children().length;
  }

  return max;
}

function findMaxColumnElement() {
  let max = 0;
  for (let c = 0; c < totalC; c++) {
    if (max < $(`#boxInfoColumnWise-${c}`).children().length)
      max = $(`#boxInfoColumnWise-${c}`).children().length;
  }

  return max;
}

function adjustInfoBoxSize() {
  let fixHeight = $(".box").css("height");
  let fixWidth = $(".box").css("width");

  let maxRowElement = findMaxRowElement();
  let maxColumnElement = findMaxColumnElement();

  let infoWidth = $(".InfoCountBox").css("width");
  let infoHeight = $(".InfoCountBox").css("height");
  let extra = 10;

  // fix width and heigth according to the boxes
  $(".boxInfoContainerRowWise").css("height", fixHeight);
  $(".boxInfoContainerColumnWise").css("width", fixWidth);

  // arrange garbage box size
  $("#garbageBox").css({
    width: `${parseFloat(infoWidth) * maxRowElement + extra}px`,
    height: `${parseFloat(infoHeight) * maxColumnElement + extra}px`,
  });

  $(".boxInfoContainerRowWise").css(
    "width",
    `${parseFloat(infoWidth) * maxRowElement + extra}px`
  );

  $(".boxInfoContainerColumnWise").css(
    "height",
    `${parseFloat(infoHeight) * maxColumnElement + extra}px`
  );
}

function adjustPlayGroundSize() {}

function startBoxesClickEvents() {
  $(".box").unbind("mousedown");
  $(".box").mousedown(function (e) {
    if (e.which == 1) {
      // left click
      $(this).removeClass("unfilled");
      $(this).css("background-image", "none");

      if ($(this).hasClass("filled")) {
        $(this).css("background-image", "none");
        $(this).removeClass("filled");
      } else {
        $(this).css("background-image", "url(../Assets/Images/x1.png)");
        $(this).addClass("filled");
      }
    } else if (e.which == 3) {
      // right click
      $(this).removeClass("filled");
      $(this).css("background-image", "none");

      if ($(this).hasClass("unfilled")) {
        $(this).removeClass("unfilled");
        $(this).css("background-image", "none");
      } else {
        $(this).css("background-image", "url(../Assets/Images/o1.png)");
        $(this).addClass("unfilled");
      }
    } else {
      // middle click
      $(this).removeClass("filled");
      $(this).removeClass("unfilled");
      $(this).css("background-image", "none");
    }

    checkEndGame();

    // cheat
    // console.log($(this).attr("class"));
  });
}

function startGame(difficulty) {
  // remove boxes and generate again
  $("#tableContainer").html("");

  // initialize basic settings of game
  initializeVariables(currentDifficulty);

  // generate box and append
  generateBoxes();

  // check each box and set bolder borders
  adjustTableBorders();

  // fill boxes randomly
  fillBoxesRandomly();

  // fill information boxes
  fillInfoBoxes();

  // adjust info box size
  adjustInfoBoxSize();

  // To display box in a order, need to adjust container size
  adjustContainerSize();

  // adjust play ground size to fit screen
  adjustPlayGroundSize();

  // scale table if it is not fit into screen
  scaleIfNedded();

  // boxes click events
  startBoxesClickEvents();
}

document.oncontextmenu = function () {
  return false;
};

$(function () {
  // info box clicks
  $("#endScreenBox").on("click", function (e) {
    e.stopPropagation();
  });

  // close modal click
  $("#endScreenContainer").on("click", function (e) {
    $("#endScreenContainer").animate({ opacity: 0 }, 500, function () {
      $("#endScreenContainer").css("display", "none");
    });
  });

  // return menu screen button click
  $("#menuButtonContainer").on("click", function () {
    if (currentPage == "end") {
      // display start screen, remove end screen and play screen
      $("#startScreenContainer").css({ display: "flex", opacity: "1" });

      $("#playScreenContainer").animate({ opacity: "0" }, 1000, function () {
        $("#playScreenContainer").css("display", "none");
      });

      $("#endScreenContainer").animate({ opacity: "0" }, 1000, function () {
        $("#endScreenContainer").css("display", "none");

        // change zindex for animation
        $("#startScreenContainer").css("z-index", "2");
        $("#playScreenContainer").css("z-index", "0");
        $("#endScreenContainer").css("z-index", "1");
      });
      currentPage = "start";
    }
  });

  // play again button click
  $("#playAgainButtonContainer").on("click", function (e) {
    // remove modal
    $("#endScreenContainer").animate({ opacity: "0" }, 1000, function () {
      $("#endScreenContainer").css({ display: "none" });
    });

    // change opacity of play area
    $("#tableContainer").fadeToggle(1000).fadeToggle(1000);

    setTimeout(function () {
      startGame(currentDifficulty);
    }, 1000);
  });
});

totalR = null;
totalC = null;
totalFilledBoxCount = null;

currentDifficulty = "Easy";
currentPage = "start";
