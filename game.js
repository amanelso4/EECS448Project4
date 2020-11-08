import {Tester} from './tests.js';

var myCharacter;
var ground;
var obstacles;
var tps =100;//to make the game go faster or slower change this interval
var key;
var timer;
var timeLabel;
var time = 60;
var obstacleFreq = .01; // 0-1, smaller = less frequent
var cloudFreq = .005; // 0-1, smaller = less frequent
var minDist = 400; // Minimum distance between obstacles
var currentState = 'M';
var myScore;
var numLevel;
var btn;
var clouds;

/**
 * Object wrapping a 2D context and containing display and update methods.
 */
var myGameArea = {

  context: null,
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 700; //the size of the game screen
    this.context = this.canvas.getContext("2d");
    progressView = document.getElementById("timer");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 1000/tps);
    window.addEventListener('keydown', function (e) {
      key = e.key;
     })
     window.addEventListener('keyup', function (e) {
       key = false;
     })
  },
  /**
   * Clear the display.
   */
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  /**
   * Pause the game.
   */
  stop: function () {
    clearInterval(this.interval);
  }
}



/**
 * Base game object which handles display and collision detection
 */
export class Component {
    /**
     *
     * @param {number} width Width of the object
     * @param {number} height Height of the object
     * @param {string} color The object's color
     * @param {number} x The object's initial x location
     * @param {number} y The object's initial y location
     */
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;

