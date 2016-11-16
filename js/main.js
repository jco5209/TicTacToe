/* jshint expr: true */

var game = (function() {

	/*
		'game' module sets up base componets which the rest of the game will depend upon 
	*/

	var exports = {
		start:  		document.getElementById("start"),
		board:  		document.getElementById("board"),
		finish: 		document.getElementById("finish"),
		playersDiv: 	document.getElementById("players-div"), 
	   	addPlayers1: 	document.getElementsByTagName("a")[0],
       	addPlayers2: 	document.getElementsByTagName("a")[1],
	    gameStart: 		document.getElementsByTagName("a")[2],
	  	player1Input:   document.createElement('input'),
	  	player2Input:   document.createElement('input'),
	  	AILabel:        document.createElement('label'),
	  	AIInput:        document.createElement('input'),
	  	AIDiv:          document.createElement('div'),
	  	AISpan:   		document.createElement('span'),
	  	AIDifficulty:   document.createElement('span'),
	  	player1Display: document.getElementById("player-name-1"),
		player2Display: document.getElementById("player-name-2"),
		player1:   		document.getElementById("player1"),
		player2:   		document.getElementById("player2"),
		boxes: 			document.querySelectorAll(".box"),
		winMessage: 	document.getElementsByClassName("message")[0],
		statusMessage: 	document.getElementsByClassName("status")[0],
		newGame: 		document.getElementById("new-game")
	};

	/*
		base stylings & element creation
	*/

	exports.board.style.display  = "none";
	exports.finish.style.display = "none";

	exports.player1Input.setAttribute("type", "text");
	exports.player1Input.setAttribute("class", "player0");
	exports.player1Input.setAttribute("placeholder", "Player 1");

	exports.player2Input.setAttribute("type", "text");
	exports.player2Input.setAttribute("class", "player0");
	exports.player2Input.setAttribute("placeholder", "Player 2");

	exports.AILabel.setAttribute("class", "switch");
	exports.AIInput.setAttribute("type", "checkbox");
	exports.AIDiv.setAttribute("class", "slider");

	exports.AILabel.appendChild(exports.AIInput);
	exports.AILabel.appendChild(exports.AIDiv);

	exports.AISpan.setAttribute("class", "ai-span");
	exports.AISpan.textContent = "AI: ";

	exports.AIDifficulty.setAttribute("class", "ai-difficulty");
	exports.AIDifficulty.textContent = "Easy";

	exports.AISpan.appendChild(exports.AIDifficulty);

	/*
		'name' prototype is used to store inputted value for player 1 / 2's name -
		'symbol' prototype is used to store appropiate mouseOver backgorund image for player 1 / 2 -
		'value' prototype is used to store appropiate applied value for gameplay logic for player 1 / 2
	*/
	exports.player1.name;
	exports.player2.name;

	exports.player1.symbol = "url('img/o.svg')";
	exports.player2.symbol = "url('img/x.svg')";

	exports.player1.value = 1;
	exports.player2.value = -1;

	/*
		'activePlayer()' if player1 contains class of 'active', reutrn as true | else return as false -
			if false, currently active player = player2

		'activeValue()' if activePlayer is true, current value is 1 | else current value is -1;  -
		'activeMouseOver()' returns currently active player's background image -
		'activeSymbol()' returns currently acitve player's appropiate symbol class -

		'boxIsEmpty()' is used in multiple loops to return all TTT boxes which are currently empty -

		'victor()' returns appropiate win screen class depending on which player was active when the game was won -
		'victorName()' returns either player1's inputted name or player2's inputted name, depending who won
	*/
	exports.activePlayer = function() {
		return (exports.player1.classList.contains('active')) ? true : false;
	};

	exports.activeValue = function() {
		return (exports.activePlayer()) ? 1 : -1;
	};

	exports.activeMouseOver = function() {
		return (exports.activePlayer()) ? "url('img/o.svg')" : "url('img/x.svg')";
	};

	exports.activeSymbol = function() {
		return (exports.activePlayer()) ? "box-filled-1" : "box-filled-2";
	};

	exports.boxIsEmpty = function(i) {
		return (!game.boxes[i].classList.contains("box-filled-1") && !game.boxes[i].classList.contains("box-filled-2")) ? true : false;
	};	

	exports.victor = function() {
		return (exports.activePlayer()) ? "screen-win-one" : "screen-win-two";
	};

	exports.victorName = function() {
		return (exports.activePlayer()) ? exports.player1.name : exports.player2.name;
	};

	/*
		'AI' is set to true "1 Player" is selected -
		'easy' is toggled to either true or false from HTML input
		'boxes.AI' will be used in the AI() logic - 
		'boxes.combo' will be used to calculate TTT game win scenario
	*/
	exports.AI = false;

	exports.easy = true;

	exports.boxes.AI;

	exports.boxes.combo;

	return exports;

}());



