// Input elements
const codeDisplay = document.getElementById("code-display");
const clearFire= document.getElementById("clear-fire");
const commitFire = document.getElementById("commit-fire");
const startButton = document.getElementById("start");
const legend = document.getElementById("legend");
// Ship elements
/* elements for setting ship model */
const ship1 = document.getElementById("ship1");
const ship2 = document.getElementById("ship2");
const ship3 = document.getElementById("ship3");
const ship4 = document.getElementById("ship4");
const ship5 = document.getElementById("ship5");
const ship6 = document.getElementById("ship6");
/* elements for registering hits */
const obj1 = document.getElementById("obj1");
const obj2 = document.getElementById("obj2");
const obj3 = document.getElementById("obj3");
const ali1 = document.getElementById("ali1");
const ali2 = document.getElementById("ali2");
const ali3 = document.getElementById("ali3");
// Game elements
const gameover = document.getElementById("gameover");
const gameoverMessage = document.getElementById("gameover-message");
// Body elements for window resizing events
const body = document.getElementById("body");
const header = document.getElementById("header");
const main = document.getElementById("main");
const windowCheck = document.getElementById("window-check");
const windowMessage = document.getElementById("window-message");
const resetButton = document.getElementById("reset-button");



const view = {
    displayWindowSize: function() {
        let isMobile = this.mobileCheck();
        if (isMobile) {
            body.style.height = "100vh";
            legend.fontSize = "0.5rem";
            resetButton.style.fontSize = "1.2rem";
            commitFire.style.width = "125%";
            commitFire.style.height = "50%";
            if (window.innerWidth < window.innerHeight) {
                body.style.paddingTop = "0"
                header.style.display = "flex";
                main.style.display = "none";
                windowCheck.style.display = "flex";
                windowMessage.style.fontSize = "1.8rem";
                windowMessage.innerHTML = "The browser needs to be rotated horizontally to play BattleShip.";
            } else {
                body.style.paddingTop = "1%";
                header.style.display = "none";
                main.style.display = "grid";
                main.style.minHeight = "95vh";
                windowCheck.style.display = "none";
            }
        } else {
            if ((window.innerHeight / screen.height) <= 0.64 && (window.innerWidth / screen.width) <= 0.75) {
                main.style.display = "none";
                windowCheck.style.display = "flex";
                windowMessage.innerHTML = "The browser needs to be longer and wider to play BattleShip.";
            } else if (window.innerHeight / screen.height <= 0.64) {
                main.style.display = "none";
                windowCheck.style.display = "flex";
                windowMessage.innerHTML = "The browser needs to be longer to play BattleShip.";
            } else if (window.innerWidth / screen.width <= 0.75) {
                main.style.display = "none";
                windowCheck.style.display = "flex";
                windowMessage.innerHTML = "The browser needs to be wider to play BattleShip.";
            } else {
                main.style.display = "grid";
                windowCheck.style.display = "none";
            }
        }
    },
    displayLegend: function() {
        startButton.style.display = "none";
        legend.style.display = "grid";
    },
    displayGameOver: function(msg) {
        gameoverMessage.innerHTML = msg;
        gameover.style.display = 'flex';
    },
    displayAllies: function() {
        model.ships.allies.masterLocations.forEach(shipPosition => {
            const position = document.getElementById(shipPosition);
            position.style.backgroundColor = "#1E90FFBF";
        })
    },
    displayHit: function(location) {
        const cell = document.getElementById(location);
        cell.style.border = "4px solid red";
    },
    displayCpuHit: function(location) {
        const cell = document.getElementById(location);
        cell.style.backgroundColor = "grey";
    },
    displayMiss: function(location) {
        const cell = document.getElementById(location);
        cell.style.border = "3px solid darkred";
    },
    mobileCheck: function() {
        let isMobile;

        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            isMobile = true ;
        } else {
            isMobile = false;
        }

        return isMobile;
    },
    processCode: function(e) {
        if (model.gameStarted === true) {
            if (e.value.length > 0) {
                clearFire.style.opacity = "1";
            } else {
                clearFire.style.opacity = "0.5";
            }
            if (e.value.length === 2 && model.processGuess(e.value) === true) {
                commitFire.style.border = "1px solid green";
                commitFire.style.backgroundColor = "lightgreen";
                commitFire.style.boxShadow = "0 0 10px lightgreen";
            } else if (e.value.length === 2 && model.processGuess(e.value) === false) {
                commitFire.style.border = "1px solid red";
                commitFire.style.backgroundColor = "lightcoral";
                commitFire.style.boxShadow = "0 0 10px lightcoral";
            } else {
                commitFire.style.border = "2px solid black";
                commitFire.style.backgroundColor = "whitesmoke";
                commitFire.style.boxShadow = "0 0 3px black";
                clearFire.style.border = "3px solid #333";
                clearFire.style.backgroundColor = "whitesmoke";
                clearFire.style.boxShadow = "0 0 0 white";
                clearFire.style.color = "black";
                clearFire.innerHTML = "CLEAR";
            }
        }
    }
};


