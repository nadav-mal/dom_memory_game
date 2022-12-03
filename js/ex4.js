
const validateBoardInput = (gameData) => {
    let isEven = ((gameData.rows * gameData.cols) % 2 === 0)
    let nameValid = (gameData.name.length <= 12 && gameData.name.length > 0 && !(/\W/.test(gameData.name)))
    console.log("isEven: " + isEven + " nameValid: " + nameValid)
    return (isEven && nameValid)
}

const initAndDisplayBoard = (gameData) => {
    const data = document.getElementById("matrix")
    let permutation = generatePermutation(gameData.rows * gameData.cols)
    console.log("after generating")
    for(let i=0; i<gameData.rows; i++){
        const newRow = document.createElement("li")
        for(let j=0; j<gameData.cols; j++){
            const img = document.createElement('img');
            img.src = "/images" + permutation[i * j] + ".jpg";
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
            let rand = Math.random() * (i);
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
            //cols: document.getElementById("NumOfCols").value.trim(),
            //displayTime: document.getElementById("displayTime").value.trim()
        }
        //console.log("ROWS: " +prod.rows +" COLS: "+ prod.cols)

        if (validateBoardInput(gameData)) {
            console.log("input is valid")
            initAndDisplayBoard(gameData)
        } else
            console.log("Not Validated")
        // if the product is not valid, we display the errors:
        //   document.getElementById("errorMessages").innerHTML = utilities.convertErrorsToHtml(errorMessages);
    });
    document.getElementById("settings").addEventListener("click", toggle);

});


let toggle = () => {
    console.log("In 39")
    let element = document.getElementById("input-data");
    console.log(element)
    let hidden = element.getAttribute("hidden");

    if (hidden) {
        element.removeAttribute("hidden");
    } else {
        element.setAttribute("hidden", "hidden");
    }
}
