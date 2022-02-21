function generateRandomSystem(){
	generateRandomStar();

	for(var i = 0; i < Math.random()*6+2; i++){
		generateRandomPlanet();
	}

	var numberNames = ["&times;10<sup>6</sup>","&times;10<sup>9</sup>","&times;10<sup>12</sup>"];

	//cahnces for up to 3 different species
	if(bodies.length >= 3){
		for(var i = 0; i < 3; i++){
			if(Math.random() > 0.85){
				species.push([generateRandomName(),Math.round((Math.random()*9+1)*100)/100,Math.round(Math.random()*2)]);
			}
		}
	}else{
		for(var i = 0; i < bodies.length; i++){
			if(Math.random() > 0.85){
				species.push([generateRandomName(),Math.round((Math.random()*9+1)*100)/100,Math.round(Math.random()*2)]);
			}
		}
	}

	if(species.length != 0 && bodies.length > 0){
		intelligentLife = true;

		species.forEach(function(species){

			//get the available planets
			var availableBodies = 0;
			bodies.forEach(function(body){
				if (body.species == "None") {
					availableBodies++;
				}
			});

			//chances for a multi planetary species
			if(Math.random() > 0.4 && availableBodies > 1){
				var population = 1;

				do{
					var body = bodies[Math.round(Math.random()*(bodies.length-1))];
				}while(body.species != "None");

				body.species = species[0];

				var percentage = Math.random()*0.25+0.7
				body.population = Math.round(species[1]*percentage*100)/100+" "+numberNames[species[2]];
				population -= percentage;

				//since one body was just occupied
				availableBodies--;

				for(var i = 0; i < availableBodies; i++){
					//the last available body will take the rest of the population
					if(i == availableBodies-1 && population > 0){
						do{
							var body = bodies[Math.round(Math.random()*(bodies.length-1))];
						}while(body.species != "None");

						body.species = species[0];

						percentage = population;
						body.population = Math.round(species[1]*percentage*100)/100+" "+numberNames[species[2]];
						population -= percentage;
					}else if(population > 0){
						do{
							var body = bodies[Math.round(Math.random()*(bodies.length-1))];
						}while(body.species != "None");

						body.species = species[0];

						percentage = Math.random()*5+0.1
						body.population = Math.round(species[1]*percentage*100)/100+" "+numberNames[species[2]];
						population -= percentage;
					}
				}
			//single planetary species
			}else if(availableBodies != 0){

				do{
					var body = bodies[Math.round(Math.random()*(bodies.length-1))];
				}while(body.species != "None");

				body.species = species[0];
				body.population = species[1]+" "+numberNames[species[2]];	
			}
		});
	}
}

function generateRandomStar(){
	var star = new Body(
		Math.random()*45+35,	//radius
		Math.random()*35+25,	//mass
		canvasWidth/2,	//xPos
		canvasHeight/2,	//yPos
		"star",	//type
		colors[Math.round(Math.random()*(colors.length-1))],	//star color
		false,
		generateRandomName()	
		);

	prevOrbitRadius = star.radius*1.5;
}


