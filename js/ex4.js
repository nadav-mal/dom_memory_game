let highScoresList = []

const runGame = (gameData) => {
    toggleHid("beforeGame","gameProcess")
    createBoard(gameData)
}

const validateBoardInput = (gameData) => {
    let isEven = ((gameData.rows * gameData.cols) % 2 === 0)
    let nameValid = (gameData.name.length <= 12 && gameData.name.length > 0 && !(/\W/.test(gameData.name)))
    return (isEven && nameValid)
}

const initGame = (gameData)=>{
    let game = {
        data :  document.getElementById("matrix"),
        remainingCards : gameData.rows * gameData.cols,
        permutation : generatePermutation(gameData.rows * gameData.cols),
        timeout :  gameData.displayTime * 1000,
        prevImg :  {},
        counter :  0,
        revealed :  false
    };
    return game;
}
const initCard = (index) =>{
    let card = {
        img : document.createElement('img'),
        index : index
    }
    card.img.className = "img-fluid unDiscovered"
    card.img.src = "Images/card.jpg";
    return card
}

const createBoard = (gameData) => {
    let game = initGame(gameData)

    for(let i=0; i<gameData.rows; i++) {
        const newRow = document.createElement("tr")
        for(let j=0; j<gameData.cols; j++) {
            let card = initCard(i*gameData.cols + j);
            const col = document.createElement("td")
             card.img.addEventListener("click",()=>{
                createCardEvent(game,card)
                 if(game.remainingCards ===0)
                     winGameDisplay(game,gameData)
            })

            col.appendChild(card.img)
            newRow.appendChild(col)
        }
        game.data.appendChild(newRow);
    }
}
const winGameDisplay = (game, gameData) =>{
    toggleHid("winGameDiv", "gameProcess")
    document.getElementById("cardsPlayed").innerHTML = "Number of cards played: "+ (gameData.rows * gameData.cols)
    let newObj ={
        rank : 0,
        name : gameData.name,
        score : 0
    }
    newObj.score = calcScore(game, gameData)

    let toInsert = checkInsert(newObj)
    if(toInsert)
        highScoresList.push(newObj)

    highScoresList = [...highScoresList].sort((a,b)=> a.score < b.score ? -1 : 1)
    updateRank(newObj);
    displayNewScoreBoard();

}
const checkInsert = (newObj) =>{
    highScoresList.forEach(highScore =>{
        if(highScore.name.toLowerCase() === newObj.name.toLowerCase()){
            if(highScore.score < newObj.score){
                highScore.score = newObj.score
                return false;
            }
            else
                return false;
        }
    })
    return true;
}
const updateRank = (newObj) =>{
    for(let i=0; i< highScoresList.length; i++){
        if(highScoresList[i].name.toLowerCase() === newObj.name.toLowerCase()){
            highScoresList[i].rank = i+1
            return;
        }
    }
}

const displayNewScoreBoard = () =>{
    let table = document.getElementById("highScores")
    let thead = document.createElement("thead")
    let trow = document.createElement("tr");
    let nameCol = (document.createElement("th").innerHTML = "Name")
    let rankCol = (document.createElement("th").innerHTML = "Rank")
    let scoreCol = (document.createElement("th").innerHTML = "Score")
    let tbody = document.createElement("tbody")

    appendToRow(trow,rankCol,nameCol,scoreCol)
    thead.appendChild(trow);
    table.appendChild(thead)
    highScoresList.forEach(highScore =>{
        let row = document.createElement("tr");
        let rank = document.createElement("td").innerHTML = highScore.rank
        let name = document.createElement("td").innerHTML = highScore.name
        let score = document.createElement("td").innerHTML = highScore.score
        appendToRow(row,rank,name,score)
        tbody.appendChild(row);
    })
    table.appendChild(tbody);
    document.getElementById("highScores").append(table);
}
const appendToRow = (row, ...cols)=>{
    cols.forEach(col=>{
        row.append(col)
    })
}

const populateTable = (scoreList, highScores, gameData, currScore) =>{
    scoreList.innerHTML = highScores.map((row)=>{
        return '<tr><td>${row.rank}</td><td>${row.name}</td><td>${row.score}</td></tr>';
    }).join('');
}


const calcScore = function(game, gameData)
{
    let difficulty = Math.pow(game.timeout,-1)
    let optimal = gameData.rows * gameData.cols /2
    let actual = (Math.floor(game.counter/2))
    return (optimal/actual)* difficulty * 100000 * ((optimal - 2)+1)
}

const createCardEvent = (game,card) =>{
    if(!game.revealed && (card.img.className.toString().includes("unDiscovered")) && card.img !== game.prevImg) {
        card.img.src = "Images/" + game.permutation[card.index] + ".jpg";

        if(game.counter % 2 !== 0) {
            game.revealed = true;
            if(card.img.src !== game.prevImg.src && card.img !== game.prevImg)
                setTimeout(() => {
                    card.img.src = game.prevImg.src = "Images/card.jpg";
                    game.revealed = false;
                }, game.timeout)
            else
            {
                game.remainingCards -=2
                card.img.className = game.prevImg.className = "img-fluid discovered"
                game.revealed = false;
            }
        }
        else
            game.prevImg = card.img;
        document.getElementById("colForCounter").innerHTML= "Steps: " + (Math.floor(game.counter/2)+1)
        game.counter++;
    }
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
    return fisherYatesShuffle(N,makeStartingPermutation(N/2))
}

const swapElements = (arr, i1, i2) => {
    arr[i1] = arr.splice(i2, 1, arr[i1])[0];
}

const initGameData = () =>{
    let gameData = {
        name: document.getElementById("name").value.trim(),
        rows: document.getElementById("rows-data").value,
        cols: document.getElementById("cols-data").value,
        displayTime: document.getElementById("display-time").value
    }
    return gameData
}

const handleClickSubmit = () => {
    let gameData = initGameData();
    if (validateBoardInput(gameData)) {
        runGame(gameData);
    } else
    {
        document.getElementById("name").innerHTML= "name is invalid"
    }
}

/**  upon loading the page, we bind handlers to the form and the button  */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        handleClickSubmit();
    });
    document.getElementById("settings").addEventListener("click", () => {
        toggleHid("input-data")
    });
    document.getElementById("abandonBtn").addEventListener("click", abandon);
});

let abandon = () => {
    toggleHid("beforeGame","gameProcess")
    document.getElementById("matrix").innerHTML = "";
}

let toggleHid = (...id) => {
    id.forEach(elem=>{
        let element = document.getElementById(elem);
        let hidden = element.getAttribute("hidden");
        if (hidden)
            element.removeAttribute("hidden");
        else
            element.setAttribute("hidden", "hidden");
    })
}