const model = {
    gameStarted: false,
    ships: {
        enemies: {
            active: 3,
            masterLocations: []
        },
        allies: {
            active: 3,
            masterLocations: []
        }
    },
    setModels: function() {
        // Get a random position for ship model
        const randomModel2 = function() {
            return Math.floor(Math.random()*2) + 1;
        }
        const randomModel3 = function() {
            return Math.floor(Math.random()*3) + 1;
        }
        // Set enemy positions
        ship1.setAttribute("src", `./assets/warship_s${randomModel3()}_nobg.png`);
        ship2.setAttribute("src", `./assets/warship_m${randomModel3()}_nobg.png`);
        ship3.setAttribute("src", `./assets/warship_l${randomModel2()}_nobg.png`);
        // Set allie positions
        ship4.setAttribute("src", `./assets/allie-s${randomModel2()}-nobg.png`);
        ship5.setAttribute("src", `./assets/allie-m${randomModel3()}-nobg.png`);
        ship6.setAttribute("src", `./assets/allie-l${randomModel2()}-nobg.png`);
        this.setLocations();
    },
    setLocations: function() {
        let alphaStart;
        let numeralPosition;
        let numeralStart;
        let alphaPosition;
        let pos1;
        let pos2;
        // Get random position
        let randomPosition;
        // Get random alpha
        let randomIndex = function() {
            return Math.floor(Math.random()*7);
        }
        // Layout orientation
        let layoutOrientation = function() {
            return Math.floor(Math.random()*2);
        }
        // Set enemy locations
        // Set random layout for a 3 position ship - 0: horizontal, 1: vertical
        if (layoutOrientation() === 0) {
            alphaStart = Math.floor(Math.random()*4);
            numeralPosition = controller.numeric[randomIndex()];
            model.ships.enemies.masterLocations.push(controller.alpha[alphaStart] + numeralPosition);
            model.ships.enemies.masterLocations.push(controller.alpha[alphaStart+1] + numeralPosition);
            model.ships.enemies.masterLocations.push(controller.alpha[alphaStart+2] + numeralPosition);
        } else {
            numeralStart = Math.floor(Math.random()*4);
            alphaPosition = controller.alpha[randomIndex()];
            model.ships.enemies.masterLocations.push(alphaPosition + controller.numeric[numeralStart]);
            model.ships.enemies.masterLocations.push(alphaPosition + controller.numeric[numeralStart+1]);
            model.ships.enemies.masterLocations.push(alphaPosition + controller.numeric[numeralStart+2]);
        }
        // Set random layout for a 2 position ship - 0: horizontal, 1: vertical
        if (layoutOrientation() === 0) {
            do {
                alphaStart = Math.floor(Math.random()*4);
                numeralPosition = controller.numeric[randomIndex()]
                pos1 = controller.alpha[alphaStart] + numeralPosition;
                pos2 = controller.alpha[alphaStart+1] + numeralPosition;
            } while (model.ships.enemies.masterLocations.indexOf(pos1) !== -1 || model.ships.enemies.masterLocations.indexOf(pos2) !== -1);
            model.ships.enemies.masterLocations.push(pos1);
            model.ships.enemies.masterLocations.push(pos2);
        } else {
            do {
                numeralStart = Math.floor(Math.random()*4);
                alphaPosition = controller.alpha[randomIndex()];
                pos1 = alphaPosition + controller.numeric[numeralStart];
                pos2 = alphaPosition + controller.numeric[numeralStart+1];
            } while (model.ships.enemies.masterLocations.indexOf(pos1) !== -1 || model.ships.enemies.masterLocations.indexOf(pos2) !== -1);
            model.ships.enemies.masterLocations.push(pos1);
            model.ships.enemies.masterLocations.push(pos2);
        }

        do {
            randomPosition = controller.alpha[randomIndex()] + controller.numeric[randomIndex()];
        } while (model.ships.enemies.masterLocations.indexOf(randomPosition) !== -1);
        model.ships.enemies.masterLocations.push(randomPosition);
        model.ships.enemies.masterLocations.reverse();
        // Set allie locations
        // Set random layout for a 3 position ship - 0: horizontal, 1: vertical
        if (layoutOrientation() === 0) {
            alphaStart = Math.floor(Math.random()*4);
            numeralPosition = controller.numeric[randomIndex()];
            model.ships.allies.masterLocations.push(controller.alpha[alphaStart] + numeralPosition);
            model.ships.allies.masterLocations.push(controller.alpha[alphaStart+1] + numeralPosition);
            model.ships.allies.masterLocations.push(controller.alpha[alphaStart+2] + numeralPosition);
        } else {
            numeralStart = Math.floor(Math.random()*4);
            alphaPosition = controller.alpha[randomIndex()];
            model.ships.allies.masterLocations.push(alphaPosition + controller.numeric[numeralStart]);
            model.ships.allies.masterLocations.push(alphaPosition + controller.numeric[numeralStart+1]);
            model.ships.allies.masterLocations.push(alphaPosition + controller.numeric[numeralStart+2]);
        }
        // Set random layout for a 2 position ship - 0: horizontal, 1: vertical
        if (layoutOrientation() === 0) {
            do {
                alphaStart = Math.floor(Math.random()*4);
                numeralPosition = controller.numeric[randomIndex()]
                pos1 = controller.alpha[alphaStart] + numeralPosition;
                pos2 = controller.alpha[alphaStart+1] + numeralPosition;
            } while (model.ships.allies.masterLocations.indexOf(pos1) !== -1 || model.ships.allies.masterLocations.indexOf(pos2) !== -1);
            model.ships.allies.masterLocations.push(pos1);
            model.ships.allies.masterLocations.push(pos2);
        } else {
            do {
                numeralStart = Math.floor(Math.random()*4);
                alphaPosition = controller.alpha[randomIndex()];
                pos1 = alphaPosition + controller.numeric[numeralStart];
                pos2 = alphaPosition + controller.numeric[numeralStart+1];
            } while (model.ships.allies.masterLocations.indexOf(pos1) !== -1 || model.ships.allies.masterLocations.indexOf(pos2) !== -1);
            model.ships.allies.masterLocations.push(pos1);
            model.ships.allies.masterLocations.push(pos2);
        }

        do {
            randomPosition = controller.alpha[randomIndex()] + controller.numeric[randomIndex()];
        } while (model.ships.allies.masterLocations.indexOf(randomPosition) !== -1);
        model.ships.allies.masterLocations.push(randomPosition);
        model.ships.allies.masterLocations.reverse();
        // Call view method to display allie ships on the grid
        view.displayAllies();
    },
    processGuess: function(guess) {
        guess = String(guess).toUpperCase();
        if (controller.alpha.indexOf(guess[0]) !== -1 && controller.numeric.indexOf(guess[1]) !== -1) {
            return true;
        } else if (controller.alpha.indexOf(guess[1]) !== -1 && controller.numeric.indexOf(guess[0]) !== -1) {
            return true;
        } else {
            return false;
        }
    },
    cpuGuesses: [],
    cpuFire: function() {
        let alphaGuess = controller.alpha[Math.floor(Math.random()*7)];
        let numericGuess = controller.numeric[Math.floor(Math.random()*7)];
        let guess = alphaGuess + numericGuess;
        if (this.cpuGuesses.indexOf(guess) === -1) {
            if (this.ships.allies.masterLocations.indexOf(guess) !== -1) {
                const index = this.ships.allies.masterLocations.indexOf(guess);
                view.displayCpuHit(model.ships.allies.masterLocations[index])
                this.ships.allies.masterLocations[index] = "HIT"
            }
            this.cpuGuesses.push(guess);
            this.alliesShipCheck();
        } else {
            this.cpuFire();
        }
    },
    alliesShipCheck: function() {
        const alliePositions = model.ships.allies.masterLocations;
        if (alliePositions[0] === "HIT") {
            ali1.style.backgroundColor = "red";
        }
        if (alliePositions[1] === "HIT" && alliePositions[2] === "HIT") {
            ali2.style.backgroundColor = "red";
        } else if (alliePositions[1] === "HIT" || alliePositions[2] === "HIT") {
            ali2.style.backgroundColor = "orange";
        }
        if (alliePositions[3] === "HIT" && alliePositions[4] === "HIT" && alliePositions[5] === "HIT") {
            ali3.style.backgroundColor = "red";
        } else if ((alliePositions[3] === "HIT" && alliePositions[4] === "HIT")
            || (alliePositions[4] === "HIT" && alliePositions[5] === "HIT")
            || (alliePositions[3] === "HIT" && alliePositions[5] === "HIT")) {
            ali3.style.backgroundColor = "orange";
        } else if (alliePositions[3] === "HIT" || alliePositions[4] === "HIT" || alliePositions[5] === "HIT") {
            ali3.style.backgroundColor = "yellow";
        }
        let hitPositions = model.ships.allies.masterLocations.filter(position => position === "HIT")
        if (hitPositions.length === 6) {
            this.ships.allies.active = 0;
            this.gameoverCheck();
        } else {
            this.enemiesShipCheck();
        }
    },
    enemiesShipCheck: function() {
        const enemyPositions = model.ships.enemies.masterLocations;
        if (enemyPositions[0] === "HIT") {
            obj1.style.backgroundColor = "red";
        }
        if (enemyPositions[1] === "HIT" && enemyPositions[2] === "HIT") {
            obj2.style.backgroundColor = "red";
        } else if (enemyPositions[1] === "HIT" || enemyPositions[2] === "HIT") {
            obj2.style.backgroundColor = "orange";
        }
        if (enemyPositions[3] === "HIT" && enemyPositions[4] === "HIT" && enemyPositions[5] === "HIT") {
            obj3.style.backgroundColor = "red";
        } else if ((enemyPositions[3] === "HIT" && enemyPositions[4] === "HIT")
            || (enemyPositions[4] === "HIT" && enemyPositions[5] === "HIT")
            || (enemyPositions[3] === "HIT" && enemyPositions[5] === "HIT")) {
            obj3.style.backgroundColor = "orange";
        } else if (enemyPositions[3] === "HIT" || enemyPositions[4] === "HIT" || enemyPositions[5] === "HIT") {
            obj3.style.backgroundColor = "yellow";
        }
        let hitPositions = enemyPositions.filter(position => position === "HIT");
        if (hitPositions.length === 6) {
            this.ships.enemies.active = 0;
            this.gameoverCheck();
        }
    },
    gameoverCheck: function() {
        if (this.ships.allies.active === 0) {
            view.displayGameOver("Your allies have been defeated");
            gameover.style.backgroundColor = 'red';
        } else if (this.ships.enemies.active === 0) {
            view.displayGameOver("You have eliminated all objectives");
            gameover.style.backgroundColor = 'dodgerblue';
        }
    }
}


