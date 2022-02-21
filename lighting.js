//Cast light for all stars
function castLight(){

	stars.forEach(function(star){
		ctxLM.globalCompositeOperation = "source-over";

		var grd = ctxLM.createRadialGradient(star.xPos, star.yPos, 0, star.xPos, star.yPos, star.radius*1.5);
		grd.addColorStop(0.63, "rgba(0, 0, 0, 0)");
		grd.addColorStop(0.64, "rgba(255, 255, 255, 0)");
		grd.addColorStop(0.66, "rgba("+star.color[2]+", 1)");
		grd.addColorStop(1, "rgba(0, 0, 0, 0)");

		ctxLM.fillStyle = grd;
		ctxLM.beginPath();
		ctxLM.arc(star.xPos, star.yPos, star.radius*1.5, 0, 2*Math.PI);
		ctxLM.fill();

		var lightGradient = ctxLM.createRadialGradient(star.xPos, star.yPos, star.radius, star.xPos, star.yPos, star.radius*30);
		lightGradient.addColorStop(0.1, "rgba("+star.color[2]+", "+0.07*brightness+")");
		lightGradient.addColorStop(0.7, "rgba("+star.color[2]+", 0)");


		ctxLM.beginPath();
		ctxLM.fillStyle = lightGradient;
		ctxLM.fillRect(0,0,canvasWidth,canvasHeight);

		bodies.forEach(function(body){

			//umbra
			if(body.radius < star.radius){

				ctxLM.globalCompositeOperation = "destination-out";

				var umbra = calculateShadows(star, body)[0];

				var umbraColorStop = [body.xPos+(umbra[1][x]-body.xPos),body.yPos+(umbra[1][y]-body.yPos)];

				var umbraGradient = ctxLM.createLinearGradient(body.xPos, body.yPos, umbraColorStop[x], umbraColorStop[y]);
				umbraGradient.addColorStop(0, "rgba(40, 40, 40, 0)");
				umbraGradient.addColorStop(0.2, "rgba(40, 40, 40, 0.8)");
				umbraGradient.addColorStop(0.7, "rgba(40, 40, 40, 0)");

				ctxLM.beginPath();
				ctxLM.moveTo(umbra[0][x],umbra[0][y]);
				ctxLM.lineTo(umbra[1][x],umbra[1][y]);
				ctxLM.lineTo(umbra[2][x],umbra[2][y]);
				ctxLM.moveTo(umbra[0][x],umbra[0][y]);

				ctxLM.fillStyle = umbraGradient;
				//ctxLM.fill();

			}

			//Penumbra
			var vectStarToBody = [body.xPos - star.xPos,body.yPos - star.yPos];

			var penumbra = calculateShadows(star, body)[1];

			var penumbraColorStop = [body.xPos+vectStarToBody[x]*3, body.yPos+vectStarToBody[y]*3];
			
			ctxLM.globalCompositeOperation = "destination-out";

			var penumbraGradient = ctxLM.createLinearGradient(body.xPos, body.yPos, penumbra[0][x], penumbra[0][y]);

			penumbraGradient.addColorStop(0.4, "rgba(23, 23, 23, 0.5)");
			penumbraGradient.addColorStop(1, "rgba(23, 23, 23, 0)");

			ctxLM.fillStyle = penumbraGradient;

			ctxLM.beginPath();
			ctxLM.moveTo(body.xPos,body.yPos);
			ctxLM.lineTo(penumbra[0][x],penumbra[0][y]);
			ctxLM.lineTo(penumbra[1][x],penumbra[1][y]);
			ctxLM.lineTo(penumbra[1][x]-(penumbra[1][x]-penumbra[2][x])/2, penumbra[1][y]-(penumbra[1][y]-penumbra[2][y])/2);
			ctxLM.lineTo(body.xPos,body.yPos);
			ctxLM.fill();

			penumbraGradient = ctxLM.createLinearGradient(body.xPos, body.yPos, penumbra[3][x], penumbra[3][y]);
			penumbraGradient.addColorStop(0.4, "rgba(23, 23, 23, 0.5)");
			penumbraGradient.addColorStop(1, "rgba(23, 23, 23, 0)");

			ctxLM.fillStyle = penumbraGradient;

			ctxLM.beginPath();
			ctxLM.moveTo(body.xPos,body.yPos);
			ctxLM.lineTo(penumbra[3][x],penumbra[3][y]);
			ctxLM.lineTo(penumbra[2][x],penumbra[2][y]);
			ctxLM.lineTo(penumbra[1][x]-(penumbra[1][x]-penumbra[2][x])/2, penumbra[1][y]-(penumbra[1][y]-penumbra[2][y])/2);
			ctxLM.lineTo(body.xPos,body.yPos);
			ctxLM.fill();

			//penumbra shadown on body
			var shadowCircleCenter = [
				//center of the penumbra line on the planet		//offset of half of the line _|_
				(penumbra[0][x]-penumbra[3][x])/2+penumbra[3][x]-(penumbra[0][y]-penumbra[3][y])/1.5*-1,
				(penumbra[0][y]-penumbra[3][y])/2+penumbra[3][y]-(penumbra[0][x]-penumbra[3][x])/1.5
			];

			var penumbraCircleRadius = Math.sqrt(Math.pow(shadowCircleCenter[x]-penumbra[3][x],2)+Math.pow(shadowCircleCenter[y]-penumbra[3][y],2));

			var penumbraShadowGradient = ctxPL.createRadialGradient(shadowCircleCenter[x],
																shadowCircleCenter[y],
																penumbraCircleRadius,
																shadowCircleCenter[x],
																shadowCircleCenter[y],
																penumbraCircleRadius+2*body.radius
																);

			if(body.radius < star.radius){
				penumbraShadowGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
				penumbraShadowGradient.addColorStop(0.2, "rgba(0, 0, 0, 0.4)");
				penumbraShadowGradient.addColorStop(0.95, "rgba(0, 0, 0, 0.7)");
				penumbraShadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
			}else{
				penumbraShadowGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
				penumbraShadowGradient.addColorStop(0.1, "rgba(0, 0, 0, 0.5)");
				penumbraShadowGradient.addColorStop(0.25, "rgba(0, 0, 0, 1)");
				penumbraShadowGradient.addColorStop(0.95, "rgba(0, 0, 0, 1)");
				penumbraShadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
			}

			ctxPL.globalCompositeOperation = "source-atop";
			ctxPL.fillStyle = penumbraShadowGradient;

			ctxPL.beginPath();
			ctxPL.arc(body.xPos, body.yPos, body.radius*1.5, 0, 2*Math.PI);
			ctxPL.fill();

			//umbra shadow on body
			if(body.radius < star.radius){
				var umbraCircleRadius = Math.sqrt(Math.pow(shadowCircleCenter[x]-umbra[0][x],2)+Math.pow(shadowCircleCenter[y]-umbra[0][y],2));

				var umbraShadowGradient = ctxPL.createRadialGradient(shadowCircleCenter[x],
																shadowCircleCenter[y],
																umbraCircleRadius,
																shadowCircleCenter[x],
																shadowCircleCenter[y],
																umbraCircleRadius+body.radius
																);

				umbraShadowGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
				umbraShadowGradient.addColorStop(0.3, "rgba(0, 0, 0, 0.7)");
				umbraShadowGradient.addColorStop(0.5, "rgba(0, 0, 0, 1)");
				umbraShadowGradient.addColorStop(0.95, "rgba(0, 0, 0, 1)");
				umbraShadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

				ctxPL.fillStyle = umbraShadowGradient;

				ctxPL.beginPath();
				ctxPL.arc(body.xPos, body.yPos, body.radius*1.5, 0, 2*Math.PI);
				ctxPL.fill();
			}
			ctxPL.globalCompositeOperation = "source-over";

		});
		ctxLM.globalCompositeOperation = "source-over";
	});
}