var titleScreen = (function() {

	var exports = {

	};

	/*
		if "1 Player" is selected, append player 1 name Input -
		append AI Label & Difficulty selector -

		remove player2Input if it exists in 'playersDiv'
	*/

	game.addPlayers1.onclick = function() {

		game.addPlayers2.className = "button";
		game.addPlayers1.className = "button player-amount";

		game.playersDiv.appendChild(game.player1Input);

		game.playersDiv.appendChild(game.AISpan);
		game.playersDiv.appendChild(game.AILabel);

		if(game.playersDiv.childNodes[3]) {
			game.playersDiv.removeChild(game.player2Input);
		}

	};

	/*
		on slider click, if AIDifficulty checkbox is checked, game.easy = false -
		else if unchecked, game.easy = true
	*/
	game.AIInput.onclick = function() {

		if(game.AIInput.checked) {
			game.AIDifficulty.textContent = "Hard";
			game.AIDifficulty.style.color = "#FFA000";
			game.easy = false;
		} else {
			game.AIDifficulty.textContent = "Easy";
			game.AIDifficulty.style.color = "#3688C3";
			game.easy = true;
		}

	};

	/*
		if "2 Players" is selected, append player 1 name Input & player 2 name Input -

		remove AI elements if they exist
	*/
	game.addPlayers2.onclick = function() {

		game.addPlayers1.className = "button";
		game.addPlayers2.className = "button player-amount";

		game.playersDiv.appendChild(game.player1Input);
		game.playersDiv.appendChild(game.player2Input);

		if(game.playersDiv.childNodes[2]) {
			game.playersDiv.removeChild(game.AISpan);
			game.playersDiv.removeChild(game.AILabel);
		}
	};

	/*
		if 1 Player was selected, give default name if none was input -
		else, displayed name is the input value -
		set AI to true - 
		launch game

		if 2 Players were selected, give default names if none were input -
		else, displayed name is hte input value -
		launch game

		if neither 1 Player or 2 Players were selected, give visual indicator 

	*/
	game.gameStart.onclick = function() {
		
		if(game.addPlayers1.classList.contains("player-amount")) {

			if(game.player1Input.value.length === 0) {
				game.player1.name = "Player 1";
				game.player2.name = "AI";
			} else { game.player1.name = game.player1Input.value; }
				
				game.AI = true;
				gamePlay.readyPlayer1();

		}

		else if(game.addPlayers2.classList.contains("player-amount")) {

			if(game.player1Input.value.length === 0) {
				game.player1.name = "Player 1";
			} else { game.player1.name = game.player1Input.value; }

			if(game.player2Input.value.length === 0) {
				game.player2.name = "Player 2";
			} else { game.player2.name = game.player2Input.value; }

			gamePlay.readyPlayers2();

		}

		else {
			game.addPlayers1.classList.add('alert');
			game.addPlayers2.classList.add('alert');
			setTimeout(function(){ game.addPlayers1.classList.remove('alert'); game.addPlayers2.classList.remove('alert'); }, 1000);
		}

	};	

	return exports;

}());



