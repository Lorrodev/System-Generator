
function animate(){
	if(!paused){
		ctxLM.clearRect(0,0,canvasWidth,canvasHeight);
		ctxPL.clearRect(0,0,canvasWidth,canvasHeight);
		updateGravitationalForces();
		updateBodyPositions();
		
		//render
		renderBodies();
		castLight();

		if(activeBody != false){
			displayBodyInfo(activeBody);
		}
	}
}

function fadeIn(){
	var overlayOpacity = 1.0;
	var textOpacity = 0;

	fadeInInterval = setInterval(function(){
		overlayOpacity -= 0.02;
		blackOverlay.style.background = "rgba(0, 0, 0, "+overlayOpacity+")";

		ctxTX.clearRect(0, window.innerHeight-100, canvasWidth/3, canvasHeight);
		ctxTX.font = "50px Orbitron";
		ctxTX.fillStyle = "rgba(255, 255, 255, "+textOpacity+")";
		ctxTX.fillText(stars[0].name+" System", 20, window.innerHeight-40);

		if (overlayOpacity > 0){
			textOpacity += 0.02;
		}else{
			textOpacity -= 0.015;
		}

		if (textOpacity <= 0){
			clearInterval(fadeInInterval);
		}

	}, animationSpeed);
}

function controlBrightness(action){
	switch(action){
		case "+":
			if(brightness < 2){
				brightness += 0.2;
				document.getElementById("decreaseBrightnessButton").style.borderColor = "#5e9fa3";
			}else{
				document.getElementById("increaseBrightnessButton").style.borderColor = "#ccc";
			}
			document.getElementById("increaseBrightnessButton").blur();
			break;

		case "-":
			if(brightness > 0){
				brightness -= 0.2;
				document.getElementById("increaseBrightnessButton").style.borderColor = "#5e9fa3";
			}else{
				document.getElementById("decreaseBrightnessButton").style.borderColor = "#ccc";
			}
			document.getElementById("decreaseBrightnessButton").blur();
			break;

		case "0":
			brightness = 1;
			document.getElementById("increaseBrightnessButton").style.borderColor = "#5e9fa3";
			document.getElementById("decreaseBrightnessButton").style.borderColor = "#5e9fa3";
			document.getElementById("resetBrightnessButton").blur();
			break;
	}
}

function pauseAnimation() {
	if(!paused){
		paused = true;
		pauseButton.value = " > ";
	}else{
		paused = false;
		pauseButton.value = " | | ";
	}
	document.getElementById("pauseButton").blur();
}

function hideCursor(){
	if(!cursorHidden){
		document.body.style.cursor = "none";
		document.getElementById("hideCursorButton").value = "Unhide Cursor";
		cursorHidden = true;
	}else{
		document.body.style.cursor = "auto";
		document.getElementById("hideCursorButton").value = "Hide Cursor";
		cursorHidden = false;
	}

	document.getElementById("hideCursorButton").blur();
}

function updateMousePos(e) {

    cursorOffsetX = (window.innerWidth/2-e.clientX);
    cursorOffsetY = (window.innerHeight/2-e.clientY)*1.5;

    lightMaskCanvas.style.marginLeft = canvasOffsetX+cursorOffsetX;
    lightMaskCanvas.style.marginTop = canvasOffsetY+cursorOffsetY;

    starCanvas.style.marginLeft = canvasOffsetX+cursorOffsetX;
    starCanvas.style.marginTop = canvasOffsetY+cursorOffsetY;

    planetCanvas.style.marginLeft = canvasOffsetX+cursorOffsetX;
    planetCanvas.style.marginTop = canvasOffsetY+cursorOffsetY;

    backgroundCanvas.style.marginLeft = canvasOffsetX+cursorOffsetX/5;
    backgroundCanvas.style.marginTop = canvasOffsetY+cursorOffsetY/5;

    if(activeBody != false){
		displayBodyInfo(activeBody);
	}
}

