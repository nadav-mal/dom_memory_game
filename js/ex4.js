
const runGame = (gameData) => {
    toggleSettingsUI()
    initAndDisplayBoard(gameData)
}

const validateBoardInput = (gameData) => {
    let isEven = ((gameData.rows * gameData.cols) % 2 === 0)
    let nameValid = (gameData.name.length <= 12 && gameData.name.length > 0 && !(/\W/.test(gameData.name)))
    console.log("isEven: " + isEven + " nameValid: " + nameValid)
    return (isEven && nameValid)
}

const initAndDisplayBoard = (gameData) => {
    const data = document.getElementById("matrix")
    console.log("after generating")
    let permutation = generatePermutation(gameData.rows * gameData.cols)
    let prevImg = {};
    let counter = 0;
    let revealed = false;

    for(let i=0; i<gameData.rows; i++) {
        const newRow = document.createElement("ul")
        for(let j=0; j<gameData.cols; j++) {
            const img = document.createElement('img');
            img.src = "Images/card.jpg";
            let index = i*gameData.cols + j;
            img.addEventListener("click", (event) => {
                if(!revealed) {
                    let path = "Images/" + permutation[index] + ".jpg";
                    img.src = path;

                    if(counter % 2 !== 0) {
                        revealed = true;
                        if(img.src !== prevImg.src)
                            setTimeout(() => {
                                img.src = "Images/card.jpg";
                                prevImg.src = "Images/card.jpg";
                                revealed = false;
                            }, 2000)
                        else
                            revealed = false;
                    }
                    else
                        prevImg = img;

                    counter++;
                }
            });

            newRow.appendChild(img)
        }
        data.appendChild(newRow)
    }
    console.log(data)
}

const generatePermutation = (N) =>{
    let makeStartingPermutation = (N) =>{
        let curr = ""
        let index = 0
        while (index < N) {
            curr += index.toString()
            curr += index.toString()
            index++
        }
        return curr
    }
    let fisherYatesShuffle = (N, curr) => {
        let i = N - 1

        while (i >= 1) {
            console.log(curr[i])
            let rand = Math.floor(Math.random() * (i));
            let temp = curr[i]
            curr[i] = curr[rand]
            curr[rand] = temp
            i--
        }
        return curr
    }
    return fisherYatesShuffle(N,makeStartingPermutation(N/2))
}

/**  upon loading the page, we bind handlers to the form and the button  */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("HERE")
        // we build the new product object from the form input:
        let gameData = {
            name: document.getElementById("name").value.trim(),
            rows: document.getElementById("rows-data").value,
            cols: document.getElementById("cols-data").value.trim()
            //displayTime: document.getElementById("displayTime").value.trim()
        }

        if (validateBoardInput(gameData)) {
            console.log("input is valid")
            runGame(gameData);
        } else
        {
            document.getElementById("name").innerHTML= "name is invalid"
        }
        // if the product is not valid, we display the errors:
        //   document.getElementById("errorMessages").innerHTML = utilities.convertErrorsToHtml(errorMessages);
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
    toggleHid("input-data")
    toggleHid("submitRow")
    toggleHid("nameRow")
    toggleHid("abandonBtn")
}

let toggleHid = (id) => {
    let element = document.getElementById(id);
    console.log("here")
    let hidden = element.getAttribute("hidden");

    if (hidden)
        element.removeAttribute("hidden");
    else
        element.setAttribute("hidden", "hidden");
}

let flipCards = () => {
    document.querySelectorAll('img').forEach((img) => {
        console.log(img)
        img.src = "Images/card.jpg";
    })
}