var gamePlay = (function() {

	var exports = {

	};

	/*
		'readyPlayer1()'  & 'readyPlayer2()' transistions the game from the title screen to the gameplay 
	*/

	exports.readyPlayer1 = function() {
		game.start.style.display = "none";
		game.board.style.display = "initial";
		game.player1Display.textContent = game.player1.name;
		game.player2Display.textContent = game.player2.name;
		game.player1.classList.add("active");
	};

	exports.readyPlayers2 = function() {
		game.start.style.display = "none";
		game.board.style.display = "initial";
		game.player1Display.textContent = game.player1.name;
		game.player2Display.textContent = game.player2.name;
		game.player1.classList.add("active");
	};

	/*
		each possible win scenario combination is an object within the tttMatrix object -
		each value is set to 0 and is incremented by either Postive 1 or Negative -1, depending on symbol ( o = + ; x = - ) -
		if any combination value ever equals either a postive 3 or negative 3, the game is won
		
		the 'boxes.combo' prototype is a function which, depending on the specific box, calculates possible win combinations from that box -
		for example, game.boxes[0].combo is the top left corner box, which has 3 win conditions - Diagonale 1, Horizontal 1, Vertical 1 -
		the combo function takes in all possible combinations and adds the currently active value (either a - 1 || + 1)	to the corrosponding object	

		'boxes.AI' holds an array of strings for all possible combinations for each particular box -
		these strings will be used within the AI logic to determine where to place its symbol
	*/

	exports.tttMatrix =	{D1: 0, H1: 0, H2: 0, H3: 0, V1: 0, V2: 0, V3: 0, D2: 0};

	game.boxes[0].combo = function() { exports.tttMatrix.D1 += game.activeValue(); exports.tttMatrix.H1 += game.activeValue(); exports.tttMatrix.V1 += game.activeValue();};
	game.boxes[1].combo = function() { exports.tttMatrix.H1 += game.activeValue(); exports.tttMatrix.V2 += game.activeValue();};
	game.boxes[2].combo = function() { exports.tttMatrix.D2 += game.activeValue(); exports.tttMatrix.H1 += game.activeValue(); exports.tttMatrix.V3 += game.activeValue();};

	game.boxes[3].combo = function() { exports.tttMatrix.H2 += game.activeValue(); exports.tttMatrix.V1 += game.activeValue();};
	game.boxes[4].combo = function() { exports.tttMatrix.D1 += game.activeValue(); exports.tttMatrix.H2 += game.activeValue(); exports.tttMatrix.V2 += game.activeValue(); exports.tttMatrix.D2 += game.activeValue();};
	game.boxes[5].combo = function() { exports.tttMatrix.H2 += game.activeValue(); exports.tttMatrix.V3 += game.activeValue();};

	game.boxes[6].combo = function() { exports.tttMatrix.H3 += game.activeValue(); exports.tttMatrix.V1 += game.activeValue(); exports.tttMatrix.D2 += game.activeValue();};
	game.boxes[7].combo = function() { exports.tttMatrix.H3 += game.activeValue(); exports.tttMatrix.V2 += game.activeValue();};
	game.boxes[8].combo = function() { exports.tttMatrix.D1 += game.activeValue(); exports.tttMatrix.H3 += game.activeValue(); exports.tttMatrix.V3 += game.activeValue();};

	game.boxes[0].AI = ['D1', 'H1', 'V1'];
	game.boxes[1].AI = ['H1', 'V2'];
	game.boxes[2].AI = ['D2', 'H1', 'V3'];

	game.boxes[3].AI = ['H2', 'V1'];
	game.boxes[4].AI = ['D1', 'H2', 'V2', 'D2'];
	game.boxes[5].AI = ['H2', 'V3'];

	game.boxes[6].AI = ['H3', 'V1', 'D2'];
	game.boxes[7].AI = ['H3', 'V2'];
	game.boxes[8].AI = ['D1', 'H3', 'V3'];

	for(var i = 0; i < game.boxes.length; i++) {

		boxMouseOver(i);
		boxMouseLeave(i);
		boxClick(i);

	}

	/*
		'boxMouseOver(i)' if the mouse'd over box has not been filled, apply the currently active player's background image symbol on mouseover

		'boxMouseLeave(i)' if the mouse'd over box has not been filled, remove currently active player's background image symbol on mouseleave

		'boxClick(i)' on box click, if the clicked box is empty, apply player's active symbol & class -
		for the clicked box call its .combo() function, which will either add a -1 || +1 to the corrosponding combination objects -
		if the game has not been won, or if the game is not a draw, remove current player's class of 'active' and apply it to the other player -

		if game.AI is true, run AI logic -
		the AI logic call is on a delay in order to simulate realistic desicion time
	*/

	function boxMouseOver(i) {
		game.boxes[i].onmouseover = function(x) {
			if(!this.classList.contains("box-filled-1") && !this.classList.contains("box-filled-2")) {
				this.style.backgroundImage = game.activeMouseOver();
			}
		};	
	}

	function boxMouseLeave(i) {
		game.boxes[i].onmouseleave = function() {
			if(!this.classList.contains("box-filled-1") && !this.classList.contains("box-filled-2")) {
				this.style.backgroundImage = "initial";
			}
		};
	}

	function boxClick(i) {
		game.boxes[i].onclick = function() {
			if(game.boxIsEmpty(i)) {
				this.classList.add(game.activeSymbol());
				this.style.backgroundImage = game.activeMouseOver();
				this.combo();
				if(!gameWin() && !gameDraw()) {
					if(game.activePlayer()) {
						game.player1.classList.remove("active");
						game.player2.classList.add("active");
						if(game.AI) {
							setTimeout(function(){ AI.AI(); }, 1000);
						}
					} else {
						game.player2.classList.remove("active");
						game.player1.classList.add("active");
					}
				}
			}
		};
	}

	/*
		'gameWin()' if any value within tttMatrix = either -3 || +3, the game is won -
		display game win screen and apply the victors name 

		'gameDraw()' if all boxes are filled, the game is a draw -
		display game draw screen
	*/

	function gameWin() {
		for(var prop in exports.tttMatrix) {
			if(exports.tttMatrix[prop] == 3 || exports.tttMatrix[prop] == -3) {
				game.board.style.display = "none";
				game.finish.style.display = "initial";
				game.finish.classList.add(game.victor());
				game.winMessage.textContent = game.victorName();
				game.statusMessage.textContent = "WINS!";
				return true;
			}
		}
	} 

	function gameDraw() {
		var j = 0;
		for(var i = 0; i < game.boxes.length; i++) {
			if(game.boxes[i].classList.contains("box-filled-1") || game.boxes[i].classList.contains("box-filled-2")) {
				j++;
			}	
		}
		if(j == 9) {
			game.board.style.display = "none";
			game.finish.style.display = "initial";
			game.finish.classList.add("screen-win-tie");
			game.statusMessage.textContent = "It's A Draw";
			return true;
		}
	}

	/*
		on New Game button click, reset the board 

		'resetBoard()' creates a fresh game by removing the previous symbol's class & image -
		resetting tttMatrix values back to 0 

		on New Game button click, if game.AI was true & the AI won, run 'AI()'
	*/

	game.newGame.onclick = function() {

		resetBoard();

		if(game.AI && !game.activePlayer()) {
			AI.AI();
		}

	};

	function resetBoard() {

		for(var i = 0; i < game.boxes.length; i++) {
			game.boxes[i].className = "box";
			game.boxes[i].style.backgroundImage = "initial";
		}

		for(var prop in exports.tttMatrix) {
			if (exports.tttMatrix.hasOwnProperty(prop)) {
        		exports.tttMatrix[prop] = 0;
    		}
		}
		game.finish.classList.remove("screen-win-one", "screen-win-two", "screen-win-tie");
		game.finish.style.display = "none";
		game.board.style.display = "initial";
		game.winMessage.textContent = "";
	}

	return exports;

}());