//Casting all of the shadows

function calculateShadows(star, body){
	
	//Get the ratio using the two radii
	var ratio = star.radius/(star.radius+body.radius);

	//Get the vector from the Star to the body
	var vectStarToBody = [body.xPos - star.xPos,body.yPos - star.yPos];

	//Get the angle aplha between the x-axis and vectStarTobody
	var alpha = Math.atan2(vectStarToBody[y], vectStarToBody[x]);

	//Get the magnitude of vectStarToBody
	var magStarToBody = Math.sqrt(Math.pow(vectStarToBody[x],2)+Math.pow(vectStarToBody[y],2));

	// === START Define the inner rays (= tangents that cross between the star and body)

	//Get the intersection point of the two inner rays
	var innerIntersection = [star.xPos+ratio*vectStarToBody[x],star.yPos+ratio*vectStarToBody[y]];

	//Get the vector from the Star to the intersection point
	var vectStarToInnerIntersection = [innerIntersection[x]-star.xPos,innerIntersection[y]-star.yPos];

	//Get the angle between vectStarToBody and vectStarToP1 / P2 (<= not defined yet)
	var innerBeta = Math.acos(star.radius/Math.sqrt(Math.pow(vectStarToInnerIntersection[x],2)+Math.pow(vectStarToInnerIntersection[y],2)));

	//Get the start points on the star for the two inner rays
	var innerRay1StartPoint = [star.xPos+star.radius*Math.cos(alpha+innerBeta),star.yPos+star.radius*Math.sin(alpha+innerBeta)];
	var innerRay2StartPoint = [star.xPos+star.radius*Math.cos(alpha-innerBeta),star.yPos+star.radius*Math.sin(alpha-innerBeta)];

	//Get the end points on the body for the two inner rays
	var innerRay1EndPoint = [body.xPos+body.radius*Math.cos(Math.PI+alpha+innerBeta),body.yPos+body.radius*Math.sin(Math.PI+alpha+innerBeta)];
	var innerRay2EndPoint = [body.xPos+body.radius*Math.cos(Math.PI+alpha-innerBeta),body.yPos+body.radius*Math.sin(Math.PI+alpha-innerBeta)];

	//Get the actual rays (vectors)
	var vectInnerRay1 = [(innerRay1EndPoint[x]-innerRay1StartPoint[x]),(innerRay1EndPoint[y]-innerRay1StartPoint[y])];
	var vectInnerRay2 = [(innerRay2EndPoint[x]-innerRay2StartPoint[x]),(innerRay2EndPoint[y]-innerRay2StartPoint[y])];

	//Setting the inner rays to a specific distance
	var magInnerRay1 = Math.sqrt(Math.pow(vectInnerRay1[x],2)+Math.pow(vectInnerRay1[y],2));
	vectInnerRay1 = [vectInnerRay1[x]/magInnerRay1*10000,vectInnerRay1[y]/magInnerRay1*10000];

	var magInnerRay2 = Math.sqrt(Math.pow(vectInnerRay2[x],2)+Math.pow(vectInnerRay2[y],2));
	vectInnerRay2 = [vectInnerRay2[x]/magInnerRay2*10000,vectInnerRay2[y]/magInnerRay2*10000];

	//Get a second end point for the inner rays
	var innerRay1EndPoint2 = [innerRay1EndPoint[x]+vectInnerRay1[x],innerRay1EndPoint[y]+vectInnerRay1[y]];
	var innerRay2EndPoint2 = [innerRay2EndPoint[x]+vectInnerRay2[x],innerRay2EndPoint[y]+vectInnerRay2[y]];

	// === END Define inner rays


	// === START Define outer rays (= tangents that cross behind the body)

	//Get the magnitude of the vectStarToOuterIntersection
	var magStarToOuterIntersection = magStarToBody+(magStarToBody*body.radius)/(star.radius-body.radius);

	//Get the intersection point of the two outer rays
	var outerIntersection = [
		star.xPos+vectStarToBody[x]/magStarToBody*magStarToOuterIntersection,
		star.yPos+vectStarToBody[y]/magStarToBody*magStarToOuterIntersection
	];
	
	//Get the vector from the Star to the intersection point
	var vectStarToOuterIntersection = [outerIntersection[x]-star.xPos,outerIntersection[y]-star.yPos];

	//Get the angle between vectStarToBody and vectStarToP3 / P4 (<= not defined yet)
	var outerBeta = Math.acos(star.radius/Math.sqrt(Math.pow(vectStarToOuterIntersection[x],2)+Math.pow(vectStarToOuterIntersection[y],2)));

	//Get the start points on the star for the two outer rays
	var outerRay1StartPoint = [star.xPos+star.radius*Math.cos(alpha+outerBeta),star.yPos+star.radius*Math.sin(alpha+outerBeta)];
	var outerRay2StartPoint = [star.xPos+star.radius*Math.cos(alpha-outerBeta),star.yPos+star.radius*Math.sin(alpha-outerBeta)];

	//Get the end points on the body for the two outer rays
	var outerRay1EndPoint = [body.xPos+body.radius*Math.cos(alpha+outerBeta),body.yPos+body.radius*Math.sin(alpha+outerBeta)];
	var outerRay2EndPoint = [body.xPos+body.radius*Math.cos(alpha-outerBeta),body.yPos+body.radius*Math.sin(alpha-outerBeta)];

	//Get the actual rays (vectors)
	var outerRay1 = [outerRay1StartPoint[x]-outerRay1EndPoint[x],outerRay1StartPoint[y]-outerRay1EndPoint[y]];
	var outerRay2 = [outerRay2StartPoint[x]-outerRay2EndPoint[x],outerRay2StartPoint[y]-outerRay2EndPoint[y]];

	// === END Define outer rays

	//Defining the umbra and penumbra
	var umbra = [
		[outerRay1EndPoint[x],outerRay1EndPoint[y]],
		[outerIntersection[x],outerIntersection[y]],
		[outerRay2EndPoint[x],outerRay2EndPoint[y]]
	];

	var penumbra = [
		[innerRay1EndPoint[x],innerRay1EndPoint[y]],
		[innerRay1EndPoint2[x],innerRay1EndPoint2[y]],
		[innerRay2EndPoint2[x],innerRay2EndPoint2[y]],
		[innerRay2EndPoint[x],innerRay2EndPoint[y]]
	];

	// === START Debug
	if(debug){
		ctxPL.beginPath();
		ctxPL.strokeStyle = debugRed;
		ctxPL.moveTo(star.xPos,star.yPos);
		ctxPL.lineTo(body.xPos,body.yPos);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(innerIntersection[x],innerIntersection[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.strokeStyle = debugGreen;
		ctxPL.moveTo(star.xPos-20,star.yPos);
		ctxPL.lineTo(star.xPos+20,star.yPos);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.moveTo(body.xPos-20,body.yPos);
		ctxPL.lineTo(body.xPos+20,body.yPos);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.moveTo(innerIntersection[x]-20,innerIntersection[y]);
		ctxPL.lineTo(innerIntersection[x]+20,innerIntersection[y]);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.strokeStyle = debugRed;
		ctxPL.arc(innerRay1StartPoint[x],innerRay1StartPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(innerRay2StartPoint[x],innerRay2StartPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(innerRay1EndPoint[x],innerRay1EndPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(innerRay2EndPoint[x],innerRay2EndPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(outerIntersection[x],outerIntersection[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.strokeStyle = debugGreen;
		ctxPL.moveTo(outerIntersection[x]-20,outerIntersection[y]);
		ctxPL.lineTo(outerIntersection[x]+20,outerIntersection[y]);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.strokeStyle = debugRed;
		ctxPL.arc(outerRay1StartPoint[x],outerRay1StartPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(outerRay2StartPoint[x],outerRay2StartPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(outerRay1EndPoint[x],outerRay1EndPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.arc(outerRay2EndPoint[x],outerRay2EndPoint[y],5,0,2*Math.PI);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.strokeStyle = debugBlue;
		ctxPL.moveTo(innerRay1StartPoint[x],innerRay1StartPoint[y]);
		ctxPL.lineTo(innerRay1EndPoint2[x],innerRay1EndPoint2[y]);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.moveTo(innerRay2StartPoint[x],innerRay2StartPoint[y]);
		ctxPL.lineTo(innerRay2EndPoint2[x],innerRay2EndPoint2[y]);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.moveTo(outerRay1StartPoint[x],outerRay1StartPoint[y]);
		ctxPL.lineTo(outerIntersection[x],outerIntersection[y]);
		ctxPL.stroke();

		ctxPL.beginPath();
		ctxPL.moveTo(outerRay2StartPoint[x],outerRay2StartPoint[y]);
		ctxPL.lineTo(outerIntersection[x],outerIntersection[y]);
		ctxPL.stroke();
	}
	// === END Debug

	return [umbra, penumbra, innerIntersection];
}