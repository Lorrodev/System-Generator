document.addEventListener("keydown", keyDownRecieved, false);

//canvas setups
var blackOverlay = document.getElementById("blackOverlay");

var textCanvas = document.getElementById("textCanvas");
var lightMaskCanvas = document.getElementById("lightMaskCanvas");
var starCanvas = document.getElementById("starCanvas");
var planetCanvas = document.getElementById("planetCanvas");
var backgroundCanvas = document.getElementById("backgroundCanvas");

var ctxTX = textCanvas.getContext("2d");
var ctxLM = lightMaskCanvas.getContext("2d");
var ctxST = starCanvas.getContext("2d");
var ctxPL = planetCanvas.getContext("2d");
var ctxBG = backgroundCanvas.getContext("2d");

var canvasWidth = 0;
var canvasHeight = 0;

//option container elements
var brightnessSlider = document.getElementById("brightnessSlider");
var pauseButton = document.getElementById("pauseButton");

//Color definitions
//Color arrays: [primary, light, shiny]
//Secondary color is lighter than primary
var blue = [
			"104, 119, 155",
			"142, 154, 181",
			"170, 216, 255"
			];

var brown = [
			"231, 195, 146",
			"255, 227, 190",
			"255, 190, 164"
			];

var midnightBlue = [
			"127, 104, 157",
			"150, 133, 174",
			"207, 171, 255"
			];

var green = [
			"116, 185, 116",
			"152, 204, 152",
			"188, 255, 164"
			];

var blueishGreen = [
			"100, 159, 133",
			"130, 175, 156",
			"164, 255, 216"
			];

var pink = [
			"207, 130, 153",
			"228, 170, 187",
			"255, 164, 191"
			];

var purple = [
			"135, 100, 154",
			"156, 129, 171",
			"224, 168, 255"
			];

var lightPurple = [
			"150, 95, 150",
			"166, 124, 166",
			"255, 164, 255"
			];

var ochre = [
			"231, 210, 146",
			"255, 239, 190",
			"255, 232, 164"
			];

var red = [
			"231, 146, 146",
			"255, 190, 190",
			"255, 170, 164"
			];

var turquoise = [
			"78, 186, 186",
			"119, 213, 213",
			"164, 255, 255"
			];

var yellow = [
			"231, 224, 146",
			"255, 249, 190",
			"255, 247, 164"
			];

var white = [
			"218, 218, 218",
			"240, 240, 240",
			"225, 225, 225"
			];

//array containing all colors
var colors = [blue, midnightBlue, brown, green, blueishGreen, pink, purple, lightPurple, ochre, red, turquoise, yellow, white];

//debug colors
var debugRed = "#f72c2c";
var debugGreen = "#23ea47";
var debugBlue = "#1265ea";

//adds readability when accessing position arrays
const x = 0;
const y = 1;

//easy to control brightness
var brightness = 1;

//variable to create a usable mass to pixel scale
var massScale = 1/100000;

//gloabal variables for planets
var minDistance = 10;
var prevOrbitRadius = 0;

//global variables for moons
var minMoonDistance = 10;
var prevMoonOrbitRadius = 0;

//System variables
//determines the base spin of the system
var spin = 0;
if(Math.random() >= 0.5){
	spin = -1;
}else{
	spin = 1;
}

var intelligentLife = false;
var species = [];
var systemPopulation = 0;

//controlling the frames per second
var fps = 25;

//animation controls
var animationInterval;
var fadeInInterval;
var animationSpeed = 1000/fps;
var paused = false;
var debug = false;

var cursorX;
var cursorY;

var cursorOffsetX = 0;
var cursorOffsetY = 0;

var cursorHidden = false;

//arrays to keep track of all celestial bodeis
var stars = [];
var bodies = [];

var activeBody = false;

function initSystem(){
	setupCanvas();

	blackOverlay.style.background = "rgba(0, 0, 0, 1)";

	renderBackgroundStars();

	generateRandomSystem();
	//loadManualSystem(); 
	renderStars();

	animationInterval = window.setInterval(animate,animationSpeed);
	document.title = stars[0].name+" System";

	fadeIn();
}

function clearSystem(){
	clearInterval(animationInterval);
	clearInterval(fadeInInterval);

	ctxTX.clearRect(0,0,canvasWidth,canvasHeight);
	ctxLM.clearRect(0,0,canvasWidth,canvasHeight);
	ctxST.clearRect(0,0,canvasWidth,canvasHeight);
	ctxPL.clearRect(0,0,canvasWidth,canvasHeight);
	ctxBG.clearRect(0,0,canvasWidth,canvasHeight);

	bodies = [];
	stars = [];
	species = [];
}

function nextSystem(){
	clearSystem();
	initSystem();

	paused = false;
	pauseButton.value = " | | ";

	document.getElementById("nextSystemButton").blur();
}

function setupCanvas(){

	canvasWidth = window.innerWidth*2;
	canvasHeight = window.innerHeight*2.5;

	canvasOffsetX = window.innerWidth/2-canvasWidth/2;
	canvasOffsetY = window.innerHeight/2-canvasHeight/2;

	blackOverlay.width = canvasWidth;
	blackOverlay.height = canvasHeight;

	textCanvas.width = canvasWidth;
	textCanvas.height = canvasHeight;

	planetCanvas.width = canvasWidth;
	planetCanvas.height = canvasHeight;

	starCanvas.width = canvasWidth;
	starCanvas.height = canvasHeight;

	backgroundCanvas.width = canvasWidth;
	backgroundCanvas.height = canvasHeight;

	lightMaskCanvas.width = canvasWidth;
	lightMaskCanvas.height = canvasHeight;

	//center the canvas
    lightMaskCanvas.style.marginLeft = canvasOffsetX;
    lightMaskCanvas.style.marginTop = canvasOffsetY;

    starCanvas.style.marginLeft = canvasOffsetX;
    starCanvas.style.marginTop = canvasOffsetY;

    planetCanvas.style.marginLeft = canvasOffsetX;
    planetCanvas.style.marginTop = canvasOffsetY;

    backgroundCanvas.style.marginLeft = canvasOffsetX;
    backgroundCanvas.style.marginTop = canvasOffsetY;
}

function keyDownRecieved(e){
	switch(e.keyCode){
		//enter
		case 13:
		nextSystem();
		break;

		//space
		case 32:
		nextSystem();
		break;
	}
}