var AI = (function() {

	var exports = {

	};

	/*
		'AI()' - every time AI() runs a 'for in loop' will scan over all tttMatrix objects -
		if any value = -2 , push that related key(s) to the attack array -
		if any value = 2 , push that related key(s) to the counter array -
		if any value = -1 , push that related key(s) to the basicOffense array -
		if any value = 1 , push that related key(s) to the basicDefense array -

		a prioritized sequence of if/else if statements are used to determine what kind of choice the AI will make -

		if the attack array has a length greater than 0, run matchPoint(attack) -
			matchPoint(attack) will complete a combination of -2 to -3
			therefore this takes top priority

		else if the counter array has a length greater than 0, run matchPoint(counter) -
			matchPoint(counter) will, if possible, make any combination of 2 to 1 

			if game.easy is true, easyRNG() runs, returning a number between 1 & 6 -
			if returned value is 1, matchPoint(counter) does not run -
			potentionally giving the player an increased chance to win

		else if both attack & counter arrays are empty and also both basicOffense & basicDefense are empty, AI has the first move and will choose the center box	

		else if both attack & counter arrays are empty & basicOffense is not empty, run basics(basicOffense) -
				basics(basicOffense) will attempt to turn -1's into -2's

		else if attack & counter & basicOffense arrays are empty, run basics(basicDefense)
				basics(basicDefense) will attempt to turn 1's into 0's				

	*/ 

	exports.AI = function() {
		var attack  = [];
		var counter = [];
		var basicOffense = [];
		var basicDefense = [];
		for(var prop in gamePlay.tttMatrix) {
      		if(gamePlay.tttMatrix.hasOwnProperty(prop)) {
      			if(gamePlay.tttMatrix[prop] === -2)  {attack.push(prop);}
				if(gamePlay.tttMatrix[prop] ===  2)  {counter.push(prop);}
				if(gamePlay.tttMatrix[prop] === -1)  {basicOffense.push(prop);}
				if(gamePlay.tttMatrix[prop] ===  1)  {basicDefense.push(prop);}
      		}
		}
		if(attack.length > 0) {matchPoint(attack);}
		else if(counter.length > 0) {
			if(game.easy) {
				if(easyRNG() == 1) {
					console.log('easy RNG, easy move');
					basics(basicOffense);
				} else {matchPoint(counter); console.log('easy RNG, not an easy move');}
			} else {matchPoint(counter); console.log('hard game');}
		}
		else if(counter.length === 0 && attack.length === 0 && basicOffense.length === 0 && basicDefense.length === 0) {game.boxes[4].click();}
		else if(counter.length === 0 && attack.length === 0 && basicOffense.length > 0) {basics(basicOffense);}
		else if(counter.length === 0 && attack.length === 0) {basics(basicDefense);}
		
	};

	function easyRNG() {
		return Math.floor((Math.random() * 6) + 1);
	}

	/*
		'matchPoint(prop)' takes in the array of either attack[] or counter[] -
		if attack or counter's value (the key associated with the -2 or +2 combo) == the iterated box's 'boxes.AI' value & that box is not empty -
		click that box, which either prevents a win scenario, or wins the game
	*/

	function matchPoint(prop) {
		for(var i = 0; i < game.boxes.length; i++) {
			for(var j = 0; j < game.boxes[i].AI.length; j++) {
				if(prop[0] == game.boxes[i].AI[j] && game.boxIsEmpty(i)) {
					game.boxes[i].click();
				}
			}
		}
	}
	
	/*
		'bascis(prop)' takes in either the array of basicOffense or basiceDefense - 
		if basicOffense or baiscDefense's value(s) (the key(s) associated with either -1(s) or +1(s) combos) == the iterated box's 'boxes.AI' value & that box is not empty -
		push the box to the basicList array -
		once all the loops have ran, call 'basicMove(basicList)'
	*/
	function basics(prop) {
		var basicList = [];
		for(var i = 0; i < game.boxes.length; i++) {
			for(var j = 0; j < game.boxes[i].AI.length; j++) {
				for(var k = 0; k < prop.length; k++) {
					if(prop[k] == game.boxes[i].AI[j] && game.boxIsEmpty(i)) {
						basicList.push(game.boxes[i]);
					}
				}
			}
		}
		basicMove(basicList);
	}	

	/*
		'basicMove(list)' takes in the 'basicList[]' array from the 'basics(prop)' function - 
		if list.length !== 0, call 'freshMoves(list)' and use the returned value as an index of list, then click that box -
			'freshMoves()' is intended to simulate dynamic choices -
			wihtout doing this the AI becomes predictable 
		
		'drawArr' is an array which contains all boxes which are empty -
		when there are no more possible ways to win left, the 'list' will be empty and the drawArr values will be used -
	*/


	function basicMove(list) {

		var drawArr = [];

		for(var i = 0; i < game.boxes.length; i++) {
			if(game.boxIsEmpty(i)) {
				drawArr.push(game.boxes[i]);
			}
		}

		if(list.length !== 0) {
			list[freshMoves(list)].click();
		} else {
			drawArr[freshMoves(drawArr)].click();
		}
		
	}

	function freshMoves(list) {
		return Math.floor((Math.random() * list.length - 1) + 1);
	}	

	return exports;


})();























// -end
