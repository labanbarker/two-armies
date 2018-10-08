var FLAG_DIR = "/client/img/flags/";
var TIMEOUT_BATTLE = "";
var TIMEOUT_CALC = "";
var TIMEOUT_MSG = "";
var TIMER_RELOAD_PAGE = 15000;
var TIMER_PARTY = 15000;

function Army() {
	this.img           = undefined;
    this.flag 		   = "";
    this.numSoldiers   = 0;
    this.soldierSizes  = [];
    this.soldiersUsed  = 0;
    this.stillStanding = false;
}

var army  = new Army();
var army2 = new Army();

$(document).ready(function() {

	var armies = [];
	
	$.ajax({ 
        type: 'GET', 
        url: 'battle.php', 
        success: function(data) { 

        	$("#loading").hide();
        	$("#message").show();

        	var i = 0;
        	for (var key in data) {
    			if (data.hasOwnProperty(key)) {
        			safeConsole(key + " -> " + data[key]);
        			armies[i] = [key, data[key]];
        			i++;
    			}
    		}
    		prepareArmies();
		}, 
		error: function() { 
			alert("Error loading armies! Please refresh the page.");
        }
    });

	function prepareArmies() {

		safeConsole(armies.length + " armies created!");
		if (armies.length != 2) {
			alert("Error. There should be 2 armies;");
			return;
		}

		try {
    		army.flag 		  = armies[0][0];
    		army.numSoldiers  = armies[0][1].length; 
    		army.soldierSizes = armies[0][1];

    		army2.flag 		   = armies[1][0];
    		army2.numSoldiers  = armies[1][1].length; 
    		army2.soldierSizes = armies[1][1];

    	} catch(error) {
    		alert("Error creating armies: " + error);
    		return;
    	}

    	message(army.flag + " <span>vs.</span> " + army2.flag, 3000);
    	$("#favicon").attr("href", FLAG_DIR + army.flag + ".png");

    	battlePositions();
	}

	function battlePositions() { 

		var html = "";

		for (var i = 0; i < army.numSoldiers; i++) { 
			html = '<img src="' + FLAG_DIR + army.flag + '.png" width="' + army.soldierSizes[i] + '" id="' + army.flag + '_' + i + '">';
			
			// make soldiers start from the front of the line
			$("#army").prepend(html);
		}

		html = "";

		for (var i = 0; i < army2.numSoldiers; i++) { 
			html += '<img src="' + FLAG_DIR + army2.flag + '.png" width="' + army2.soldierSizes[i] + '" id="' + army2.flag + '_' + i + '">';
		}

		$("#army2").html(html);

		doBattle();
	} 

	function doBattle() {

		clearTimeout(TIMEOUT_BATTLE);

		if (!army.stillStanding) {
			army.img = "#" + army.flag + "_" + army.soldiersUsed;
		}

		if (!army2.stillStanding) {
			army2.img = "#" + army2.flag + "_" + army2.soldiersUsed;
		}

		safeConsole("soldiersUsed: " + army.soldiersUsed + " / army.numSoldiers: " + army.numSoldiers);
		safeConsole("soldiersUsed2: " + army2.soldiersUsed + " / army2.numSoldiers: " + army2.numSoldiers);

		// any soldiers left? If not, battle is over
		if (army.soldiersUsed >= army.numSoldiers) {
			message(army2.flag + " <span>is victorious!</span>");
			battleOver(army2);
			return;
		}
		if (army2.soldiersUsed >= army2.numSoldiers) {
			message(army.flag + " <span>is victorious!</span>");
			battleOver(army);
			return;
		}

		if (!army.stillStanding) {
			var distance = parseInt($(".army").css("width")) - parseInt($(army.img).css("width")); 
    		$(army.img).css("z-index", 2);
    		$(army.img).css("position", "absolute");
    		$(army.img).animate({"left": distance+"px"}, 1000);
    		$(army.img).animate({"bottom": "0px" }, 500);
    		$(army.img).css("opacity", 1);
    	}

    	if (!army2.stillStanding) {
    		var distance2 = parseInt($(".army").css("width")) - parseInt($(army2.img).css("width")); 
    		$(army2.img).css("z-index", 2);
    		$(army2.img).css("position", "absolute");
    		$(army2.img).animate({"right": distance2+"px"}, 1000);
    		$(army2.img).animate({"bottom": "0px" }, 500);
    		$(army2.img).css("opacity", 1);
    	}

		TIMEOUT_CALC = setTimeout(function() {
			$(army.img).effect("bounce", getRand(500, 1000));
	    	$(army2.img).effect("bounce", getRand(500, 1000));
	    	calculateOdds();
		}, 1000);
	}

	function calculateOdds() {

		clearTimeout(TIMEOUT_CALC);

		var attackPoints = getRand(1, parseInt($(army.img).css("width")));
		var attackPoints2 = getRand(1, parseInt($(army2.img).css("width")));

		safeConsole(attackPoints + " to " + attackPoints2);

		// if score is tied, do a coin flip
		if (attackPoints == attackPoints2) {

			var coinflip = getRand(1, 2);
			safeConsole("coin flip!");

			if (coinflip == 1) {
				winsSkirmish("left", army2.img);
			} else {
				winsSkirmish("right", army.img);
			}

		} else {
			if (attackPoints > attackPoints2) {
				winsSkirmish("left", army2.img);
			} else {
				winsSkirmish("right", army.img);
			}
		}
	}

	function winsSkirmish(side, elem) {

		if (side == "left") { // left wins
			$(elem).effect("explode", 1000, function() { $(this).remove() });
			army2.soldiersUsed++;
			army.stillStanding = true;
			army2.stillStanding = false;

		} else { // right wins
			$(elem).effect("explode", 1000, function() { $(this).remove() });
			army.soldiersUsed++;
			army.stillStanding = false;
			army2.stillStanding = true;
		}

		TIMEOUT_BATTLE = setTimeout(function() {
			doBattle();
		}, 1500);
	}

	function battleOver(obj) {
		$("#favicon").attr("href", FLAG_DIR + obj.flag + ".png");

		$(".army").css("width", "100%");
		$(".army img").css("position", "relative");
		$(".army img").css("opacity", 1);

        // soldiers throw a party?
		$(".army img").each(function() {
			$(this).animate({"width": getRand(10, 100)+"%", "left": getRand(100, 500)+"px"}, TIMER_PARTY);
		});
		
		setTimeout(function() {
			location.reload();
		}, TIMER_RELOAD_PAGE);
	}

	// displays a message on the screen
	function message(txt, time) {
		clearTimeout(TIMEOUT_MSG);
		$("#message").show();
		$("#message").html(txt);
		if (time) {
    		TIMEOUT_MSG = setTimeout(function(){
    			$("#message").hide("fade", 2000);
    		}, time);
    	}
	}

	function safeConsole(msg) {
		try {
			console.log(msg);
		} catch (error) {}
	}

	// returns a random number between min and max
	function getRand(min, max) {
		var r = Math.floor(Math.random() * (max - min + 1)) + min;
		return r;
	}

});