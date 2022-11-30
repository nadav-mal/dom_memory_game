const validateBoardInput = function(prod){
    console.log("Validating")
    return true
}



    /**  upon loading the page, we bind handlers to the form and the button  */
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("form").addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("HERE")
            // we build the new product object from the form input:
            let prod = {
                name: document.getElementById("name").value.trim(),
                //rows: document.getElementById("NumOfRows").value.trim(),
                //cols: document.getElementById("NumOfCols").value.trim(),
                //displayTime: document.getElementById("displayTime").value.trim()
            }
            // we validate the product:
            if (validateBoardInput(prod)) {
                console.log("here")
                // if the product is valid, we add it to the list of products:
                //document.getElementById("errorMessages").innerHTML = "Product is saved!";
                // add the product to the list of products and update the HTML table
               // utilities.addProduct(prod);
            } else
                console.log("Not Validated")
                // if the product is not valid, we display the errors:
             //   document.getElementById("errorMessages").innerHTML = utilities.convertErrorsToHtml(errorMessages);
        });
    });

