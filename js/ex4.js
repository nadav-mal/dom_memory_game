(function () {
    let gameManagement = {};
    (function gameUtils(util) {
        const handleClickSubmit = () => {
            let gameData = initGameData();
            if (validateBoardInput(gameData)) {
                runGame(gameData);
            }
        }

        const initGameData = () => {
            return {
                name: document.getElementById("name").value.trim(),
                rows: document.getElementById("rows-data").value,
                cols: document.getElementById("cols-data").value,
                displayTime: document.getElementById("display-time").value
            };
        }

        const validateBoardInput = (gameData) => {
            let isEven = ((gameData.rows * gameData.cols) % 2 === 0);
            let nameValid = (gameData.name.length <= 12 && gameData.name.length > 0 && !(/\W/.test(gameData.name)));

            displayErrors(isEven, "invalidSize");
            displayErrors(nameValid, "invalidName");

            return (isEven && nameValid);
        }

        const displayErrors = (valid, id) => {
            if (!valid)
                display(id);
            else
                hide(id);
        }

        const runGame = (gameData) => {
            toggleHid("beforeGame", "gameProcess")
            createBoard(gameData)
        }

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

        const swapElements = (arr, i1, i2) => {
            arr[i1] = arr.splice(i2, 1, arr[i1])[0];
        }


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
    (function winGame(util) {
        let highScoresList = []

        const winGameDisplay = (game, gameData) => {
            toggleHid("winGameDiv", "gameProcess")
            document.getElementById("colForCounter").innerHTML = "Steps: 0"
            document.getElementById("cardsPlayed").innerHTML = "Number of cards played: " + (gameData.rows * gameData.cols)
            let newObj = {
                rank: 0,
                name: gameData.name.toLowerCase(),
                score: 0
            }
            newObj.score = calcScore(game, gameData)

            if (checkInsert(newObj))
                highScoresList.push(newObj)

            highScoresList = [...highScoresList].sort((a, b) => a.score > b.score ? -1 : 1)

            if (highScoresList.length > 3)
                highScoresList.pop();

            updateRank(newObj);
            displayNewScoreBoard();
        }

        const calcScore = function (game, gameData) {
            let difficulty = Math.pow(game.timeout, -1);
            let optimal = gameData.rows * gameData.cols / 2;
            let actual = (Math.floor(game.counter / 2));
            return Math.floor((optimal / actual) * difficulty * 100000 * ((optimal - 2) + 1));
        }

        const checkInsert = (newObj) => {
            let insert = true;
            highScoresList.forEach(highScore => {
                if (highScore.name === newObj.name) {
                    if (highScore.score < newObj.score) {
                        highScore.score = newObj.score
                        insert = false;
                    } else
                        insert = false;
                }
            })
            return insert;
        }

        const updateRank = (newObj) => {
            for (let i = 0; i < highScoresList.length; i++) {
                if (highScoresList[i].name === newObj.name) {
                    highScoresList[i].rank = i + 1
                    return;
                }
            }
        }

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

    let display = (...id) => {
        id.forEach(elem => {
            document.getElementById(elem).removeAttribute("hidden");
        })
    }

    let hide = (...id) => {
        id.forEach(elem => {
            document.getElementById(elem).setAttribute("hidden", "hidden");
        })
    }
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