function displayBodyInfo(body) {
	if(body.type == "star") {
		var bodyInfoDiv = document.getElementById("bodyInformation");
		var starInfoDiv = document.getElementById("starInformation");

		document.getElementById("starName").innerHTML = body.name;

		starInfoDiv.style.left = canvasOffsetX+cursorOffsetX+body.xPos-starInfoDiv.offsetWidth/2;
		starInfoDiv.style.top = canvasOffsetY+cursorOffsetY+body.yPos-starInfoDiv.offsetHeight/2+(starInfoDiv.offsetHeight/2+body.radius*1.5);

		starInfoDiv.style.borderColor = "rgb("+body.color[2]+")";

		bodyInfoDiv.style.opacity = 0;
		starInfoDiv.style.opacity = 1;
	}else{
		var bodyInfoDiv = document.getElementById("bodyInformation");
		var starInfoDiv = document.getElementById("starInformation");

		document.getElementById("bodyName").innerHTML = body.name;
		document.getElementById("bodyAtmosphere").innerHTML = body.atmosphericComposition;
		document.getElementById("bodySpecies").innerHTML = body.species;
		document.getElementById("bodyOrbit").innerHTML = body.planet.name;
		//document.getElementById("planetPopulation").innerHTML = body.population;

		//top left corner
		if(body.xPos < canvasWidth/2 && body.yPos < canvasHeight/2){
			bodyInfoDiv.style.left = canvasOffsetX+cursorOffsetX+body.xPos-bodyInfoDiv.offsetWidth/2 +(bodyInfoDiv.offsetWidth/2+body.radius);
			bodyInfoDiv.style.top = canvasOffsetY+cursorOffsetY+body.yPos-bodyInfoDiv.offsetHeight/2 +(bodyInfoDiv.offsetHeight/2+body.radius);

		//bottom left corner
		}else if(body.xPos < canvasWidth/2 && body.yPos > canvasHeight/2){
			bodyInfoDiv.style.left = canvasOffsetX+cursorOffsetX+body.xPos-bodyInfoDiv.offsetWidth/2 +(bodyInfoDiv.offsetWidth/2+body.radius);
			bodyInfoDiv.style.top = canvasOffsetY+cursorOffsetY+body.yPos-bodyInfoDiv.offsetHeight/2 -(bodyInfoDiv.offsetHeight/2+body.radius);

		//bottom right corner
		}else if(body.xPos > canvasWidth/2 && body.yPos > canvasHeight/2){
			bodyInfoDiv.style.left = canvasOffsetX+cursorOffsetX+body.xPos-bodyInfoDiv.offsetWidth/2 -(bodyInfoDiv.offsetWidth/2+body.radius);
			bodyInfoDiv.style.top = canvasOffsetY+cursorOffsetY+body.yPos-bodyInfoDiv.offsetHeight/2 -(bodyInfoDiv.offsetHeight/2+body.radius);

		//top right corner
		}else{
			bodyInfoDiv.style.left = canvasOffsetX+cursorOffsetX+body.xPos-bodyInfoDiv.offsetWidth/2 -(bodyInfoDiv.offsetWidth/2+body.radius);
			bodyInfoDiv.style.top = canvasOffsetY+cursorOffsetY+body.yPos-bodyInfoDiv.offsetHeight/2 +(bodyInfoDiv.offsetHeight/2+body.radius);
		}

		bodyInfoDiv.style.borderColor = "rgb("+body.color[1]+")";

		starInfoDiv.style.opacity = 0;
		bodyInfoDiv.style.opacity = 1;
	}
}

function clearBodyInfo(){
	var starInfoDiv = document.getElementById("starInformation");
	var bodyInfoDiv = document.getElementById("bodyInformation");

	var interval = setInterval(function(){
		if(bodyInfoDiv.style.opacity <= 0 && starInfoDiv.style.opacity <= 0){
 
			starInfoDiv.style.left = 0;
			starInfoDiv.style.top = 0;

			bodyInfoDiv.style.left = 0;
			bodyInfoDiv.style.top = 0;

			clearInterval(interval);
		}else{
			bodyInfoDiv.style.opacity -= 0.2;
			starInfoDiv.style.opacity -= 0.2;
		}
	}, animationSpeed);
}

function getClickedBody(e){
	activeBody = false;

	var star = stars[0];

	var leftBorder = canvasOffsetX+cursorOffsetX+star.xPos-star.radius;
	var rightBorder = canvasOffsetX+cursorOffsetX+star.xPos+star.radius;

	var topBorder = canvasOffsetY+cursorOffsetY+star.yPos-star.radius;
	var bottomBorder = canvasOffsetY+cursorOffsetY+star.yPos+star.radius;

	if(e.clientX > leftBorder && e.clientX < rightBorder && e.clientY > topBorder && e.clientY < bottomBorder){
		activeBody = star;
	}else{
		bodies.forEach(function(body){

			if(body.radius > 8){
				var clickBoxRadius = body.radius;
			}else{
				var clickBoxRadius = 8;
			}

			leftBorder = canvasOffsetX+cursorOffsetX+body.xPos-clickBoxRadius;
			rightBorder = canvasOffsetX+cursorOffsetX+body.xPos+clickBoxRadius;

			topBorder = canvasOffsetY+cursorOffsetY+body.yPos-clickBoxRadius;
			bottomBorder = canvasOffsetY+cursorOffsetY+body.yPos+clickBoxRadius;

			if(e.clientX > leftBorder && e.clientX < rightBorder && e.clientY > topBorder && e.clientY < bottomBorder){
				activeBody = body;
			}
		});
	}

	if(activeBody == false){
		clearBodyInfo();
	}
}