var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;
var onPlatform;
var isAttack;
var isInCanyon;
var isGunterAngry;

var clouds;
var mountains;
var canyons;
var collectables;
var trees_x;
var treePos_y;
var collectable;
var enemies;
var enemy;
var enemies_x;
var enemyPos_y;
var toRight;
var toLeft;
var enemyBoundsLeft;
var enemyBoundsRight;
var platforms;
var platform;
var gunter;
var timer;

var jumpSound;
var fallSound;
var winSound;
var loseSound;
var backGroundSoundAlreadyPlayed;
var hitSound;




var amountOfCoins; 
var foundCollectables;

var Vyzima;
var lives;
var restart;

function preload(){
      soundFormats('mp3');
      jumpSound = loadSound('jump');
      jumpSound.setVolume(0.2);
      collectSound = loadSound('collect');
      fallSound = loadSound('fall');
      fallSound.setVolume(0.2);
      loseSound = loadSound('lose');
      winSound = loadSound('win');
      backGroundSound = loadSound('1');
      backGroundSound.setVolume(0.5);
      hitSound = loadSound('hit');
      hitSound.setVolume(0.5);

}
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
    setTimeout(startGame(), 3000);
    
}

function draw(){
    if(restart){
        setTimeout(keyPressed(),2000);
        //startGame();
        lives=3; 
    }
    
   
    
	background(100, 155, 255);

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); 
    
    push();
    translate(scrollPos, 0);

    drawClouds();
    
    drawMountains();

    for(var i=0; i<canyons.length; i++){
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    for(var i = 0; i < platforms.length; i++)
        drawPlatform(platforms[i]);
    for(var i=0; i<collectables.length; i++){
        checkCollectable(collectables[i]);
        
    }
    for(var i=0; i<enemies.length; i++){
        checkEnemy(enemies[i]);
    }
    
    
	renderVyzima();
    
    drawEnemies();
	drawGameChar();
    drawTrees();
    drawGunter();
    
    pop();

    if(!Vyzima.isReached || (Vyzima.isReached && foundCollectables.length<collectables.length)){
        if(isLeft && gameChar_y<floorPos_y+25)
        {
            if(gameChar_x > -100)
            {  
                gameChar_x -= 5;
                if(gameChar_x>width * 0.8 ||(gameChar_x > -100 && gameChar_x<0.2*width)){
                   scrollPos += 5;   
                }
            }
            
        }
    }
    if(!Vyzima.isReached && gameChar_x <= Vyzima.x_pos){
        if(isRight && gameChar_y<floorPos_y+25)
        {
            if(gameChar_x < width * 0.8 && gameChar_x>0.2*width)
                gameChar_x  += 5;
            
            else
            {
                  scrollPos -= 5;   
                  gameChar_x += 5; 
            }
        }
    }
    
    drawGameScore();
    for(i=1; i<=lives; i++)
        drawLives(width-40*i);
    checkVyzima();
    timer += 1;

    checkPlayerDie();
    if(timer >= 90000 && Math.abs(gunter.x_pos - gameChar_x) <= 50){
        gameChar_x = gunter.x_pos - 20;
        fill(250,0,0);
        rect(gameChar_x - 10, gameChar_y, 30, -100)
        lives-=3;
    }
    
    fill(0);
    rect(-80,floorPos_y, 40, - 400);
}
function startGame(){
   	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    timer = 0;
    loseSound.stop();
	scrollPos = 0;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    onPlatform = false;
    isJumping = false;
    isAttack = false;
    isInCanyon = false;
    isGunterAngry = false;
    
    toRight = true;
    toLeft = false;
  
    fallSoundAlreadyPlayed = false;   
    loseSoundAlreadyPlayed = false;
    winSoundAlreadyPlayed = false;
    jumpSoundAlreadyPlayed = false;
    backGroundSoundAlreadyPlayed = false;
    hitSoundAlreadyPlayed = false;
    
    gunter = {x_pos: 3800, y_pos:floorPos_y + 4};
    enemies = []
    enemy = {x_pos: 400, y_pos: floorPos_y + 4}
        for(var i = 0; i < 12; i++){
        var enemyDuble = Object.assign({}, enemy);
        enemyDuble.x_pos = 350+i*600;
        enemies.push(enemyDuble);
    }
    enemyBoundsLeft = [];
    enemyBoundsRight = [];
    for (let i = 0; i < enemies.length; i++){
        enemyBoundsLeft[i] = enemies[i].x_pos - 40;
        enemyBoundsRight[i] = enemies[i].x_pos + 60;
    }
    trees_x = [];
    for(var i = 0; i < 12; i++){
        trees_x.push(50+i*300)
    }
    treePos_y = floorPos_y - 160;    
    clouds = [];
    cloud = {x_pos: 200, y_pos: 100, rad: 50}
    for(var i = 0; i < 10; i++){
        var cloudDuble = Object.assign({}, cloud);
        cloudDuble.x_pos = 100+i*400;
        cloudDuble.y_pos = 200;
        clouds.push(cloudDuble);
    }
    
    mountains = [];
    mountain = {x_pos: 20, width: random(200,300)}
    for(var i = 0; i < 7; i++){
        var mountainDuble = Object.assign({}, mountain);
        mountainDuble.x_pos = 100+i*700;
        mountainDuble.width = random(200,300);
        mountains.push(mountainDuble);
    }
    
    canyons = [];
    canyon = {x_pos: 180, width: 200}
    for(var i = 0; i < 6; i++){
        canyonDuble = Object.assign({}, canyon);
        canyonDuble.x_pos = 100+i*600;
        canyons.push(canyonDuble);
    }
    
    platforms = [];
    platform = {x_pos: 180, y_pos: floorPos_y - 20}
        for(var i = 0; i < 6; i++){
        platformDuble = Object.assign({}, platform);
        platformDuble.x_pos = 170+i*600;
        platforms.push(platformDuble);
    }
    
    collectables = [];
    collectable = {x_pos: 200, y_pos: 390, rad1: 20, rad2: 15};
    for(var i = 0; i < 10; i++){
        var collectableDuble = Object.assign({}, collectable);
        collectableDuble.x_pos = 200+i*400;
        collectables.push(collectableDuble);
    }

    Vyzima ={x_pos: 4000, isReached: false}
    
    
    foundCollectables = [];
    amountOfCoins = 0;
}
function keyPressed(){
    
     if(keyCode == 37)
        isLeft = true;
    if(keyCode == 77 && !backGroundSoundAlreadyPlayed){
        backGroundSoundAlreadyPlayed = true;
        backGroundSound.play();
    }
    if(keyCode == 78 && backGroundSoundAlreadyPlayed){
        backGroundSoundAlreadyPlayed = false;
        backGroundSound.stop();
    }
    
    if(keyCode == 39)
        isRight = true;
    
     if(keyCode == 38)
        isPlummeting = true;
     
    if(keyCode == 13)
        restart = true;
    
    if(keyCode == 84)
       isAttack = true;
    
	console.log("press" + keyCode);
	console.log("press" + key);

}

