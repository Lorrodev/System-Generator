//constructor for celestial bodies
function Body(radius, mass, xPos, yPos, type, color, atmosphere, name, planet, atmosphericComposition = "", species = "None", population = "-"){
	this.radius = radius;
	this.mass = mass;
	this.xPos = xPos;
	this.yPos = yPos;
	this.type = type;
	this.color = color;
	this.atmosphere = atmosphere;
	this.atmosphericComposition = atmosphericComposition;
	this.name = name;
	this.planet = planet;
	this.species = species;
	this.population = population;

	//var circularOrbitVect = getCircularOrbitVect(this, stars[0]);

	this.xVel = 0;
	this.yVel = 0;

	this.render = function(){

		//Render planet or moon
		if(this.type == "planet" || this.type == "moon"){
			var grd = ctxPL.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.radius);
			grd.addColorStop(0.3, "rgba("+this.color[0]+", 1)");
			grd.addColorStop(1,  "rgba("+this.color[1]+", 1)");

			ctxPL.fillStyle = grd;
			ctxPL.beginPath();
			ctxPL.arc(this.xPos, this.yPos, this.radius, 0, 2*Math.PI);
			ctxPL.fill();

			var xPos = this.xPos;
			var yPos = this.yPos;
			var color = this.color;

			this.surfaceDetails.forEach(function(detail){

				var grd = ctxPL.createRadialGradient(detail[x]+xPos, detail[y]+yPos, 0, detail[x]+xPos, detail[y]+yPos, detail[2]);
				grd.addColorStop(0.9, "rgba("+color[1]+", 1)");
				grd.addColorStop(1,  "rgba("+color[1]+", 0)");

				ctxPL.globalCompositeOperation = "source-atop";
				ctxPL.beginPath();
				ctxPL.fillStyle = grd;
				ctxPL.arc(detail[x]+xPos, detail[y]+yPos, detail[2], 0, 2*Math.PI);
				ctxPL.fill();
				ctxPL.globalCompositeOperation = "source-over";
			});

			if (this.atmosphere != false) {
				var grd = ctxPL.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.radius*1.5);
				/*grd.addColorStop(0, debugRed);
				grd.addColorStop(1,  debugGreen);*/
				
				grd.addColorStop(0.2, "rgba("+this.atmosphere[2]+", 0.1)");
				grd.addColorStop(0.6,  "rgba("+this.atmosphere[2]+", 0.5)");
				grd.addColorStop(0.65,  "rgba("+this.atmosphere[2]+", 0.9)");
				grd.addColorStop(0.8,  "rgba("+this.atmosphere[2]+", 0.0)");

				ctxPL.globalCompositeOperation = "source-over";
				ctxPL.fillStyle = grd;
				ctxPL.beginPath();
				ctxPL.arc(this.xPos, this.yPos, this.radius*1.5, 0, 2*Math.PI);
				ctxPL.fill();
			}
		//Render star
		}else{
			var grd = ctxST.createRadialGradient(this.xPos, this.yPos, 0, this.xPos, this.yPos, this.radius*1);
			grd.addColorStop(0.1, "rgba("+this.color[2]+", 1)");
			grd.addColorStop(1,  "rgba("+white[0]+"1)");

			ctxST.beginPath();
			ctxST.fillStyle = grd;
			ctxST.arc(this.xPos, this.yPos, this.radius, 0, 2*Math.PI);
			ctxST.fill();

			var xPos = this.xPos;
			var yPos = this.yPos;
			var color = this.color;

			this.surfaceDetails.forEach(function(detail){
					ctxST.globalCompositeOperation = "source-atop";
					ctxST.beginPath();
					ctxST.fillStyle = "rgba(255,255,255,0.2)";
					ctxST.arc(detail[x]+xPos, detail[y]+yPos, detail[2], 0, 2*Math.PI);
					ctxST.fill();
					ctxST.globalCompositeOperation = "source-over";
			});
		}

	};

	this.generateRandomSurface = function(){
		var surfaceDetails = [];

		if(this.type == "planet"){
			var amount = Math.random()*this.radius+this.radius*2;
			var size = 1/10;
			var minSize = this.radius*0.01;
		}else{
			var amount = Math.random()*Math.pow(this.radius,1.2)+this.radius*20;
			var size = 1/20;
			var minSize = 0;
		}

		for (var i = 0; i < amount; i++) {
			surfaceDetails.push([
				Math.random()*this.radius*2-this.radius,
				Math.random()*this.radius*2-this.radius,
				Math.random()*this.radius*size+minSize
			]);
		}

		return surfaceDetails;
	}

	this.generateRandomAtmosphere = function(){
		if(this.atmosphere != false && this.atmosphericComposition == ""){
			var elements = ["H<sub>2</sub>","He","N<sub>2</sub>","O<sub>2</sub>","F","Ne","Cl","Ar","Kr","Xe","Rn","S<sub>2</sub>"];

			var composition = "";

			for(var i = 0; i < Math.random()*2+1; i++){
				var rand = Math.round(Math.random()*(elements.length-1));

				composition += elements[rand]+" ";
				elements.splice(rand, 1);
			}
		}else if(this.atmosphericComposition == ""){
			composition = "None";
		}else{
			composition = this.atmosphericComposition;
		}

		return composition;
	}

	this.surfaceDetails = this.generateRandomSurface();
	this.atmosphericComposition = this.generateRandomAtmosphere();

	this.circularizeOrbit = function(bodyToOrbit){
		var gravVectThisToBodyToOrbit = calculateGravitationalForces(this, bodyToOrbit);
		var magGravThisToBodyToOrbit = Math.sqrt(Math.pow(gravVectThisToBodyToOrbit[x],2)+Math.pow(gravVectThisToBodyToOrbit[y],2));

		var vectThisToBodyToOrbit = [this.xPos - bodyToOrbit.xPos,this.yPos - bodyToOrbit.yPos];
		var magThisToBodyToOrbit = Math.sqrt(Math.pow(vectThisToBodyToOrbit[x],2) + Math.pow(vectThisToBodyToOrbit[y],2));

		var circularOrbitVelocity = Math.sqrt(magGravThisToBodyToOrbit * magThisToBodyToOrbit);

		if(Math.random() > 0.9){
			var swap = -1;
		}else{
			var swap = 1;
		}

		//change x and y for 90° vector and add the velocity of the body to orbit
		this.xVel = bodyToOrbit.xVel+(vectThisToBodyToOrbit[y]/magThisToBodyToOrbit)*circularOrbitVelocity*(-1)*spin*swap;
		this.yVel = bodyToOrbit.yVel+(vectThisToBodyToOrbit[x]/magThisToBodyToOrbit)*circularOrbitVelocity*spin*swap;
	};

	//Adds the body to the corresponding list
	if(this.type == "star"){
		stars.push(this);
	}else{
		bodies.push(this);
	}
}

