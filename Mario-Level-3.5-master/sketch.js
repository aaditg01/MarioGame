// Global Variables
let mario, mario_running, mario_collided;
let bg, bgImage;
let brickGroup, brickImage;
let coinsGroup, coinImage;
let coinScore=0;
let obGroup, turtleImage, mushImage, dieSound;
let gameState = "PLAY";
let rbutton, rimage;
let birdsGroup, birdImage;

function preload(){
  mario_running =  loadAnimation("images/mar1.png","images/mar2.png","images/mar3.png",
  "images/mar4.png","images/mar5.png","images/mar6.png","images/mar7.png");
  bgImage = loadImage("images/bgnew.jpg");
  brickImage = loadImage("images/brick.png");
  coinSound = loadSound("sounds/coinSound.mp3");
  coinImage = loadAnimation("images/con1.png","images/con2.png","images/con3.png","images/con4.png","images/con5.png","images/con6.png");
  turtleImage= loadAnimation("./images/tur1.png","./images/tur2.png","./images/tur3.png","./images/tur4.png","./images/tur5.png");
  mushImage=loadAnimation("./images/mush1.png","./images/mush2.png","./images/mush3.png","./images/mush4.png","./images/mush5.png","./images/mush6.png");
  mario_collided = loadAnimation("./images/mariodead.png");
  dieSound= loadSound("./sounds/dieSound.mp3");
  rimage = loadImage("./images/restart.png");
  birdImage = loadImage("./images/bird.png");
}


function setup() {
  // Creation of the Canvas
  createCanvas(1000, 600);

  // Creation of background sprite
  bg = createSprite(580,300);
  bg.addImage(bgImage);
  bg.scale =0.5;
  // bg.velocityX = -6;

  // Creation of mario sprite
  mario = createSprite(200,505,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  // mario.scale =0.3;

  // Creation of ground sprite
  ground = createSprite(200,585,400,10);
  ground.visible = false;

  // Creation of groups 
  bricksGroup = new Group();
  coinsGroup = new Group();
  obGroup = new Group();
  birdsGroup = new Group();

  rbutton = createSprite(500,300); 
  rbutton.addImage(rimage);
  rbutton.scale = 0.5
  rbutton.visible = false;


}

function draw() {
 

  if (gameState==="PLAY"){
  mario.scale = 0.3;
  mario.setCollider("rectangle",0,0,300,500);
  bg.velocityX = -6;

  // Scrolling of background
  if (bg.x < 100){
    bg.x=bg.width/4;
  }

  // Prevent mario from getting out with the bricks
  if(mario.x<200){
    mario.x=200;
  }

  // Prevent mario from moving out frrom top
  if(mario.y<50){
    mario.y=50;
  }

  // Jumping mario with space key
  if(keyDown("space") ) {
    mario.velocityY = -16;
  }

  // Gravity for mario
  mario.velocityY = mario.velocityY + 0.5;

  // Brick generation by calling function
  generateBricks();


  if (mario.isTouching(birdsGroup)){
    dieSound.play();
    gameState = "END";
  }

  // Make the mario step (collide) on bricks
  for(var i = 0 ; i< (bricksGroup).length ;i++){
    var temp = (bricksGroup).get(i) ;    
    if (temp.isTouching(mario)) {
       mario.collide(temp);
      }    
    }

  // Obstacle generation by calling function
    generateObstacles();

  // Coin generation by calling function  
    generateCoins();
    birdGen();

  // Make the mario catch the coins
    for(var i = 0 ; i< (coinsGroup).length ;i++){
      var temp = (coinsGroup).get(i) ;
      if (temp.isTouching(mario)) {
        // Play sound when coin is collected
        coinSound.play();
        // Increase score when coin is collected
        coinScore++;
        // Destroy coin when collected
        temp.destroy();
        temp=null;
        } 
      }
      if (mario.isTouching(obGroup)){
        dieSound.play();
        gameState= "END";
      }
    }
      else if(gameState === "END"){
        bg.velocityX = 0;
        mario.velocityX = 0;
        mario.velocityY = 0;
        mario.changeAnimation("collided", mario_collided);
        mario.scale=0.4;
        mario.setCollider("rectangle", 0,0,300,10);
        mario.y=555;
        coinsGroup.setLifetimeEach(-1);
        obGroup.setLifetimeEach(-1);
        bricksGroup.setLifetimeEach(-1);
        birdsGroup.setLifetimeEach(-1);
        obGroup.setVelocityXEach(0);
        birdsGroup.setVelocityXEach(0);
        birdsGroup.setVelocityYEach(0);
        coinsGroup.setVelocityXEach(0);
        bricksGroup.setVelocityXEach(0);
        rbutton.visible = true;
        rbutton.x=500;
        rbutton.y=300;
      }


      if (mousePressedOver(rbutton)){
        restartGame();
      }


  mario.collide(ground);


  drawSprites();
  textSize(20);
  fill("brown")
  text("Coins Collected: "+ coinScore, 500,50);
  
}


function generateBricks() {
  if (frameCount % 70 === 0) {
    var brick = createSprite(1200,120,40,10);
    brick.y = random(50,450);
    brick.addImage(brickImage);
    brick.scale = 0.5;
    brick.velocityX = -5;
    
    brick.lifetime =250;
    bricksGroup.add(brick);
  }
}


function generateCoins() {
  if(frameCount % 50 === 0){
    var coin = createSprite(1200,120,40,10);
    coin.addAnimation("coin", coinImage);
    coin.y = Math.round(random(80,350));
    coin.scale = 0.1;
    coin.velocityX = -3;
    coin.lifetime = 1200;
    coinsGroup.add(coin);
  }
}

function generateObstacles(){
  if(frameCount % 150 == 0){
    let obstacle = createSprite(1200,545,10,40);
    obstacle.velocityX = -8;
    obstacle.scale = 0.2;
    let rnd = Math.round(random(1,2));
    switch(rnd){
      case 1:
        obstacle.addAnimation("mush",mushImage);
        break;
      case 2:
        obstacle.addAnimation("turt",turtleImage);
        break;
      default:
        break;     
    }
    obGroup.add(obstacle);
    obstacle.lifetime = 400;
  }  
}

function restartGame(){
  gameState = "PLAY";
  bricksGroup.destroyEach() ;
  obGroup.destroyEach() ;
  coinsGroup.destroyEach() ;
  birdsGroup.destroyEach() ;
  mario.changeAnimation("running", mario_running);
  rbutton.visible = false;
  rbutton.x = -10000;
  rbutton.y = -10000;
  coinScore = 0;
  
}

function birdGen(){
  if(frameCount % 150 == 0){
    let bird = createSprite(1000,random(570,600),20,20);
    bird.addImage(birdImage);
    bird.scale=0.6;
    bird.velocityY = -6;
    bird.velocityX = -10;
    bird.lifetime = 1200;
    birdsGroup.add(bird);
  }
}
