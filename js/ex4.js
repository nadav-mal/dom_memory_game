
const runGame = (gameData) => {
    toggleSettingsUI()
    initAndDisplayBoard(gameData)
}

const validateBoardInput = (gameData) => {
    let isEven = ((gameData.rows * gameData.cols) % 2 === 0)
    let nameValid = (gameData.name.length <= 12 && gameData.name.length > 0 && !(/\W/.test(gameData.name)))
    return (isEven && nameValid)
}

const initAndDisplayBoard = (gameData) => {
    const data = document.getElementById("matrix");
    const permutation = generatePermutation(gameData.rows * gameData.cols)
    const timeout = gameData.displayTime * 1000;
    let prevImg = {};
    let counter = 0;
    let revealed = false;

    for(let i=0; i<gameData.rows; i++) {
        const newRow = document.createElement("tr")
        for(let j=0; j<gameData.cols; j++) {
            const col = document.createElement("td")
            const img = document.createElement('img');
            img.className = "img-fluid unDiscovered"
            img.src = "Images/card.jpg";
            let index = i*gameData.cols + j;
            img.addEventListener("click", () => {
                console.log(img.className + "  " + "revealed")
                if(!revealed && (img.className.toString().includes("unDiscovered")) && img !== prevImg) {
                    img.src = "Images/" + permutation[index] + ".jpg";

                    if(counter % 2 !== 0) {
                        revealed = true;
                        if(img.src !== prevImg.src && img !== prevImg)
                            setTimeout(() => {
                                img.src = prevImg.src = "Images/card.jpg";
                                revealed = false;
                            }, timeout)
                        else
                        {
                            img.className = prevImg.className = "img-fluid discovered"
                            revealed = false;
                        }
                    }
                    else
                        prevImg = img;
                    document.getElementById("colForCounter").innerHTML= "Steps: " + Math.floor(counter/2)
                    counter++;
                }
            });
            col.appendChild(img)
            newRow.appendChild(col)
        }
        data.appendChild(newRow);
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

/**  upon loading the page, we bind handlers to the form and the button  */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        let gameData = {
            name: document.getElementById("name").value.trim(),
            rows: document.getElementById("rows-data").value,
            cols: document.getElementById("cols-data").value,
            displayTime: document.getElementById("display-time").value
        }
        if (validateBoardInput(gameData)) {
            runGame(gameData);
        } else
        {
            document.getElementById("name").innerHTML= "name is invalid"
        }
    });
    document.getElementById("settings").addEventListener("click", () => {
        toggleHid("input-data")
    });
    document.getElementById("abandonBtn").addEventListener("click", abandon);
});

let abandon = () => {
    toggleSettingsUI()
    document.getElementById("matrix").innerHTML = "";
}

let toggleSettingsUI = () => {
    toggleHid("beforeGame")
    toggleHid("abandonBtn")
}

let toggleHid = (id) => {
    let element = document.getElementById(id);
    let hidden = element.getAttribute("hidden");

    if (hidden)
        element.removeAttribute("hidden");
    else
        element.setAttribute("hidden", "hidden");
}