const controller = {
    alpha: ["A","B","C","D","E","F","G"],
    numeric: ["0","1","2","3","4","5","6"],
    startButton: function() {
        if (model.gameStarted === false) {
            codeDisplay.value = "";
            model.gameStarted = true;
            view.displayLegend();
            model.setModels();
            view.processCode(codeDisplay);
        }
    },
    input: function(e) {
            if (codeDisplay.value.length < 2) {
                codeDisplay.value += e.innerHTML;
            }
            if (codeDisplay.value.length > 0) {
                clearFire.style.opacity = "1";
            } else {
                clearFire.style.opacity = "0.5";
            }
            if (codeDisplay.value.length === 2 && model.processGuess(codeDisplay.value) === true) {
                commitFire.style.border = "1px solid green";
                commitFire.style.backgroundColor = "lightgreen";
                commitFire.style.boxShadow = "0 0 10px lightgreen";
            } else if (codeDisplay.value.length === 2 && model.processGuess(codeDisplay.value) === false) {
                commitFire.style.border = "1px solid red";
                commitFire.style.backgroundColor = "lightcoral";
                commitFire.style.boxShadow = "0 0 10px lightcoral";
            } else {
                commitFire.style.border = "2px solid black";
                commitFire.style.backgroundColor = "whitesmoke";
                commitFire.style.boxShadow = "0 0 3px black";
                clearFire.style.border = "3px solid #333";
                clearFire.style.backgroundColor = "whitesmoke";
                clearFire.style.boxShadow = "0 0 0 white";
                clearFire.style.color = "black";
                clearFire.innerHTML = "CLEAR";
            }

    },
    commitFire: function() {
        if (model.gameStarted === true) {
            if (codeDisplay.value.length === 2 && model.processGuess(codeDisplay.value) === true) {
                clearFire.style.border = "1px solid darkred";
                clearFire.style.backgroundColor = "red";
                clearFire.style.boxShadow = "0 0 10px red";
                clearFire.innerHTML = "";
            }
        }
    },
    playerFire: function() {
        if (model.gameStarted === true) {
            if (clearFire.innerHTML === "") {
                // Fires shot with code in Alpha Numeral (B6) order
                if (controller.alpha.indexOf(codeDisplay.value[0]) !== -1) {
                    if (model.ships.enemies.masterLocations.indexOf(codeDisplay.value) !== -1) {
                        const index = model.ships.enemies.masterLocations.indexOf(codeDisplay.value);
                        view.displayHit(model.ships.enemies.masterLocations[index])
                        model.ships.enemies.masterLocations[index] = "HIT"
                    } else {
                        view.displayMiss(codeDisplay.value)
                    }
                    model.cpuFire();
                    codeDisplay.value = "";
                    view.processCode(codeDisplay);
                } // Fires shot with code in Numeral Alpha (6B) order
                  else if (controller.alpha.indexOf(codeDisplay.value[1]) !== -1) {
                    const codeFlip = codeDisplay.value[1] + codeDisplay.value[0]
                    if (model.ships.enemies.masterLocations.indexOf(codeFlip) !== -1) {
                        const index = model.ships.enemies.masterLocations.indexOf(codeFlip);
                        view.displayHit(model.ships.enemies.masterLocations[index])
                        model.ships.enemies.masterLocations[index] = "HIT"
                    } else {
                        view.displayMiss(codeDisplay.value)
                    }
                    model.cpuFire();
                    codeDisplay.value = "";
                    view.processCode(codeDisplay);
                }
            } else {
                codeDisplay.value = "";
                view.processCode(codeDisplay);
            }
        }
    },
    gameReset: function() {
        // Reset ship locations
        model.ships.enemies.masterLocations = [];
        model.ships.allies.masterLocations = [];
        // Reset ship models
        ship1.setAttribute("src", ``);
        ship2.setAttribute("src", ``);
        ship3.setAttribute("src", ``);
        ship4.setAttribute("src", ``);
        ship5.setAttribute("src", ``);
        ship6.setAttribute("src", ``);
        // Reset registered hits
        obj1.style.backgroundColor = "lightgreen";
        obj2.style.backgroundColor = "lightgreen";
        obj3.style.backgroundColor = "lightgreen";
        ali1.style.backgroundColor = "lightgreen";
        ali2.style.backgroundColor = "lightgreen";
        ali3.style.backgroundColor = "lightgreen";
        // Reset grid
        const grid = Array.from(document.getElementsByClassName("table-square"));
        grid.forEach(e => {
            e.style.backgroundColor = "lightgrey";
            e.style.border = "none";
        })
        // Remove legend for start button
        startButton.style.display = "block";
        legend.style.display = "none";
        // Reset game
        codeDisplay.value = "";
        model.gameStarted = false;
        // Remove gameover screen
        gameoverMessage.innerHTML = "";
        gameover.style.display = 'none';
    }
}