function renderBodies(){
	bodies.forEach(function(body){
		body.render();
	});
}

function renderStars(){
	stars.forEach(function(star){
		star.render();
	});
}

//Returns the gravitational vector from body1 towards body2
function calculateGravitationalForces(body1, body2) {
	var vectBody1ToBody2 = [body2.xPos - body1.xPos,body2.yPos - body1.yPos];
	var magBody1ToBody2 = Math.sqrt(Math.pow(vectBody1ToBody2[x],2)+Math.pow(vectBody1ToBody2[y],2));

	return [
		(vectBody1ToBody2[x]/magBody1ToBody2)*(body2.mass*massScale),
		(vectBody1ToBody2[y]/magBody1ToBody2)*(body2.mass*massScale)
	];
}

//Writes the gravitational forces into the planets xVel and yVel variables
function updateGravitationalForces(){
	//For every planet, calculate and update the garavitaional vector...
	bodies.forEach(function(body){

		//...towards every star...
		stars.forEach(function(star){
			var vectBodyToStar = calculateGravitationalForces(body, star);

			body.xVel += vectBodyToStar[x];
			body.yVel += vectBodyToStar[y];
		});

		if(body.type == "moon") {
			//...and - if its a moon - towrards its planet
			var vectMoonToPlanet = calculateGravitationalForces(body, body.planet);

			body.xVel += vectMoonToPlanet[x];
			body.yVel += vectMoonToPlanet[y];
		}
	});
}

//Updates the planets positions by adding their own velocity to their current position
function updateBodyPositions(){
	bodies.forEach(function(body){
		body.xPos += body.xVel;
		body.yPos += body.yVel;
	});
}