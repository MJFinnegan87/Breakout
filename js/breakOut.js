function breakOut(){
	//Define objects
	function pingPongPaddle(color, height, width, x, speed){
		this.color = color;
		this.height = height;
		this.width = width;
		this.x = x;
		this.speed = speed;
	}
	
	function pingPongBall(radius, color, x, y, dx, dy){
		this.radius = radius;
		this.color = color;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}
	
	function brick(color, image, width, height, padding, exists, x, y){
		this.color = color;
		this.image = image;
		this.width = width;
		this.height = height;
		this.padding = padding;
		this.exists = exists;
		this.x = x;
		this.y = y;
	}
	
	function bonusItem(speed, x, y, type, R, G, B, A, width, height, visible){
		this.speed = speed;
		this.x = x;
		this.y = y;
		this.type = type;
		this.colorR = R;
		this.colorG = G;
		this.colorB = B;
		this.colorA = A; //Alpha transparency
		this.visible = visible;
		this.width = width;
		this.height = height;
	}
	
	//Define Properties of breakOut
	var canvas = document.getElementById("myCanvas");
	canvas.width = .9 * $( window ).width()
	canvas.height = .9 * $( window ).height()
	var ctx = canvas.getContext("2d");
	
	var rightPressed = false;
	var leftPressed = false;
	var score = 0;
	var numberOfBricksBroken = 0;
	var lives = 5;

	var brickImage = document.getElementById("BlueBrick")
	var brickWidth = 75;
	var brickHeight = 30;
	var brickPadding = 1;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;	
	var itemSpeed = 2;
	var textColor = "#FFFFFF";
	var backgroundColor = "#000000";
	
	var bonus = new bonusItem(itemSpeed, 0, 0, 0, 0, 0, 0, 0, brickWidth, brickHeight, false);
	var ball = new pingPongBall(5, "#0000FF", canvas.width / 2, canvas.height - 30, Math.floor((Math.random() * 5) + 2), -Math.floor((Math.random() * 5) + 2))
	var paddle = new pingPongPaddle("#0000FF", 10, 75, 0, 7)
	paddle.x = (canvas.width - paddle.width) / 2
	
	var brickRowCount = Math.max(Math.floor(((canvas.width - 100) / (brickWidth + brickPadding))) +1, 1);
	var brickColumnCount = 4;
	var brickArray = [];
	
	//Load an array of bricks into brickArray which will represent bricks on the screen
	for (c = 0; c < brickColumnCount; c++) {
		brickArray[c] = [];
		for (r = 0; r < brickRowCount; r++) {
			brickArray[c][r] = new brick("blue", brickImage, brickWidth, brickHeight, brickPadding, 1, 0, 0);
		}
	}

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
	
	function drawBackground(){
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function destroyBricksThatWereHit() {
		for (c = 0; c < brickColumnCount; c++) {
			for (r = 0; r < brickRowCount; r++) {
				var thisBrick = brickArray[c][r];
				if (thisBrick.exists == 1) {
					if (ball.x > thisBrick.x && ball.x < thisBrick.x + thisBrick.width && ball.y > thisBrick.y && ball.y < thisBrick.y + thisBrick.height) {
						ball.dy = -ball.dy;
						thisBrick.exists = 0;
						score++;
						numberOfBricksBroken++;
						if (bonus.visible == false) {
							createBonusItem(thisBrick.x, thisBrick.y);
						}
						if (numberOfBricksBroken == brickRowCount * brickColumnCount) {
							winGame();
						}
					}
				}
			}
		}
	}

	function createBonusItem(bonusX, bonusY) {
		itemType = Math.floor((Math.random() * 7) + 1); //RANDOM BONUS TYPE (EACH TYPE HAS DIFFERENT COLOR & BEHAVIOR)
		var colorR = 0;
		var colorG = 0;
		var colorB = 0;
		var colorA = .5;
			
		switch (itemType) {
			case 1:
				colorR = 0;
				colorG = 255;
				colorB = 255;
				/*colorA = .75;*/
				break;
			case 2:
				colorR = 0;
				colorG = 255;
				colorB = 0;
				/*colorA = .75;*/

				break;
			case 3:
				colorR = 0;
				colorG = 0;
				colorB = 255;
				/*colorA = .75;*/
				break;
			case 4:
				colorR = 255;
				colorG = 0;
				colorB = 0;
				/*colorA = .75;*/
				break;
			case 5:
				colorR = 255;
				colorG = 255;
				colorB = 255;
				/*colorA = .75;*/
				break;
			case 6:
				colorR = 0;
				colorG = 255;
				colorB = 255;
				/*colorA = .75;*/
				break;
			case 7:
				colorR = 255;
				colorG = 255;
				colorB = 0;
				/*colorA = .75;*/
				break;
		}
		bonus = new bonusItem(2, bonusX, bonusY, itemType, colorR, colorG, colorB, colorA, brickWidth, brickHeight, true);
	}
	
	function moveBonusItem(){
		if (bonus.visible == true) {
			bonus.y = bonus.y + bonus.speed
		}
	}

	function drawBonusItem(){
		if (bonus.visible == true) {
			if (bonus.y > canvas.height) {
				bonus.visible = false;
			}
			else {
			ctx.beginPath();
			ctx.rect(bonus.x, bonus.y, bonus.width, bonus.height);
			ctx.fillStyle = "rgba(" + bonus.colorR + ", " + bonus.colorG + ", " + bonus.colorB + ", " + bonus.colorA + ")";
			ctx.fill();
			ctx.name = "itemBlock";
			ctx.closePath();
			}
		}
	}
	
	function applyItemBonus() {
		bonus.visible = false;
		if (bonus.type == 1) {
			paddle.width = paddle.width + 10;
		}
		if (bonus.type == 2) {
			paddle.speed = Math.min(15, Math.max(paddle.speed + 2, 7));
		}
		if (bonus.type == 3) {
			lives++;
		}
		if (bonus.type == 4) {
			score = 0;
			paddle.speed = 1;
		}
		if (bonus.type == 5) {
			paddle.width = Math.max(paddle.width - 15, 5);
			score = Math.max(0, score - 100);
		}
		if (bonus.type == 6) {
			ball.dx = ball.dx / 2;
			ball.dy = ball.dy / 2;
		}
		if (bonus.type == 7) {
			ball.dx = ball.dx * 2;
			ball.dy = ball.dy * 2;
			score = Math.max(0, score - 100);
		}
	}

	function drawBall() {
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fillStyle = ball.color;
		ctx.fill();
		ctx.closePath();
	}
	
	function drawPaddle() {
		ctx.beginPath();
		ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
		ctx.fillStyle = paddle.color;
		ctx.fill();
		ctx.closePath();
	}
	
	function drawBrickArray() {
		for (c = 0; c < brickColumnCount; c++) {
			for (r = 0; r < brickRowCount; r++) {
				if (brickArray[c][r].exists == 1) {
					var brickX = (r * (brickArray[c][r].width + brickArray[c][r].padding)) + brickOffsetLeft;
					var brickY = (c * (brickArray[c][r].height + brickArray[c][r].padding)) + brickOffsetTop;
					brickArray[c][r].x = brickX;
					brickArray[c][r].y = brickY;
					ctx.drawImage(brickArray[c][r].image, brickX, brickY, brickArray[c][r].width, brickArray[c][r].height);
				}
			}
		}
	}
	
	function drawScore() {
		ctx.font = "18px Arial";
		ctx.fillStyle = textColor;
		ctx.fillText("Score: " + score, 8, 20);
	}
	
	function drawLives() {
		ctx.font = "18px Arial";
		ctx.fillStyle = textColor;
		ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
	}
	
	function catchBonusItemsFalling(){
		if (bonus.visible == true && (bonus.y + bonus.height >= canvas.height) && (bonus.x + brickWidth >= paddle.x) && (paddle.x + paddle.width >= bonus.x)) {
			score = score + 100;
			applyItemBonus();
		}
	}
	
	function relaunchBall(){
		ball.x = canvas.width / 2;
		ball.y = canvas.height - 30;
		ball.dx = Math.floor((Math.random() * 5) + 2);
		ball.dy = -Math.floor((Math.random() * 5) + 2);
		paddle.x = (canvas.width - paddle.width) / 2;
		paddle.width = 75;
		paddle.speed = 7;
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
			relaunchBall();
		}
	}
	
	function determineDirectionOfBallOnNextFrame(){
		/*If the ball hits the left or right side of the wall,
		then set ball direction on next frame to appear as bouncing off*/
		if ((ball.x + ball.dx) > (canvas.width - ball.radius) || ((ball.x + ball.dx) < ball.radius)) {
			ball.dx = -ball.dx;
		}
		/*If the ball hits the ceiling,
		then set ball direction on next frame to appear as bouncing off*/
		if (ball.y + ball.dy < ball.radius) {
			ball.dy = -ball.dy;
		}
		/*Otherwise, if the ball hits the floor*/
		else if ((ball.y + ball.dy) > (canvas.height - ball.radius)) {
			if ((((ball.x + ball.dx) > paddle.x) && ((ball.x + ball.dx) < (paddle.x + paddle.width))) || (((ball.x) > paddle.x) && ((ball.x) < (paddle.x + paddle.width)))) {
				ball.dy = -ball.dy;
				if (rightPressed && (paddle.x < (canvas.width - paddle.width))) {
					ball.dx = ball.dx + paddle.speed;
				}
				else if (leftPressed && (paddle.x > 0)) {
					ball.dx = ball.dx - paddle.speed;
				}
			}
			else {
				endRound();
			}
		}
	}
	
	function movePaddle(){
		if (rightPressed && paddle.x < canvas.width - paddle.width) {
			paddle.x += paddle.speed;
		}
		else if (leftPressed && paddle.x > 0) {
			paddle.x -= paddle.speed;
		}
	}
	
	function moveBall(){
		//Move the ball according to the direction of the next frame we previously calculated
		//What was the next frame is now going to be the current frame.
		ball.x += ball.dx;
		ball.y += ball.dy;
	}
	
	function play(){
		//Main game loop
		drawBackground();
		drawBrickArray();
		moveBonusItem();
		drawBonusItem();
		drawBall();
		drawPaddle();
		drawScore();
		drawLives();
		destroyBricksThatWereHit();
		determineDirectionOfBallOnNextFrame();
		catchBonusItemsFalling();
		movePaddle();
		moveBall();
		requestAnimationFrame(play);
	}
	
	play();
}
