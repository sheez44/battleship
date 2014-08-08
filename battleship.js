window.onload = init;

//
function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress; // Hitting enter
	
	model.generateShipLocations(); // REQUEST 1 
};

var handleKeyPress = function(e) {
	var fireButton = document.getElementById("fireButton");
	
	e = e || window.event;

	if(e.keyCode === 13) {
		fireButton.click(); // call function as if it were clicked
		return false;
	}
};

var handleFireButton = function() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess); // REQUEST 2

	guessInput.value = "";
};

//
var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

//
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [ {locations: [0, 0, 0], hits: ["", "", ""] },
		     {locations: [0, 0, 0], hits: ["", "", ""] },
		     {locations: [0, 0, 0], hits: ["", "", ""] } ],
	
	generateShipLocations: function() {
		var locations;
		for(var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);

		}

		var newShiplocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) { //horizontal
				newShiplocations.push(row + "" + (col + i)); // B1 B2 B3 (11 12 13)
			} else {
				newShiplocations.push((row + i) + "" + col); // C3 D3 E3  (23 33 43)
			}
		}
		return newShiplocations;	
	},

	collision: function(locations) {
		for(var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},
	
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}
};
//
var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess); // check guess first with parseGuess function
		if (location) { // controls for null object (thus valid location object)
			this.guesses++;
			var hit = model.fire(location);	
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
		
};

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	var guess = guess.toUpperCase();

	if(guess === null || guess.length !== 2){
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		firstChar = guess.charAt(0); // Example B 
		var row = alphabet.indexOf(firstChar); // B is index 1
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isnt on the board.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Oops, off the board");
		} else {
			return row + column;
		}
	}
	return null;
};

//