    /**
     * Check if this object is colliding with another.
     *
     * @param {Component} ob The object against which to check for collision.
     */
    this.crashWith = function(ob) {
      var myleft = this.x;
      var myright = this.x + (this.width);
      var mytop = this.y;
      var mybottom = this.y + (this.height);
      var objleft = ob.x;
      var objright = ob.x + (ob.width);
      var objtop = ob.y;
      var objbottom = ob.y + (ob.height);
      var crash = true;
      if ((mybottom < objtop) ||
      (mytop > objbottom) ||
      (myright < objleft) ||
      (myleft > objright)) {
        crash = false;
      }
      return crash;
    }
  }
  /**
    * Draw the object at the current location.
   */
  update = function () {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  /**
   * Remove the object image from the current location.
   */
  clear = function () {
    let ctx = myGameArea.context;
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

/**
 * Create the character and start the game.
 */
function startGame(level) {
  myGameArea.start();
  numLevel = level;
 // ground = new Component(900, 300, "green", 0, 400);
  myCharacter = new Character();
  obstacles = [new Obstacle()];
  clouds = [new Cloud(100,100),new Cloud(400,100)];
  ground = new Component(900, 300, "green", 0, 400);
  timer = setInterval(updateTimer, 1000);

}


/**
 * Render clouds in the game's skybox.
 */
export class Cloud {
radius=30;
xAdjust=[];
yAdjust=[];
circles=7;
speed=3;
    /**
     * @param {number} x The initial x location 
     * @param {number} y The initial y location
     */
  constructor(x,y){
    this.x=x;
    this.y=y+(Math.random() * 80)-80;
    this.circles=Math.floor(Math.random() * 4)+5;
    for(var i=0;i<this.circles;i++){
      var angle = Math.random() * Math.PI*2;
      this.xAdjust[i]=Math.random() * this.radius * Math.cos(angle);
      this.yAdjust[i]=Math.random() * this.radius * Math.sin(angle);
    }
   this.speed =(Math.random() *2)+.1;
  }
   /**
    * Draw the object at the current location.
   */
  update = function () {
    let ctx = myGameArea.context;
    ctx.fillStyle="#F0F0FF";

    for (var i = 0; i < this.circles; i++) {
      ctx.moveTo(this.x,this.y);
      
        ctx.beginPath();
        ctx.arc(this.x +this.xAdjust[i],this.y +this.yAdjust[i], this.radius, 0, Math.PI*2, true);
        ctx.fill();
    }
  }
  /**
   * Move the Cloud across the sky.
   */
  move =function(){
    this.x -= this.speed;
  }
  /**
   * Remove the object image from the current location.
   */
  clear = function () {
    let ctx = myGameArea.context;
    ctx.clearRect(0, 0, myGameArea.canvas.width, 200);
  }
}

/**
 * A game object controlled by the player.
 */
export class Character extends Component{
  crouching =false;
  charGrounded = true;
  yVelocity = 0;
  gravity = 20;
  jumpStrength = 700;
  constructor(){
    super(30, 50, document.getElementById("color").value, 10, 350);
  }
  /**
   * Check for key presses and move the character accordingly.
   */
  move = function (){

    if(key == "s"){
      if(!this.crouching){
        this.y+=25;
      }
      this.crouching=true;
      this.height = 25;

    }else{
      if(this.crouching){
        this.y-=25;
      }
      this.crouching=false;
      this.height = 50;

    }
    if(this.x <=50){
      this.x +=1;
    }
    this.charGrounded = this.y+this.height>=ground.y;
    if(this.charGrounded){
      this.yVelocity=0;
      if(key == "w"){
        this.yVelocity = 0-this.jumpStrength;
      }
    }
    else{
      this.yVelocity += this.gravity;
    }
    //this.y += this.yVelocity/tps; //smoother, but leaves artifacts. Would have to clear entire game area to fix
    this.y += Math.round(this.yVelocity/tps); //still occasionally leaves artifacts.
    this.update();
  }
}

/**
 * A game object which serves as an obstacle for the character to avoid.
 */
export class Obstacle extends Component {
  xSpeed =5;
  ySpeed =0;
  constructor() {
    if(numLevel == 1){
      super(30, 50, "red", myGameArea.canvas.width, 350);
    }
    else {
      if((Math.floor(Math.random() * 10) % 2) == 1)
      {
        if(numLevel==3 && (Math.floor(Math.random() * 10) % 2) == 1){
          super(30, 50, "red", myGameArea.canvas.width, 50);
          if(Math.random()<.5){
            this.ySpeed = 2; //duck to avoid
          }else{
            this.ySpeed = 3; //do nothing to avoid
          }
        }
        else{
        super(30, 50, "red", myGameArea.canvas.width, 350); //used to have super here
        }
      }
      else {
        super(30, 80, "red", myGameArea.canvas.width, 270); //floating obstacle
        
      }
    }
   
  }

  /**
   * Move the object towards the character.
   */
  move = function () {
    this.x -= this.xSpeed;
    this.y -= this.ySpeed;
    if(this.y<=0||(this.y)>=350){
      this.ySpeed *= -1;
    }
  };
}

/**
 * Update and check the game timer to see if the character has won.
 */
/*function updateTimer() {
  timeLeft = timeLeft - 1;
<<<<<<< HEAD
  progressView.innerHTML = timeLeft;
  if(timeLeft === 0){
    myGameArea.stop();
    document.getElementById("gameOver").innerHTML = "You WIN! Refresh to try again!";
  }
}*/

function updateTimer() {
  time = time - 1;
  
  progressView.innerHTML = time; 

  this.canvas.font = "30px Arial";
  this.canvas.fillText(time,800,50); 

  //changetext(time);

  if(time < 0){
    myGameArea.stop();
    clearInterval(timer);
    progressView.innerHTML = "0";
    document.getElementById("gameOver").innerHTML = "You WIN! Refresh to try again!";
  }
=======
  if(numLevel != 4){
    if(timeLeft === 0){
      myGameArea.stop();
      document.getElementById("gameOver").innerHTML = "You WIN! Choose a level to play again!";
      }
    }
>>>>>>> df10bddea55dd9ca00f250d78e4b8da832eb1a45
}
  




/**
 * Run the main game loop.
 */
function updateGameArea() {

  // Check for collisions with player
  for(let ob of obstacles){
    if(myCharacter.crashWith(ob)){
      myGameArea.stop();
<<<<<<< HEAD
      clearInterval(timer);
      document.getElementById("gameOver").innerHTML = "You lose! Refresh to try again!";
=======
      document.getElementById("gameOver").innerHTML = "You lose! Choose a level and try again!";
>>>>>>> df10bddea55dd9ca00f250d78e4b8da832eb1a45
    }
  }

  // Spawn obstacles
  if (Math.random() < obstacleFreq) {
    if (obstacles.length < 1 || myGameArea.canvas.width - obstacles[obstacles.length - 1].x >= minDist) {
        obstacles.push(new Obstacle());
    }
  }
  if(myGameArea.canvas.width - obstacles[obstacles.length - 1].x >= myGameArea.canvas.width*.9){
    obstacles.push(new Obstacle());
  }
<<<<<<< HEAD
  //updateTimer();
=======
  //Spawn clouds
  if (Math.random() < cloudFreq) {
    clouds.push(new Cloud(myGameArea.canvas.width+50,150));
  }
  updateTimer();
>>>>>>> df10bddea55dd9ca00f250d78e4b8da832eb1a45

  
  // Update the character and obstacles
  myCharacter.clear(); //we use myCharacter.clear() instead of myGameArea.clear() because we don't want the ground to clear
  for (let ob of obstacles) {
    ob.clear();
  }
  for (let c of clouds) {
    c.clear();
  }
  ground.x += 1;
  ground.update();
  myCharacter.move();
  for (let c of clouds) {
    c.move();
    c.update();
  }
  for (let ob of obstacles) {
    ob.move();
    ob.update();
  }
}

<<<<<<< HEAD

}
=======
/**
 * Run all tests.
 */
function runTests() {
    let tests = new Tester();
    tests.runTests();
}

document.querySelector("#easy").addEventListener("click", (e) => {
    startGame(1);
});
document.querySelector("#medium").addEventListener("click", (e) => {
    startGame(2);
});
document.querySelector("#hard").addEventListener("click", (e) => {
    startGame(3);
});
document.querySelector("#infinity").addEventListener("click", (e) => {
    startGame(4);
});
document.querySelector("#runTests").addEventListener("click", (e) => {
    runTests();
});
>>>>>>> df10bddea55dd9ca00f250d78e4b8da832eb1a45
