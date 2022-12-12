(function () {
    let gameManagement = {};
    /** This is a bundle of all game utility functions*/
    (function gameUtils(util) {
        const handleClickSubmit = () => {
            let gameData = initGameData();
            if (validateBoardInput(gameData)) {
                runGame(gameData);
            }
        }
        /**@returns {{displayTime, name: string, rows, cols}}  (returns object with game's data) */
        const initGameData = () => {
            return {
                name: document.getElementById("name").value.trim(),
                rows: document.getElementById("rows-data").value,
                cols: document.getElementById("cols-data").value,
                displayTime: document.getElementById("display-time").value
            };
        }
        /** @param gameData - the game data given by the user
         * @returns {boolean} - True if the input is valid */
        const validateBoardInput = (gameData) => {
            let isEven = ((gameData.rows * gameData.cols) % 2 === 0);
            let nameValid = (gameData.name.length <= 12 && gameData.name.length > 0 && !(/\W/.test(gameData.name)));

            displayErrors(isEven, "invalidSize");
            displayErrors(nameValid, "invalidName");
            return (isEven && nameValid);
        }
        /** @param valid boolean to display/hide error message
         ** @param id   the id of the error message element in the html file*/
        const displayErrors = (valid, id) => {
            if (!valid)
                display(id);
            else
                hide(id);
        }
        /** @param gameData - builds the game using the user's input data.*/
        const runGame = (gameData) => {
            toggleHid("beforeGame", "gameProcess")
            createBoard(gameData)
        }
        /** @param gameData creates a board with rows and cols given from game data */
        const createBoard = (gameData) => {
            let game = initGame(gameData)
            const winGame = winGameManagement.display;
            for (let i = 0; i < gameData.rows; i++) {
                const newRow = document.createElement("tr")
                for (let j = 0; j < gameData.cols; j++) {
                    let card = initCard(i * gameData.cols + j);
                    const col = document.createElement("td");
                    card.img.addEventListener("click", () => {
                        createCardEvent(game, card);
                        if (game.remainingCards === 0)
                            winGame.winGameDisplay(game, gameData);
                    })

                    col.appendChild(card.img)
                    newRow.appendChild(col)
                }
                game.data.appendChild(newRow);
            }
        }
        /**
         * @param game - an object of the current game. See initGame below
         * @param card - a card object to attach this function as an event listener of a card click
         */
        const createCardEvent = (game, card) => {
            if (!game.revealed && (card.img.className.toString().includes("unDiscovered")) && card.img !== game.prevImg) {
                card.img.src = "Images/" + game.permutation[card.index] + ".jpg";

                if (game.counter % 2 !== 0) {
                    game.revealed = true;
                    if (card.img.src !== game.prevImg.src && card.img !== game.prevImg)
                        setTimeout(() => {
                            card.img.src = game.prevImg.src = "Images/card.jpg";
                            game.revealed = false;
                        }, game.timeout)
                    else {
                        game.remainingCards -= 2
                        card.img.className = game.prevImg.className = "img-fluid discovered"
                        game.revealed = false;
                    }
                } else
                    game.prevImg = card.img;
                document.getElementById("colForCounter").innerHTML = "Steps: " + (Math.floor(game.counter / 2) + 1)
                game.counter++;
            }
        }
        /**
         * @param gameData - rows cols, this function builds a game object to hold information needed about current game session
         * @returns {{data: HTMLElement, prevImg: {}, revealed: boolean, counter: number, remainingCards: number, timeout: number, permutation}}
         */
        const initGame = (gameData) => {
            return {
                data: document.getElementById("matrix"),
                remainingCards: gameData.rows * gameData.cols,
                permutation: generatePermutation(gameData.rows * gameData.cols),
                timeout: gameData.displayTime * 1000,
                prevImg: {},
                counter: 0,
                revealed: false
            };
        }
        /**
         * @param N - size of wanted permutation. N = ROWS * COLS
         * @returns {*} a random generated permutation of N/2 cards (each card appears twice and his place is random)
         */
        const generatePermutation = (N) => {
            let makeStartingPermutation = (N) => {
                let curr = []
                let index = 0
                while (index < N) {
                    curr.push(index)
                    curr.push(index)
                    index++
                }
                return curr
            }
            let fisherYatesShuffle = (N, curr) => {
                let i = N - 1

                while (i >= 1) {
                    let rand = Math.floor(Math.random() * (i));
                    swapElements(curr, rand, i);
                    i--;
                }
                return curr
            }
            return fisherYatesShuffle(N, makeStartingPermutation(N / 2))
        }
        //Swapping elements using a function (since string changes are local)
        const swapElements = (arr, i1, i2) => {
            arr[i1] = arr.splice(i2, 1, arr[i1])[0];
        }

        //Creates a card object which holds the given index as a field. returns this object afterwards
        const initCard = (index) => {
            let card = {
                img: document.createElement('img'),
                index: index
            }
            card.img.className = "img-fluid unDiscovered"
            card.img.src = "Images/card.jpg";
            return card
        }

        util.utilities = {handleClickSubmit};
    }(gameManagement));
    /** ---------------------------------------------------------- **/
    let winGameManagement = {};
    /**This is a bundle of all functions used by winGame manage "page" */
    (function winGame(util) {
        let highScoresList = [] // a local list which holds 3 of the current top scores.


        /**@param game - a game object to calculate the score from
         * @param gameData game data object maybe add this data as a top score player (using gameData.name field) */
        const winGameDisplay = (game, gameData) => {
            toggleHid("winGameDiv", "gameProcess")
            document.getElementById("colForCounter").innerHTML = "Steps: 0"
            document.getElementById("cardsPlayed").innerHTML = "Number of cards played: " + (gameData.rows * gameData.cols)
            let newWinner = {
                rank: 0,
                name: gameData.name.toLowerCase(),
                score: 0
            }
            newWinner.score = calcScore(game, gameData)
            if (checkInsert(newWinner))
                highScoresList.push(newWinner)

            highScoresList = [...highScoresList].sort((a, b) => a.score > b.score ? -1 : 1)

            if (highScoresList.length > 3)
                highScoresList.pop();

            updateRank(newWinner);
            displayNewScoreBoard();
        }
        /** NOTE!! calculating score algorithm is described in README
         * @param game - data to calculate the score from
         * @param gameData - data to calculate the score from
         * @returns {number} - current score calculated from the last game played (and won)
         */
        const calcScore = function (game, gameData) {
            let difficulty = Math.pow(game.timeout, -1);
            let optimal = gameData.rows * gameData.cols / 2;
            let actual = (Math.floor(game.counter / 2));
            return Math.floor((optimal / actual) * difficulty * 100000 * ((optimal - 2) + 1));
        }
        /** checkInsert checks if the user hit the top scores (to know if we should display him)
         * @param newWinner - a player which won the game with his details: {rank,name,score}
         * @returns {boolean} - if the player is one of the 3 top scores
         */
        const checkInsert = (newWinner) => {
            let insert = true;
            highScoresList.forEach(highScore => {
                if (highScore.name === newWinner.name) {
                    if (highScore.score < newWinner.score) {
                        highScore.score = newWinner.score
                        insert = false;
                    } else
                        insert = false;
                }
            })
            return insert;
        }
        /**
         * @param newWinner - a player which is already in the score board he just got a better score than before
         * hence we are changing his top score to the new one
         */
        const updateRank = (newWinner) => {
            for (let i = 0; i < highScoresList.length; i++) {
                if (highScoresList[i].name === newWinner.name) {
                    highScoresList[i].rank = i + 1
                    return;
                }
            }
        }
        /**Inserting highScores data to an existing rows in the html file using dom and query selection*/
        const displayNewScoreBoard = () => {
            let rankBody = document.getElementById("scoresBody");
            let modalBody = document.getElementById("modalBody");
            let rankRows = rankBody.querySelectorAll(".rank");
            let modalRows = modalBody.querySelectorAll(".rank");

            for (let i = 0; i < highScoresList.length; i++) {
                rankRows[i].querySelector('.name').innerHTML = highScoresList[i].name;
                rankRows[i].querySelector('.score').innerHTML = highScoresList[i].score;
                modalRows[i].querySelector('.name').innerHTML = highScoresList[i].name;
                modalRows[i].querySelector('.score').innerHTML = highScoresList[i].score;
            }
        }

        util.display = {winGameDisplay};
    }(winGameManagement));
    /**  upon loading the page, we bind handlers to the form and the button  */
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("form").addEventListener("submit", (event) => {
            event.preventDefault();
            const management = gameManagement.utilities;
            management.handleClickSubmit();
        });
        document.getElementById("settings").addEventListener("click", () => {
            toggleHid("input-data")
        });
        document.getElementById("abandonBtn").addEventListener("click", () => {
            toggleHid("beforeGame", "gameProcess")
            document.getElementById("matrix").innerHTML = "";
        });
        document.getElementById("okBtn").addEventListener("click", () => {
            toggleHid("beforeGame", "winGameDiv")
            document.getElementById("matrix").innerHTML = "";
        });
    });

    //Receives one or more id's to Display and displays them all
    let display = (...id) => {
        id.forEach(elem => {
            document.getElementById(elem).removeAttribute("hidden");
        })
    }
    //Hides the id's of all element id's given as input
    let hide = (...id) => {
        id.forEach(elem => {
            document.getElementById(elem).setAttribute("hidden", "hidden");
        })
    }
    //Toggle's the visibility of given id's
    let toggleHid = (...id) => {
        id.forEach(elem => {
            let element = document.getElementById(elem);
            let hidden = element.getAttribute("hidden");
            if (hidden)
                element.removeAttribute("hidden");
            else
                element.setAttribute("hidden", "hidden");
        })
    }
})();