function keyReleased(){
    if(keyCode == 37)
        isLeft = false;
    
    if(keyCode == 39)
        isRight = false;
    
    if(keyCode == 38)
        isPlummeting = false;
    
    if(keyCode == 13)
        restart = false;
    
    if(keyCode == 84)
       isAttack = false;

	console.log("release" + keyCode);
	console.log("release" + key);

}
function drawLives(x_pos){
    var y_pos = 100;
    var scale = 1.5;
    fill(200);
    noStroke();
    rect(x_pos - 6, y_pos - 42 - 25, 12*scale, 12*scale);
    fill(228,235,191);
    rect(x_pos - 5, y_pos - 40 -25, 10*scale, 10*scale);

}
function drawGameScore(){
    textSize(20);
    text("Tossed coins: " + amountOfCoins, 50, 40);
}
function renderVyzima(){
    fill(128,128,128);
    strokeWeight(4);
    rect(Vyzima.x_pos, floorPos_y - 400, 100, 400);
    rect(Vyzima.x_pos, floorPos_y - 250, 300, 250);

        
}
function checkVyzima(){
    if(gameChar_x >= Vyzima.x_pos && foundCollectables.length >= collectables.length)
        Vyzima.isReached = true;
    if(Vyzima.isReached == true)
            victory(); 
        
}

function victory(){
    fill(255, 215, 0);
    rect(0,0, width, height);
    fill(255);
    textSize(40);
    text("Well done, you can enter the capital of free Temeria!", width/2 - 500, height/2);
    text("Press F5 to play again", width/2 - 150, height/2 + 60);
    winSound.play();
    noloop
}
function lose(){
    fill(0);
    rect(0,0, width, height);
    fill(255,0,0);
    textSize(50);
    text("You're dead!", width/2 - 200, height/2);
    text("Press enter to restart!", width/2 - 200, height/2 + 60);
    if(!loseSoundAlreadyPlayed){
        loseSoundAlreadyPlayed = true;
        loseSound.play();
    }
    
} 
function try_again(){
    fill(255, 69, 0);
    rect(0, floorPos_y-250, width, 100);
    fill(255);
    textSize(40);
    text("Go back and get more money to pass!", width/2, height/2);
}

