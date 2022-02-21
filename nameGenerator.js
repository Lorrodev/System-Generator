function generateRandomName(){
	var numOfWords = Math.random()*1.03;

	var name = "";

	for(var i = 0; i < numOfWords; i++){
		name += generateRandomWord();

		if(Math.random() > 0.5 && i+1 < numOfWords){
			name += " ";
		}else if(i+1 < numOfWords){
			name += "'";
		}
	}

	return name.charAt(0)+name.slice(1).toLowerCase();
}

function generateRandomWord(){
	var vowels = ["A","E","I","O","U"];
	var consonants = ["B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Y","Z"];

	var vowelChance = 0;

	var word = "";

	for(var i = 0; i < Math.random()*4+2; i++){
		if(Math.random()+vowelChance>0.5){
			word += vowels[Math.round(Math.random()*(vowels.length-1))];
			vowelChance -= 0.08;
		}else{
			word += consonants[Math.round(Math.random()*(consonants.length-1))];
			vowelChance += 0.16;
		}
	}

	return word;
}