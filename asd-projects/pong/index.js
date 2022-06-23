/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()

function runProgram() {
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const BOARD_WIDTH = $("#board").width();
  const BOARD_HEIGHT = $("#board").height();
  const KEY = {
    "DOWN": 40,
    "UP": 38,
    "W": 87,
    "S": 83
  }
  // Game Item Objects
  function factory(id) {
    var Padd = {}
    Padd.id = id;
    Padd.x = parseFloat($(id).css("left"));
    Padd.y = parseFloat($(id).css("top"));
    Padd.width = $(id).width();
    Padd.height = $(id).height();
    Padd.speedX = 0;
    Padd.speedY = 0;
    return Padd;
  }

  var paddle1 = factory("#paddleL");
  var paddle2 = factory("#paddleR");
  var ball = factory("#ball");
  var score1 = 0;
  var score2 = 0;
  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keyup', handleKeyUp);
  $(document).on('keydown', handleKeyDown);                           // change 'eventType' to the type of event you want to handle
  startBall();
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    reposition();
    redraw();
    bounce(ball);
    scoreCheck();
    if (doCollide(ball, paddle1) === true) {
      paddBounce()
    }
    if (doCollide(ball, paddle2) === true) {
      paddBounce()
    }
    if (score1 >= 11) {
      endGame();
    }
    if (score2 >= 11) {
      endGame();
    }
  }

  /* 
  Called in response to events.
  */
  function handleKeyUp(event) {
    if (event.which === KEY.UP) {
      paddle1.speedY = 0;
    } if (event.which === KEY.DOWN) {
      paddle1.speedY = 0;
    } if (event.which === KEY.W) {
      paddle2.speedY = 0;
    } if (event.which === KEY.S) {
      paddle2.speedY = 0;
    }
  }
  function handleKeyDown(event) {
    if (event.which === KEY.UP) {
      paddle1.speedY = -5;
    } if (event.which === KEY.DOWN) {
      paddle1.speedY = 5;
    } if (event.which === KEY.W) {
      paddle2.speedY = -5;
    } if (event.which === KEY.S) {
      paddle2.speedY = 5;
    }


  }
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  function startBall() {
    var randomNum = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedX = randomNum;
    var randomCharacter = (Math.random() * 3 + 2) * (Math.random() > 0.5 ? -1 : 1);
    ball.speedY = randomCharacter
    ball.x = 675
    ball.y = 300
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  function reposition() {
    paddle1.y += paddle1.speedY
    paddle2.y += paddle2.speedY
    ball.x += ball.speedX
    ball.y += ball.speedY
  }
  function redraw() {
    $(paddle1.id).css("top", paddle1.y);
    $(paddle2.id).css("top", paddle2.y);
    $(ball.id).css("top", ball.y);
    $(ball.id).css("left", ball.x);
  }

  function bounce(ball) {
    if (ball.y < 0) {
      ball.y = 0;
      ball.speedY *= -1;
    }
    else if (ball.y > BOARD_HEIGHT) {
      ball.y = BOARD_HEIGHT;
      ball.speedY *= -1;
    }
    if (paddle1.y > BOARD_HEIGHT) {
      paddle1.speedY *= -1
    }
    else if (paddle1.y < 0) {
      paddle1.speedY *= -1
    }
    if (paddle2.y > BOARD_HEIGHT) {
      paddle1.speedY *= -1
    }
    else if (paddle2.y < 0) {
      paddle2.speedY *= -1
    }
  }
  function paddBounce() {
    ball.speedX *= -1;
  }
  function scoreCheck() {
    if (ball.x > BOARD_WIDTH) {
      score1 += 1;
      startBall()
    }
    else if (ball.x < 0) {
      score2 += 1;
      startBall()
    }
    $("#scorePlay1").text(score1);
    $("#scorePlay2").text(score2);
  }
  function doCollide(square1, square2) {
    square1.leftX = square1.x;
    square1.topY = square1.y;
    square1.rightX = square1.x + square1.width;
    square1.bottomY = square1.y + square1.height


    square2.leftX = square2.x;
    square2.topY = square2.y;
    square2.rightX = square2.x + square2.width;
    square2.bottomY = square2.y + square2.height;

    if (square1.rightX > square2.leftX &&
      square1.leftX < square2.rightX &&
      square1.topY < square2.bottomY &&
      square1.bottomY > square2.topY) {
      return true;
    }
    else {
      return false;
    }
  }
}