function drawGameChar(){
    if(onPlatform){
        standingFacing();
    }
    else if(isInCanyon){
        standingFacing();
        gameChar_y += 10;
        jumpSound.stop();
    }
    else if(isLeft && isPlummeting)
	{
        jumpingToTheLeft();
        
	}
    
	else if(isRight && isPlummeting)
	{
       jumpingToTheRight();
	}
    
	else if(isLeft)
	{
        if(isAttack)
	{
        walkingLeft();
        fill(0);
        rect(gameChar_x, gameChar_y - 36,- 40, 3);
	}
        else
            walkingLeft();
	}
    
	else if(isRight)
	{
        if(isRight && isAttack)
	{
            walkingRight();
            fill(0);
            rect(gameChar_x, gameChar_y - 36, 40, 3);
	}
        else
            walkingRight();
    }
	else if((isPlummeting) && !onPlatform)
	{
       jumpingFacing();
        if(!jumpSoundAlreadyPlayed){
            jumpSound.play();
            jumpSoundAlreadyPlayed = true;
        }
    }
    else if((isPlummeting) && onPlatform)
	{
       standingFacing();
        if(!jumpSoundAlreadyPlayed){
            jumpSound.play();
            jumpSoundAlreadyPlayed = true;
        }
	}

    if(isFalling && gameChar_y >= floorPos_y + 4){
		isJumping = true;
        jumpSound.play();
	}
    else if(isPlummeting && gameChar_y > floorPos_y){
        if(gameChar_y <= floorPos_y+30)
            gameChar_y-=100;
    }
    else if(!isPlummeting && !isLeft && !isRight)
	{
        standingFacing();
	}
    for(var i = 0; i < platforms.length; i++){
        if(gameChar_x >= platforms[i].x_pos && gameChar_x <= platforms[i].x_pos + 50 && gameChar_y >= platforms[i].y_pos - 10){
            if(isPlummeting){
                gameChar_y -= 100;
                jumpSound.play();
            }

            else
                gameChar_y = platforms[i].y_pos - 10;
            onPlatform = true;
        }
        else
            onPlatform = false;
    }
    
    
    if(gameChar_y<=floorPos_y){
        isFalling = true;
        gameChar_y+=4;
    }
    else{
        isFalling = false;
    }
}
function standingFacing(){
     //Witcher
        //FEET
        fill(100,0,0);
        rect(gameChar_x - 7, gameChar_y, 5, -25);
        rect(gameChar_x + 7, gameChar_y, -5, -25);
        //SHOES
        fill(25,62,63);
        rect(gameChar_x - 7, gameChar_y, 5, -8);
        rect(gameChar_x + 7, gameChar_y, -5, -8);
        //Updating variables
        //gameChar_x = 45;
        //gameChar_y -= 25;
        //BODY
        fill(50,50,50);
        rect(gameChar_x - 10, gameChar_y-25, 20, -15);
        fill(101,67,33);
        quad(gameChar_x - 10, gameChar_y - 15 - 25, gameChar_x - 15, gameChar_y - 30 - 25,gameChar_x + 15, gameChar_y - 30 - 25, gameChar_x+10, gameChar_y - 15 - 25);
                for (var i = gameChar_x-6; i < gameChar_x + 10; i+=4){
                    for (var j = gameChar_y - 26 - 25; j < gameChar_y- 15 - 25; j+=4){
                        noFill();
                        strokeWeight(1);
                        stroke(255)
                        ellipse(i,j,1,1)}
            }
        //Updating variables
        //gameChar_x = 45;
        //gameChar_y -= 30;
        //HEAD
        fill(200);
        noStroke();
        rect(gameChar_x - 6, gameChar_y - 42 - 25, 12, 12);
        fill(228,235,191);
        rect(gameChar_x - 5, gameChar_y - 40 -25, 10, 10);
        fill(231,108,86);
        beginShape();
        vertex(gameChar_x+3, gameChar_y - 32 -25);
        vertex(gameChar_x+4, gameChar_y - 34 -25);
        vertex(gameChar_x+3, gameChar_y - 36 -25);
        vertex(gameChar_x+4, gameChar_y - 38 -25);
        endShape();

        //SWORDS
        noFill();
        stroke(100);
        beginShape();
        vertex(gameChar_x - 10, gameChar_y - 30 -25);
        vertex(gameChar_x - 15, gameChar_y - 40 -25);
        vertex(gameChar_x - 10, gameChar_y-30 -25);
        endShape();
        beginShape();
        vertex(gameChar_x - 7, gameChar_y-30 -25);
        vertex(gameChar_x - 12, gameChar_y - 40 -25);
        vertex(gameChar_x - 7, gameChar_y - 30 -25);
        endShape(); 

        //ARMS
        fill(151,100,60);
        noStroke();

        //LEFT
        beginShape();
        vertex(gameChar_x - 15, gameChar_y - 30 -25);
        vertex(gameChar_x - 12, gameChar_y + 5 - 30 -25);
        vertex(gameChar_x - 12, gameChar_y + 20 - 30 -25);
        vertex(gameChar_x - 15, gameChar_y + 20 - 30 -25);
        vertex(gameChar_x - 15, gameChar_y- 30 -25);
        endShape(); 

        //RIGHT
        beginShape();
        vertex(gameChar_x + 15, gameChar_y - 30 -25);
        vertex(gameChar_x + 12, gameChar_y + 5 - 30 -25);
        vertex(gameChar_x + 12, gameChar_y + 20 - 30 -25);
        vertex(gameChar_x + 15, gameChar_y + 20 - 30 -25);
        vertex(gameChar_x + 15, gameChar_y - 30 -25);
        endShape(); 
    }