function generateRandomPlanet(){
	var star = stars[0];

	//radius
	var radius = Math.random()*30+10;

	//position
	if(Math.random() >= 0.5){
		mult1 = -1;
	}else{
		mult1 = 1;
	}

	if(Math.random() >= 0.5){
		mult2 = -1;
	}else{
		mult2 = 1;
	}

	var randomVector = [Math.random()*mult1,Math.random()*mult2];
	var magRandomVect = Math.sqrt(Math.pow(randomVector[x],2)+Math.pow(randomVector[y],2));

	var randomUnitVector = [randomVector[x]/magRandomVect,randomVector[y]/magRandomVect];

	var xPos = canvasWidth/2+randomUnitVector[x]*(prevOrbitRadius + minDistance + radius)*(Math.random()*1.1+1);
	var yPos = canvasHeight/2+randomUnitVector[y]*(prevOrbitRadius + minDistance + radius)*(Math.random()*1.1+1);

	var magStarToPlanet = Math.sqrt(Math.pow(xPos - star.xPos,2) + Math.pow(yPos - star.yPos,2));

	//"Skip" ceratin planets for more diversity in orbits
	//and only generate visible planets
	if(Math.random() > 0.23 && magStarToPlanet < canvasHeight/2){
		//atmosphere
		if (Math.random()>=0.5) {
			var atmosphere = colors[Math.round(Math.random()*(colors.length-1))];
		}else{
			var atmosphere = false;
		}

		var mass = Math.random()*20+60;

		var planet = new Body(
			radius,	//radius
			mass,	//mass
			xPos,	//xPos
			yPos,	//yPos
			"planet",	//type
			colors[Math.round(Math.random()*(colors.length-1))],	//planet color
			atmosphere,	//atmosphere color
			generateRandomName(),
			star
			);

		planet.circularizeOrbit(star);

		prevMoonOrbitRadius = radius*2;

		//Generate up to 3 moons for each planet

		for(var i = 0; i < 3; i++){
			if(Math.random() > 0.75 && magStarToPlanet/mass > 7){
				//radius
				var moonRadius = Math.random()*6+2;

				//position
				if(Math.random() >= 0.5){
					moonMult1 = -1;
				}else{
					moonMult1 = 1;
				}

				if(Math.random() >= 0.5){
					moonMult2 = -1;
				}else{
					moonMult2 = 1;
				}

				var randomMoonVector = [Math.random()*moonMult1,Math.random()*moonMult2];
				var magRandomMoonVect = Math.sqrt(Math.pow(randomMoonVector[x],2)+Math.pow(randomMoonVector[y],2));

				var randomMoonUnitVector = [randomMoonVector[x]/magRandomMoonVect,randomMoonVector[y]/magRandomMoonVect];

				var moonXPos = xPos+randomMoonUnitVector[x]*(prevMoonOrbitRadius + minMoonDistance + moonRadius)*(Math.random()/3+1);
				var moonYPos = yPos+randomMoonUnitVector[y]*(prevMoonOrbitRadius + minMoonDistance + moonRadius)*(Math.random()/3+1);

				//atmosphere
				if (Math.random()>=0.5) {
					var moonAtmosphere = colors[Math.round(Math.random()*(colors.length-1))];
				}else{
					var moonAtmosphere = false;
				}

				//if current PLANETARY orbit - current MOON orbit - moon radius > previous Orbit (inclusive moons)
				if(Math.sqrt(Math.pow(xPos-canvasWidth/2,2)+Math.pow(yPos-canvasHeight/2,2)) - (moonRadius+Math.sqrt(Math.pow(moonXPos-xPos,2)+Math.pow(moonYPos-yPos,2))) > prevOrbitRadius){
					var moon = new Body(
						moonRadius,	//radius
						Math.random()*0,	//mass
						moonXPos,	//xPos
						moonYPos,	//yPos
						"moon",	//type
						colors[Math.round(Math.random()*(colors.length-1))],	//moon color
						moonAtmosphere,	//atmosphere color
						generateRandomName(),
						planet
						);

					moon.circularizeOrbit(planet);

					prevMoonOrbitRadius = (moonRadius+Math.sqrt(Math.pow(moonXPos-xPos,2)+Math.pow(moonYPos-yPos,2)));
				}
			}
		}
	}

	prevOrbitRadius = (prevMoonOrbitRadius+Math.sqrt(Math.pow(xPos-canvasWidth/2,2)+Math.pow(yPos-canvasHeight/2,2)));
}

//Render random stars on the backgroundCanvas
function renderBackgroundStars(){
	for(var i = 0; i < (canvasWidth/60*canvasHeight/60); i++){
		ctxBG.fillStyle = "rgba("+(255-Math.round(Math.random()*70))+","+(255-Math.round(Math.random()*70))+","+(255-Math.round(Math.random()*70))+", 1)";
		ctxBG.beginPath();
		ctxBG.arc(Math.random()*canvasWidth, Math.random()*canvasHeight,Math.random()*1.2,0,2*Math.PI); //r=1.2
		ctxBG.fill();
	}

	if(Math.random() >= 0.5){
		mult = 1;
	}else{
		mult = -1;
	}

	var deltaY = 0;
	var xPos = 0;
	var yPos = canvasHeight/2+(Math.random()*canvasHeight/4)*mult;


	var randColor = colors[Math.round(Math.random()*(colors.length-1))];

	while(xPos < canvasWidth){
		if(Math.random() >= 0.5){
			multX = 1;
		}else{
			multX = -1;
		}

		if(Math.random() >= 0.5){
			multY = 1;
		}else{
			multY = -1;
		}

		var randXVariance = 1/Math.pow(Math.random()-0.5,2) * multX;

		// - random because the function is undefined at x=0 which results in a gap in the middle if
		//the galaxy is lying on a horizontal line
		var randYVariance = 1/Math.pow(Math.random()-0.5,2) * multY + (Math.random()*10*multX);

		ctxBG.fillStyle = "rgba("+(255-Math.round(Math.random()*70))+","+(255-Math.round(Math.random()*70))+","+(255-Math.round(Math.random()*70))+", 1)";
		ctxBG.beginPath();
		ctxBG.arc(xPos+randXVariance*3, yPos+randYVariance*3, Math.random()*1.2,0,2*Math.PI); //r=1.2
		ctxBG.fill();

		var randMultiplicator = Math.random()*20;

		var glowGradient = ctxBG.createRadialGradient(
				xPos+randYVariance*randMultiplicator,
				yPos+randXVariance*randMultiplicator,
				0,
				xPos+randYVariance*randMultiplicator,
				yPos+randXVariance*randMultiplicator,
				80);

		glowGradient.addColorStop(0, "rgba("+randColor[2]+", 0.008)");
		glowGradient.addColorStop(1, "rgba("+randColor[2]+", 0)");

		ctxBG.fillStyle = glowGradient;
		ctxBG.beginPath();
		ctxBG.arc(xPos+randYVariance*randMultiplicator, yPos+randXVariance*randMultiplicator, 80, 0, 2*Math.PI); 
		ctxBG.fill();

		deltaY += Math.random()/100*multY;

		yPos += deltaY;
		xPos += Math.random()*0.5+0.5;
	}
}


