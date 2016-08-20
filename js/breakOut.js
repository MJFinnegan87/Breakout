function breakOut(){
	//Define objects
	function pingPongPaddle(color, height, width, x, speed){
		this.color = color;
		this.height = height;
		this.width = width;
		this.x = x;
		this.speed = speed;
		
		this.draw = function() {
			ctx.beginPath();
			ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
		
		this.move = function(){
			if (rightPressed && this.x < canvas.width - this.width) {
				this.x += this.speed;
			}
			else if (leftPressed && this.x > 0) {
				this.x -= this.speed;
			}
		}
		
		this.catchBonusItemsFalling = function(){
			if (bonus.visible == true && (bonus.y + bonus.height >= (canvas.height - this.height)) && (bonus.x + bonus.width >= this.x) && (this.x + this.width >= bonus.x)) {
				score = score + 100;
				bonus.applyItemBonus();
			}
		}
	}
	
	function pingPongBall(radius, color, x, y, dx, dy){
		this.radius = radius;
		this.color = color;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		
		this.draw = function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.closePath();
		}
		
		this.move = function(){
			//Calculate the direction the ball should be going on the next frame first,
			this.determineDirectionOnNextFrame();
			//Then move the ball according to our previous calculation.
			//What was the next frame is now going to be the current frame.
			this.x += this.dx;
			this.y += this.dy;
		}
		
		this.relaunch = function(){
			this.x = canvas.width / 2;
			this.y = canvas.height - 30;
			this.dx = Math.floor((Math.random() * 5) + 2);
			this.dy = -Math.floor((Math.random() * 5) + 2);
			paddle.x = (canvas.width - paddle.width) / 2;
			paddle.width = 75;
			paddle.speed = 7;
		}
		
		this.determineDirectionOnNextFrame = function(){
			/*If the ball hits the left or right side of the wall,
			then set ball direction on next frame to appear as bouncing off*/
			if ((this.x + this.dx) > (canvas.width - this.radius) || ((this.x + this.dx) < this.radius)) {
				this.dx = -this.dx;
			}
			/*If the ball hits the ceiling,
			then set ball direction on next frame to appear as bouncing off*/
			else if (this.y + this.dy < this.radius) {
				this.dy = -this.dy;
			}
			/*Otherwise, if the ball hits the bottom of the canvas, but high enough to be hit by the paddle*/
			else if ((this.y + this.dy) >= (canvas.height - this.radius - paddle.height)) {
				if ((((this.x + this.dx) >= paddle.x) && ((this.x + this.dx) <= (paddle.x + paddle.width))) || (((this.x) >= paddle.x) && ((this.x) <= (paddle.x + paddle.width)))){
					//Bounce the ball off the paddle
					this.dy = -this.dy;
					//Add the paddle x speed to the ball speed
					if (rightPressed && (paddle.x < (canvas.width - paddle.width))) {
						this.dx = this.dx + paddle.speed;
					}
					else if (leftPressed && (paddle.x > 0)) {
						this.dx = this.dx - paddle.speed;
					}
				}
				else {
					//Only if the ball touches the bottom of the canvas beyond the height of the paddle, end the round
					if ((this.y + this.dy) >= (canvas.height - this.radius)) {
						endRound();
					}
				}
			}
		}
	}
	
	function brick(){
		//this.color = color;
		this.image = document.getElementById("BlueBrick");
		this.width = 75;
		this.height = 30;
		this.padding = 1;
		this.exists = 1;
		this.x = 0;
		this.y = 0;
	}
	
	function bonusItem(speed, x, y, type, R, G, B, A, visible){
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.type = type;
		this.colorR = R;
		this.colorG = G;
		this.colorB = B;
		this.colorA = A; //Alpha transparency
		this.visible = visible;
		this.width = new brick().width;
		this.height = new brick().height;
		
		this.assignNew = function(bonusX, bonusY) {
			this.type = Math.floor((Math.random() * 7) + 1); //RANDOM BONUS TYPE (EACH TYPE HAS DIFFERENT COLOR & BEHAVIOR)
			this.colorR = 0;
			this.colorG = 0;
			this.colorB = 0;
			this.colorA = .5;
				
			switch (this.type) {
				case 1:
					this.colorR = 0;
					this.colorG = 255;
					this.colorB = 255;
					/*this.colorA = .75;*/
					break;
				case 2:
					this.colorR = 0;
					this.colorG = 255;
					this.colorB = 0;
					/*this.colorA = .75;*/
					break;
				case 3:
					this.colorR = 0;
					this.colorG = 0;
					this.colorB = 255;
					/*this.colorA = .75;*/
					break;
				case 4:
					this.colorR = 255;
					this.colorG = 0;
					this.colorB = 0;
					/*this.colorA = .75;*/
					break;
				case 5:
					this.colorR = 255;
					this.colorG = 255;
					this.colorB = 255;
					/*this.colorA = .75;*/
					break;
				case 6:
					this.colorR = 0;
					this.colorG = 255;
					this.colorB = 255;
					/*this.colorA = .75;*/
					break;
				case 7:
					this.colorR = 255;
					this.colorG = 255;
					this.colorB = 0;
					/*this.colorA = .75;*/
					break;
			}
			this.speed = 2;
			this.x = bonusX;
			this.y = bonusY;
			this.visible = true;
		}
	
		this.move = function(){
			if (this.visible == true) {
				this.y = this.y + this.speed;
			}
		}

		this.draw = function(){
			if (this.visible == true) {
				if (this.y > canvas.height) {
					this.visible = false;
				}
				else {
				ctx.beginPath();
				ctx.rect(this.x, this.y, this.width, this.height);
				ctx.fillStyle = "rgba(" + this.colorR + ", " + this.colorG + ", " + this.colorB + ", " + this.colorA + ")";
				ctx.fill();
				ctx.name = "itemBlock";
				ctx.closePath();
				}
			}
		}
		
		this.applyItemBonus = function() {
			this.visible = false;
			if (this.type == 1) {
				paddle.width = paddle.width + 10;
			}
			if (this.type == 2) {
				paddle.speed = Math.min(15, Math.max(paddle.speed + 2, 7));
			}
			if (this.type == 3) {
				lives++;
			}
			if (this.type == 4) {
				score = 0;
				paddle.speed = 1;
			}
			if (this.type == 5) {
				paddle.width = Math.max(paddle.width - 15, 5);
				score = Math.max(0, score - 100);
			}
			if (this.type == 6) {
				ball.dx = ball.dx / 2;
				ball.dy = ball.dy / 2;
			}
			if (this.type == 7) {
				ball.dx = ball.dx * 2;
				ball.dy = ball.dy * 2;
				score = Math.max(0, score - 100);
			}
		}
	}
	
	function brickSet(){
		this.brickColumnCount = Math.max(Math.floor(((canvas.width - 100) / (new brick().width + new brick().padding))) +1, 1);
		this.brickRowCount = 4;
		this.brickArray = [];
		this.numberOfBricksBroken = 0;
		this.arrayOffsetLeft = 30;
		this.arrayOffsetTop = 30;
		
		//Load an array of bricks into brickArray which will represent bricks on the screen
		for (r = 0; r < this.brickRowCount; r++) {
			this.brickArray[r] = [];
			for (c = 0; c < this.brickColumnCount; c++) {
				this.brickArray[r][c] = new brick();
				this.brickArray[r][c].x = (c * (this.brickArray[r][c].width + this.brickArray[r][c].padding)) + this.arrayOffsetLeft;
				this.brickArray[r][c].y = (r * (this.brickArray[r][c].height + this.brickArray[r][c].padding)) + this.arrayOffsetTop;
			}
		}
		
		this.destroyHitBricks = function() {
			for (r = 0; r < this.brickRowCount; r++) {
				for (c = 0; c < this.brickColumnCount; c++) {
					var thisBrick = this.brickArray[r][c];
					if (thisBrick.exists == 1) {
						if (ball.x > thisBrick.x && ball.x < thisBrick.x + thisBrick.width && ball.y > thisBrick.y && ball.y < thisBrick.y + thisBrick.height) {
							ball.dy = -ball.dy;
							thisBrick.exists = 0;
							score++;
							this.numberOfBricksBroken++;
							if (bonus.visible == false) {
								bonus.assignNew(thisBrick.x, thisBrick.y);
							}
							if (this.numberOfBricksBroken == this.brickColumnCount * this.brickRowCount) {
								winGame();
							}
						}
					}
				}
			}
		}
	
		this.draw = function() {
			for (r = 0; r < this.brickRowCount; r++) {
				for (c = 0; c < this.brickColumnCount; c++) {
					if (this.brickArray[r][c].exists == 1) {
						ctx.drawImage(this.brickArray[r][c].image, this.brickArray[r][c].x, this.brickArray[r][c].y, this.brickArray[r][c].width, this.brickArray[r][c].height);
					}
				}
			}
		}
	}
	
	function screen(){
		this.textColor = "#FFFFFF";
		this.textFont = "18px Arial";
		this.backgroundColor = "#000000";
		
		this.drawBackground = function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = this.backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		
		this.drawStatus = function() {
			ctx.font = this.textFont;
			ctx.fillStyle = this.textColor;
			ctx.fillText("Score: " + score, 8, 20);
			ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
		}
	}
	
	//Define Properties of breakOut
	var canvas = document.getElementById("myCanvas");
	canvas.width = .9 * $( window ).width();
	canvas.height = .9 * $( window ).height();
	var ctx = canvas.getContext("2d");
	
	var rightPressed = false;
	var leftPressed = false;
	var score = 0;
	var lives = 5;
	
	var bonus = new bonusItem(2, 0, 0, 0, 0, 0, 0, 0, false);
	var ball = new pingPongBall(5, "#0000FF", canvas.width / 2, canvas.height - 30, Math.floor((Math.random() * 5) + 2), -Math.floor((Math.random() * 5) + 2));
	var paddle = new pingPongPaddle("#0000FF", 10, 75, 0, 7);
	paddle.x = (canvas.width - paddle.width) / 2;
	var bricks = new brickSet();
	var screen = new screen();
	

	//Add key listeners
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	
	
	//Define breakOut methods
	function keyDownHandler(e) {
		if (e.keyCode == 39) {
			rightPressed = true;
		}
		else if (e.keyCode == 37) {
			leftPressed = true;
		}
	}
	
	function keyUpHandler(e) {
		if (e.keyCode == 39) {
			rightPressed = false;
		}
		else if (e.keyCode == 37) {
			leftPressed = false;
		}
	}
	
	function loseGame(){
		alert("GAME OVER");
		document.location.reload();
	}
	
	function winGame(){
		alert("YOU WIN, CONGRATS!");
		document.location.reload();
	}
	
	function endRound(){
		lives--;
		if (!lives) {
			loseGame();
		}
		else {
			ball.relaunch();
		}
	}
	
	this.play = function(){
		requestAnimationFrame(gameLoop);
	}
	
	function gameLoop(){
		//Main game loop
		screen.drawBackground();
		screen.drawStatus();
		bricks.draw();
		bonus.move();
		bonus.draw();
		ball.move();
		ball.draw();
		paddle.move();
		paddle.draw();
		bricks.destroyHitBricks();
		paddle.catchBonusItemsFalling();
		requestAnimationFrame(gameLoop);
	}
}