function jumpingFacing(){

	//gameChar_x = 245;
	//gameChar_y = 129;
    //FEET
    fill(100,0,0);
    beginShape();
    vertex(gameChar_x - 7, gameChar_y);
    vertex(gameChar_x - 7 + 5, gameChar_y - 14);
    vertex(gameChar_x - 8, gameChar_y - 25);
    vertex(gameChar_x - 7 + 5, gameChar_y - 25);
    vertex(gameChar_x - 7 + 10, gameChar_y - 14);
    vertex(gameChar_x - 7 + 5, gameChar_y);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -25);
    //rect(gameChar_x + 7, gameChar_y, -5, -25);
    beginShape();
    vertex(gameChar_x + 2, gameChar_y );
    vertex(gameChar_x + 7, gameChar_y - 14);
    vertex(gameChar_x + 2, gameChar_y - 25);
    vertex(gameChar_x + 8, gameChar_y - 25);
    vertex(gameChar_x + 12, gameChar_y - 14);
    vertex(gameChar_x + 7, gameChar_y);
    endShape();
    //SHOES
    fill(25,62,63);
    beginShape();
    vertex(gameChar_x - 7, gameChar_y);
    vertex(gameChar_x - 7 + 5, gameChar_y);
    vertex(gameChar_x + 0.7, gameChar_y - 7);
    vertex(gameChar_x - 5, gameChar_y - 7);
    vertex(gameChar_x - 7, gameChar_y);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -8);
    beginShape();
    vertex(gameChar_x + 7, gameChar_y);
    vertex(gameChar_x + 7 - 5, gameChar_y);
    vertex(gameChar_x + 4 , gameChar_y - 7);
    vertex(gameChar_x + 9.7, gameChar_y - 7);
    vertex(gameChar_x + 7, gameChar_y);
    endShape();
    //rect(gameChar_x + 7, gameChar_y, -5, -8);
    //Updating variables
    //gameChar_x = 245;
	//gameChar_y -= 25;
    //BODY
    fill(50,50,50);
    rect(gameChar_x - 10, gameChar_y - 25, 20, -15);
    fill(101,67,33);
    quad(gameChar_x - 10, gameChar_y - 15 - 25, gameChar_x - 15, gameChar_y - 30 - 25,gameChar_x + 15, gameChar_y - 30 - 25, gameChar_x+10, gameChar_y - 15 - 25);
            for (var i = gameChar_x-6; i < gameChar_x + 10; i+=4){
                for (var j = gameChar_y - 26 - 25; j < gameChar_y- 15 - 25; j+=4){
                    noFill();
                    strokeWeight(1);
                    stroke(255)
                    ellipse(i,j,1,1)}
        }
    //Updating variables
    //gameChar_x = 245;
	//gameChar_y -= 30;
    //HEAD
    fill(200);
    noStroke();
    rect(gameChar_x - 6, gameChar_y - 12 -55, 12, 12);
    fill(228,235,191);
    rect(gameChar_x - 5, gameChar_y - 10 -55, 10, 10);
    fill(231,108,86);
    beginShape();
    vertex(gameChar_x+3, gameChar_y - 2 -55);
    vertex(gameChar_x+4, gameChar_y - 4 -55);
    vertex(gameChar_x+3, gameChar_y - 6 -55);
    vertex(gameChar_x+4, gameChar_y - 8 -55);
    endShape();
    
    //SWORDS
    noFill();
    stroke(100);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y -55);
    vertex(gameChar_x - 15, gameChar_y - 10 -55);
    vertex(gameChar_x - 10, gameChar_y -55);
    endShape();
    beginShape();
    vertex(gameChar_x - 7, gameChar_y -55);
    vertex(gameChar_x - 12, gameChar_y - 10 -55);
    vertex(gameChar_x - 7, gameChar_y -55);
    endShape(); 
    
    //ARMS
    fill(151,100,60);
    noStroke();
    
    //LEFT
    beginShape();
    vertex(gameChar_x - 15, gameChar_y -55);
    vertex(gameChar_x - 12, gameChar_y + 5 -55);
    vertex(gameChar_x - 12, gameChar_y + 20 -55);
    vertex(gameChar_x - 15, gameChar_y + 20 -55);
    vertex(gameChar_x - 15, gameChar_y -55);
    endShape(); 
    
    //RIGHT
    beginShape();
    vertex(gameChar_x + 15, gameChar_y -55);
    vertex(gameChar_x + 12, gameChar_y + 5 -55);
    vertex(gameChar_x + 12, gameChar_y + 20 -55);
    vertex(gameChar_x + 15, gameChar_y + 20 -55);
    vertex(gameChar_x + 15, gameChar_y -55);
    endShape(); 

}
function walkingLeft(){
    
 

	//gameChar_x = 45;
	//gameChar_y = 337;
	//Add your code here ...
    //FEET
    fill(100,0,0);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y);
    vertex(gameChar_x - 12, gameChar_y - 15);
    vertex(gameChar_x - 7, gameChar_y - 25);
    vertex(gameChar_x - 2, gameChar_y - 25);
    vertex(gameChar_x - 7, gameChar_y - 14);
    vertex(gameChar_x - 5, gameChar_y);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -25);
    //rect(gameChar_x + 7, gameChar_y, -5, -25);
    beginShape();
    vertex(gameChar_x + 10, gameChar_y);
    vertex(gameChar_x + 7, gameChar_y - 15);
    vertex(gameChar_x + 7, gameChar_y - 25);
    vertex(gameChar_x + 2, gameChar_y - 25);
    vertex(gameChar_x + 3, gameChar_y - 14);
    vertex(gameChar_x + 5, gameChar_y);
    endShape();
    //SHOES
    fill(25,62,63);
    beginShape();
    vertex(gameChar_x, gameChar_y);
    vertex(gameChar_x - 10, gameChar_y);
    vertex(gameChar_x - 12, gameChar_y - 7);
    vertex(gameChar_x - 6, gameChar_y - 7);
    vertex(gameChar_x - 5, gameChar_y);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -8);
    beginShape();
    vertex(gameChar_x + 5, gameChar_y);
    vertex(gameChar_x + 5, gameChar_y);
    vertex(gameChar_x + 3 , gameChar_y - 7);
    vertex(gameChar_x + 9, gameChar_y - 7);
    vertex(gameChar_x + 10, gameChar_y);
    endShape();
    //rect(gameChar_x + 7, gameChar_y, -5, -8);
    //Updating variables
    //gameChar_x = 45;
	//gameChar_y -= 25;
    //BODY
    fill(50,50,50);
    rect(gameChar_x - 7, gameChar_y -25, 15, -15);
    fill(101,67,33);
    quad(gameChar_x - 7, gameChar_y - 15 - 25, gameChar_x - 9, gameChar_y - 30 - 25,gameChar_x + 8, gameChar_y - 30 - 25, gameChar_x+8, gameChar_y - 15 - 25);
            
    //Updating variables
    //gameChar_x = 45;
	//gameChar_y -= 30;
    //HEAD
    fill(200);
    noStroke();
    rect(gameChar_x - 5, gameChar_y - 12 - 25 - 30, 10, 12);
    fill(228,235,191);
    rect(gameChar_x - 5, gameChar_y - 10 - 25 - 30, 8, 10);
    fill(231,108,86);
    beginShape();
    vertex(gameChar_x-2, gameChar_y - 2 - 55);
    vertex(gameChar_x-3, gameChar_y - 4 - 55);
    vertex(gameChar_x-2, gameChar_y - 6 - 55);
    vertex(gameChar_x-3, gameChar_y - 8 - 55);
    endShape();
    
    //SWORDS
    noFill();
    stroke(100);
    beginShape();
    vertex(gameChar_x + 7, gameChar_y - 55);
    vertex(gameChar_x + 12, gameChar_y - 10 - 55);
    vertex(gameChar_x + 7, gameChar_y - 55);
    endShape(); 
    
    //ARMS
    fill(151,100,60);
    noStroke();
    
    //LEFT
    rect(gameChar_x - 1, gameChar_y + 2 - 55, 3,20)
}
function walkingRight(){
    
     //FEET
    fill(100,0,0);
    beginShape();
    vertex(gameChar_x + 10, gameChar_y);
    vertex(gameChar_x + 12, gameChar_y - 15);
    vertex(gameChar_x + 7, gameChar_y - 25);
    vertex(gameChar_x + 2, gameChar_y - 25);
    vertex(gameChar_x + 7, gameChar_y - 14);
    vertex(gameChar_x + 5, gameChar_y);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -25);
    //rect(gameChar_x + 7, gameChar_y, -5, -25);
    beginShape();
    vertex(gameChar_x - 10, gameChar_y);
    vertex(gameChar_x - 7, gameChar_y - 15);
    vertex(gameChar_x - 7, gameChar_y - 25);
    vertex(gameChar_x - 2, gameChar_y - 25);
    vertex(gameChar_x - 3, gameChar_y - 14);
    vertex(gameChar_x - 5, gameChar_y);
    endShape();
    //SHOES
    fill(25,62,63);
    beginShape();
    vertex(gameChar_x, gameChar_y);
    vertex(gameChar_x + 10, gameChar_y);
    vertex(gameChar_x + 12, gameChar_y - 7);
    vertex(gameChar_x + 6, gameChar_y - 7);
    vertex(gameChar_x + 5, gameChar_y);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -8);
    beginShape();
    vertex(gameChar_x - 5, gameChar_y);
    vertex(gameChar_x - 5, gameChar_y);
    vertex(gameChar_x - 3 , gameChar_y - 7);
    vertex(gameChar_x - 9, gameChar_y - 7);
    vertex(gameChar_x - 10, gameChar_y);
    endShape();
    //rect(gameChar_x + 7, gameChar_y, -5, -8);

    //BODY
    fill(50,50,50);
    rect(gameChar_x - 8, gameChar_y - 25, 15, -15);
    fill(101,67,33);
    quad(gameChar_x + 7, gameChar_y - 15 - 25, gameChar_x + 9, gameChar_y - 30 - 25,gameChar_x - 8, gameChar_y - 30 - 25, gameChar_x-8, gameChar_y - 15 - 25);
            
    
    //HEAD
    fill(200);
    noStroke();
    rect(gameChar_x + 5, gameChar_y - 12 - 55, -10, 12);
    fill(228,235,191);
    rect(gameChar_x + 5, gameChar_y - 10 - 55, -8, 10);
    
    //SWORDS
    noFill();
    stroke(100);
    beginShape();
    vertex(gameChar_x - 7, gameChar_y - 55);
    vertex(gameChar_x - 12, gameChar_y - 10 - 55);
    vertex(gameChar_x - 7, gameChar_y - 55);
    endShape(); 
    
    //ARMS
    fill(151,100,60);
    noStroke();
    
    //LEFT
    rect(gameChar_x - 1, gameChar_y + 2 - 55, 3,20)

}
function jumpingToTheRight(){
    
      //FEET
    fill(100,0,0);
    beginShape();
    vertex(gameChar_x + 16, gameChar_y - 10);
    vertex(gameChar_x + 20, gameChar_y - 30);
    vertex(gameChar_x + 5, gameChar_y - 30);
    vertex(gameChar_x + 5, gameChar_y - 25);
    vertex(gameChar_x + 14, gameChar_y - 25);
    vertex(gameChar_x + 11, gameChar_y - 10);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -25);
    //rect(gameChar_x + 7, gameChar_y, -5, -25);
    beginShape();
    vertex(gameChar_x - 17, gameChar_y -11);
    vertex(gameChar_x - 10, gameChar_y - 15);
    vertex(gameChar_x - 7, gameChar_y - 25);
    vertex(gameChar_x - 2, gameChar_y - 25);
    vertex(gameChar_x - 5, gameChar_y - 14);
    vertex(gameChar_x - 18, gameChar_y - 5);
    endShape();
    //SHOES
    fill(25,62,63);
    beginShape();
    vertex(gameChar_x + 16, gameChar_y - 10);
    vertex(gameChar_x + 18, gameChar_y - 17);
    vertex(gameChar_x + 18, gameChar_y - 17);
    vertex(gameChar_x + 12, gameChar_y - 17);
    vertex(gameChar_x + 11, gameChar_y - 10);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -8);
    beginShape();
    vertex(gameChar_x - 18, gameChar_y - 12);
    vertex(gameChar_x - 13 , gameChar_y - 14);
    vertex(gameChar_x - 9, gameChar_y - 10);
    vertex(gameChar_x - 18, gameChar_y - 5);

    //vertex(gameChar_x + 18, gameChar_y - 9);
    endShape();
    //rect(gameChar_x + 7, gameChar_y, -5, -8);

    //BODY
    fill(50,50,50);
    rect(gameChar_x - 7, gameChar_y - 25, 15, -15);
    fill(101,67,33);
    quad(gameChar_x - 7, gameChar_y - 15 - 25, gameChar_x - 9, gameChar_y - 30 - 25,gameChar_x + 8, gameChar_y - 30 - 25, gameChar_x+8, gameChar_y - 15 - 25);
            

    //HEAD
    fill(200);
    noStroke();
    rect(gameChar_x - 5, gameChar_y - 12 -55, 10, 12);
    fill(228,235,191);
    rect(gameChar_x + 5, gameChar_y - 10 -55, -8, 10);

    
    //SWORDS
    noFill();
    stroke(100);
    beginShape();
    vertex(gameChar_x - 7, gameChar_y -55);
    vertex(gameChar_x - 12, gameChar_y - 10 -55);
    vertex(gameChar_x - 7, gameChar_y -55);
    endShape(); 
    
    //ARMS
    fill(151,100,60);
    noStroke();
    
    //LEFT
    rect(gameChar_x + 1, gameChar_y + 4 -55, 20,-3)
}
function jumpingToTheLeft(){
    
        //FEET
    fill(100,0,0);
    beginShape();
    vertex(gameChar_x - 16, gameChar_y - 10);
    vertex(gameChar_x - 20, gameChar_y - 30);
    vertex(gameChar_x - 5, gameChar_y - 30);
    vertex(gameChar_x - 5, gameChar_y - 25);
    vertex(gameChar_x - 14, gameChar_y - 25);
    vertex(gameChar_x - 11, gameChar_y - 10);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -25);
    //rect(gameChar_x + 7, gameChar_y, -5, -25);
    beginShape();
    vertex(gameChar_x + 17, gameChar_y -11);
    vertex(gameChar_x + 10, gameChar_y - 15);
    vertex(gameChar_x + 7, gameChar_y - 25);
    vertex(gameChar_x + 2, gameChar_y - 25);
    vertex(gameChar_x + 5, gameChar_y - 14);
    vertex(gameChar_x + 18, gameChar_y - 5);
    endShape();
    //SHOES
    fill(25,62,63);
    beginShape();
    vertex(gameChar_x - 16, gameChar_y - 10);
    vertex(gameChar_x - 18, gameChar_y - 17);
    vertex(gameChar_x - 18, gameChar_y - 17);
    vertex(gameChar_x - 12, gameChar_y - 17);
    vertex(gameChar_x - 11, gameChar_y - 10);
    endShape();
    //rect(gameChar_x - 7, gameChar_y, 5, -8);
    beginShape();
    vertex(gameChar_x + 18, gameChar_y - 12);
    vertex(gameChar_x + 13 , gameChar_y - 14);
    vertex(gameChar_x + 9, gameChar_y - 10);
    vertex(gameChar_x + 18, gameChar_y - 5);

    //vertex(gameChar_x + 18, gameChar_y - 9);
    endShape();
    //rect(gameChar_x + 7, gameChar_y, -5, -8);
    //BODY
    fill(50,50,50);
    rect(gameChar_x - 7, gameChar_y - 25, 15, -15);
    fill(101,67,33);
    quad(gameChar_x - 7, gameChar_y - 15 - 25, gameChar_x - 9, gameChar_y - 30 - 25,gameChar_x + 8, gameChar_y - 30 - 25, gameChar_x+8, gameChar_y - 15 - 25);
    
    //HEAD
    fill(200);
    noStroke();
    rect(gameChar_x - 5, gameChar_y - 12 -55, 10, 12);
    fill(228,235,191);
    rect(gameChar_x - 5, gameChar_y - 10 -55, 8, 10);
    fill(231,108,86);
    beginShape();
    vertex(gameChar_x-2, gameChar_y - 2 -55);
    vertex(gameChar_x-3, gameChar_y - 4 -55);
    vertex(gameChar_x-2, gameChar_y - 6 -55);
    vertex(gameChar_x-3, gameChar_y - 8 -55);
    endShape();
    
    //SWORDS
    noFill();
    stroke(100);
    beginShape();
    vertex(gameChar_x + 7, gameChar_y -55);
    vertex(gameChar_x + 12, gameChar_y - 10 -55);
    vertex(gameChar_x + 7, gameChar_y -55);
    endShape(); 
    
    //ARMS
    fill(151,100,60);
    noStroke();
    
    //LEFT
    rect(gameChar_x - 1, gameChar_y + 4 -55, -20,-3)
    
}
function drawTree(treePos_x){
    //Tree
    fill(150, 0, 0);
    rect(treePos_x, treePos_y + 50, -20, 140);
    fill(0, 100, 0);
    ellipse(treePos_x, treePos_y, 50, 50);
    ellipse(treePos_x + 30, treePos_y + 30, 50, 50);
    ellipse(treePos_x + 10, treePos_y + 60, 50, 50);
    ellipse(treePos_x - 10, treePos_y + 80, 50, 50);
    ellipse(treePos_x - 30, treePos_y, 50, 50);
    ellipse(treePos_x - 30, treePos_y + 30, 50, 50);
    ellipse(treePos_x, treePos_y + 30, 50, 50);
    ellipse(treePos_x, treePos_y + 60, 50, 50);
}
function drawMountain(_mountain){
    
    //Mountain
    
    fill(100,0,0);
    beginShape();
    vertex(_mountain.x_pos + 100, floorPos_y);
    vertex(_mountain.x_pos + 100 + _mountain.width/2, floorPos_y - 250);
    vertex(_mountain.x_pos + 100 + _mountain.width, floorPos_y);
    vertex(_mountain.x_pos, floorPos_y);
    endShape();
    
    
    fill(120,0,0)    
    beginShape();
    vertex(_mountain.x_pos, floorPos_y);
    vertex(_mountain.x_pos + _mountain.width/4, floorPos_y - 350);
    vertex(_mountain.x_pos + _mountain.width/2, floorPos_y);
    vertex(_mountain.x_pos, floorPos_y);
    endShape();
    
    fill(140,0,0)    
    beginShape();
    vertex(_mountain.x_pos, floorPos_y);
    vertex(_mountain.x_pos + _mountain.width/2, floorPos_y - 300);
    vertex(_mountain.x_pos + _mountain.width, floorPos_y);
    vertex(_mountain.x_pos, floorPos_y);
    endShape();
}
function drawCanyon(t_canyon){
    //Canyon
    fill(184,115,51);
    beginShape();
    vertex(t_canyon.x_pos - 30, 576);
    vertex(t_canyon.x_pos, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width + 30, 576);
    vertex(t_canyon.x_pos, 576);
    endShape();
    
    fill(123,63,0);
    beginShape();
    vertex(t_canyon.x_pos - 10, 576);
    vertex(t_canyon.x_pos + 15, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width - 15, floorPos_y);
    vertex(t_canyon.x_pos + t_canyon.width + 10, 576);
    vertex(t_canyon.x_pos + 10, 576);
    endShape();
}
function drawClouds(t_cloud){
    clouds
    for(var i = 0; i < clouds.length; i++){
        drawCloud(clouds[i]);
        clouds[i].x_pos += 0.2;
    }
}
function drawCloud(_cloud){
    fill(255);
    ellipse(_cloud.x_pos,_cloud.y_pos,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos + _cloud.rad/2,_cloud.y_pos,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos - _cloud.rad/2,_cloud.y_pos,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos + _cloud.rad,_cloud.y_pos,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos - _cloud.rad,_cloud.y_pos,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos,_cloud.y_pos - _cloud.rad/2,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos + _cloud.rad/2,_cloud.y_pos - _cloud.rad/2,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos - _cloud.rad/2,_cloud.y_pos - _cloud.rad/2,_cloud.rad,_cloud.rad);
    ellipse(_cloud.x_pos,_cloud.y_pos - _cloud.rad,_cloud.rad,_cloud.rad);
}
function drawMountains(){
    for(var i=0; i<mountains.length; i++){
        drawMountain(mountains[i]);
    }
}
function drawTrees(){
    for(var i=0; i<trees_x.length; i++){
        drawTree(trees_x[i]);
    }
}
function drawEnemy(_enemy){
     //FEET
        fill(200,100,0);
        rect(_enemy.x_pos - 7, _enemy.y_pos, 5, -25);
        rect(_enemy.x_pos + 7, _enemy.y_pos, -5, -25);
        //SHOES
        fill(100,50,50);
        rect(_enemy.x_pos - 7, _enemy.y_pos, 5, -8);
        rect(_enemy.x_pos + 7, _enemy.y_pos, -5, -8);
        //BODY
        fill(255,0,0);
        rect(_enemy.x_pos - 10, _enemy.y_pos-25, 20, -15);
        fill(255,0,0);
        quad(_enemy.x_pos - 10, _enemy.y_pos - 15 - 25, _enemy.x_pos - 15, _enemy.y_pos - 30 - 25,_enemy.x_pos + 15, _enemy.y_pos - 30 - 25, _enemy.x_pos+10, _enemy.y_pos - 15 - 25);
                for (var i = _enemy.x_pos-6; i < _enemy.x_pos + 10; i+=4){
                    for (var j = _enemy.y_pos - 26 - 25; j < _enemy.y_pos- 15 - 10; j+=4){
                        noFill();
                        strokeWeight(1);
                        stroke(255)
                        ellipse(i,j,1,1)}
            }
        //HEAD
        fill(140);
        noStroke();
        rect(_enemy.x_pos - 6, _enemy.y_pos - 42 - 25, 12, 12);
        fill(228,235,191);
        rect(_enemy.x_pos - 2, _enemy.y_pos - 65, 4, 10);
        
        noFill();
        stroke(100);
        fill(205,133,63);
        rect(_enemy.x_pos + 12,_enemy.y_pos,4,-100)
        fill(140)
        quad(_enemy.x_pos + 12,_enemy.y_pos - 100, _enemy.x_pos + 18,_enemy.y_pos - 120, _enemy.x_pos + 18,_enemy.y_pos - 80, _enemy.x_pos + 12,_enemy.y_pos - 90)

        //ARMS
        fill(151,100,60);
        noStroke();

        //LEFT
        beginShape();
        vertex(_enemy.x_pos - 15, _enemy.y_pos - 30 -25);
        vertex(_enemy.x_pos - 12, _enemy.y_pos + 5 - 30 -25);
        vertex(_enemy.x_pos - 12, _enemy.y_pos + 20 - 30 -25);
        vertex(_enemy.x_pos - 15, _enemy.y_pos + 20 - 30 -25);
        vertex(_enemy.x_pos - 15, _enemy.y_pos- 30 -25);
        endShape(); 

    
}
function drawEnemies(){
    for(var i=0; i< enemies.length; i++){
        drawEnemy(enemies[i]);
        if(toRight){
            if(enemies[i].x_pos == enemyBoundsRight[i]){
              toRight = false;
              toLeft = true;
            } else{
              enemies[i].x_pos++;
            }
      }
          if (toLeft){
            if(enemies[i].x_pos == enemyBoundsLeft[i]){
              toLeft = false;
              toRight = true;
            } else{
              enemies[i].x_pos--;
        }
      }
    }
}
function drawPlatform(t_platform){
    fill(0);
    rect(t_platform.x_pos, t_platform.y_pos, 50, -10);
}
function checkCanyon(t_canyon){
    if((gameChar_x < t_canyon.x_pos+t_canyon.width - 15 && gameChar_x > t_canyon.x_pos + 15 && gameChar_y >= floorPos_y - 10)){     
        isFalling = true;
        isInCanyon = true;
        gameChar_y+=10;
        if(gameChar_y >= floorPos_y + 50)
            if(!fallSoundAlreadyPlayed){
                fallSound.play();
                fallSoundAlreadyPlayed = true;
            }
    }
}
function checkEnemy(t_enemy){
    for(var i = 0; i < enemies.length; i++){
        if(gameChar_x > enemies[i].x_pos - 15 && gameChar_x < enemies[i].x_pos + 15){
        isFalling = true;
        gameChar_y+=100;
        if(gameChar_y >= 700)
            if(!fallSoundAlreadyPlayed){
                fallSound.play();
                fallSoundAlreadyPlayed = true;
            }
        }
        if(isRight && isAttack && (gameChar_x + 40 >=enemies[i].x_pos) && (gameChar_x <= enemies[i].x_pos)){
            hitSound.play();
            enemies[i].x_pos = 10000;
        }
            
        if(isLeft && isAttack && (gameChar_x - 40 <= enemies[i].x_pos) && (gameChar_x >= enemies[i].x_pos)){
                enemies[i].x_pos = 10000;
                hitSound.play();
    }
}
}
function drawCollectable(collectable){
        fill(210,105,30);
        ellipse(collectable.x_pos, collectable.y_pos, collectable.rad1, collectable.rad1);
        fill(253,233,16);
        ellipse(collectable.x_pos, collectable.y_pos, collectable.rad2, collectable.rad2);
}
function checkCollectable(t_collectable){
    if(!t_collectable.isFound)
        drawCollectable(t_collectable);
    if(dist(gameChar_x,gameChar_y -20,t_collectable.x_pos, t_collectable.y_pos) < 30){
        t_collectable.isFound = true; 
        if(foundCollectables.indexOf(t_collectable)<0){
            foundCollectables.push(t_collectable);
            amountOfCoins++;
            collectSound.play();
        }
    }
}
function checkPlayerDie(){
    if(gameChar_y > 700){
        lives--;
        if(lives<1){
            lose();
            fallSound.stop();
            jumpSound.stop();
        }
            
        else
            startGame();
    }
}
function drawGunter(){
     //FEET
        fill(66,133,180);
        rect(gunter.x_pos - 7, gunter.y_pos, 5, -25);
        rect(gunter.x_pos + 7, gunter.y_pos, -5, -25);
        //SHOES
        fill(115,66,34);
        rect(gunter.x_pos - 7, gunter.y_pos, 5, -8);
        rect(gunter.x_pos + 7, gunter.y_pos, -5, -8);
        //BODY
        fill(254,205,10);
        rect(gunter.x_pos - 10, gunter.y_pos-25, 20, -15);
        quad(gunter.x_pos - 10, gunter.y_pos - 15 - 25, gunter.x_pos - 15, gunter.y_pos - 30 - 25,gunter.x_pos + 15, gunter.y_pos - 30 - 25, gunter.x_pos+10, gunter.y_pos - 15 - 25);
        fill(100,100,50);
        rect(gunter.x_pos - 1, gunter.y_pos - 67, 2, 30);
        rect(gunter.x_pos - 10, gunter.y_pos - 37, 20, 2);
        //HEAD
        fill(228,235,191);
        noStroke();
        rect(gunter.x_pos - 6, gunter.y_pos - 42 - 25, 12, 12);

        //ARMS
        fill(200,150,80);;
        noStroke();
        //LEFT
        beginShape();
        vertex(gunter.x_pos - 15, gunter.y_pos - 30 -25);
        vertex(gunter.x_pos - 12, gunter.y_pos + 5 - 30 -25);
        vertex(gunter.x_pos - 12, gunter.y_pos + 20 - 30 -25);
        vertex(gunter.x_pos - 15, gunter.y_pos + 20 - 30 -25);
        vertex(gunter.x_pos - 15, gunter.y_pos- 30 -25);
        endShape(); 
        //RIGHT
        beginShape();
        vertex(gunter.x_pos + 15, gunter.y_pos -55);
        vertex(gunter.x_pos + 12, gunter.y_pos + 5 -55);
        vertex(gunter.x_pos + 12, gunter.y_pos + 20 -55);
        vertex(gunter.x_pos + 15, gunter.y_pos + 20 -55);
        vertex(gunter.x_pos + 15, gunter.y_pos -55);
        endShape(); 

    
}