function loadManualSystem(){
//Body(radius, mass, xPos, yPos, type, color, atmosphere, name, planet, atmosphericComposition = "", species = "None", population = "-")

	//var s1 = new Body(5, 0, canvasWidth, -200, "star", yellow, false, "S1");
	//var p1 = new Body(100, 0, canvasWidth/2, canvasHeight/2, "planet", red, false, "P1", s1);


	//Planets
	var s1 = new Body(80, 0, canvasWidth, 0, "star", blue, false, "Debug");
	var p1 = new Body(50, 0, canvasWidth/2, canvasHeight/2, "planet", turquoise, yellow, "P1", s1);
	var p2 = new Body(30, 0, canvasWidth/2-300, canvasHeight/2, "planet", red, false, "P2", s1);
	var p3 = new Body(40, 0, canvasWidth/2+300, canvasHeight/2, "planet", blue, false, "P3", s1);
	var p4 = new Body(40, 0, canvasWidth/2-600, canvasHeight/2, "planet", yellow, turquoise, "P4", s1);
	var p5 = new Body(30, 0, canvasWidth/2+600, canvasHeight/2, "planet", green, red, "P5", s1);

/*
	//Solar System
	var s1 = new Body(695, 0, canvasWidth/2-700, canvasHeight/2, "star", brown, false, "Sun");
	var p1 = new Body(2.4, 0, canvasWidth/2+200, canvasHeight/2, "planet", white, false, "Mercury", s1);
	p1.circularizeOrbit(s1);
	var p2 = new Body(6, 0, canvasWidth/2+330, canvasHeight/2, "planet", yellow, brown, "Venus", s1, "CO<sub>2</sub> N");
	p2.circularizeOrbit(s1);
	var p3 = new Body(6.4, 0, canvasWidth/2+480, canvasHeight/2, "planet", blue, blue, "Earth", s1, "N<sub>2</sub> O<sub>2</sub> Ar CO<sub>2</sub>", "Human");
	p3.circularizeOrbit(s1);
	var p4 = new Body(0.17, 0, canvasWidth/2+480, canvasHeight/2-20, "moon", white, false, "Moon", p3);
	p4.circularizeOrbit(p3);
	var p5 = new Body(3.4, 0, canvasWidth/2+630, canvasHeight/2, "planet", red, red, "Mars", s1, "CO<sub>2</sub> Ar");
	p5.circularizeOrbit(s1);
	var p6 = new Body(72, 0, canvasWidth/2+850, canvasHeight/2, "planet", brown, brown, "Jupiter", s1, "H<sub>2</sub> He");
	p6.circularizeOrbit(s1);
	var p7 = new Body(60, 0, canvasWidth/2+1080, canvasHeight/2, "planet", yellow, brown, "Saturn", s1, "H<sub>2</sub> He");
	p7.circularizeOrbit(s1);
	var p8 = new Body(26, 0, canvasWidth/2+1270, canvasHeight/2, "planet", turquoise, false, "Uranus", s1, "H<sub>2</sub> He");
	p8.circularizeOrbit(s1);
	var p9 = new Body(25, 0, canvasWidth/2+1420, canvasHeight/2, "planet", blue, false, "Neptune", s1, "H<sub>2</sub> He");
	p9.circularizeOrbit(s1);
*/
/*
	//Stars
	var star1 = new Body(50, 0, canvasWidth/2, canvasHeight/2, "star", white, false);
	var star2 = new Body(30, 0, canvasWidth/2-300, canvasHeight/2, "star", red, true);
	var star3 = new Body(40, 0, canvasWidth/2+300, canvasHeight/2, "star", blue, true);
	var star4 = new Body(30, 0, canvasWidth/2+600, canvasHeight/2, "star", green, true);
	var star5 = new Body(40, 0, canvasWidth/2-600, canvasHeight/2, "star", yellow, true);
*/

}