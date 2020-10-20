var myCharacter;
var ground;
var obstacles;
var tps =100;
var key;
var myGameArea = {
  context: null,
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 900;
    this.canvas.height = 700; //the size of the game screen
    this.context = this.canvas.getContext("2d");

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 1000/tps); //to make the game go faster or slower change this interval
    window.addEventListener('keydown', function (e) {
      key = e.key;
     })
     window.addEventListener('keyup', function (e) {
       key = false;
     })  
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
  }
  update = function () {
    let ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  clear = function () {
    let ctx = myGameArea.context;
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}

function startGame() {
  myGameArea.start();
  myCharacter = new Character();
  ground = new Component(900, 300, "green", 0, 400);
  obstacles = [new Obstacle()];
}
class Character extends Component{
  charGrounded = true;
  yVelocity = 0;
  gravity = 5;
  jumpStrength = 400;
  constructor(){
    super(30, 50, "black", 10, 350);
  }
  move = function (){
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
class Obstacle extends Component {

  constructor() {
    super(30, 50, "red", myGameArea.canvas.width, 350);
  }

  move = function () {
    this.x -= 1;
  };
}

function updateGameArea() {
  myCharacter.clear(); //we use myCharacter.clear() instead of myGameArea.clear() because we don't want the ground to clear
  for (let ob of obstacles) {
    ob.clear();
  }
  ground.x += 1;
  ground.update();
  myCharacter.move();
  for (let ob of obstacles) {
    ob.move();
    ob.update();
  }
}
