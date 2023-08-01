[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=9509167&assignment_repo_type=AssignmentRepo)
# ex4 javascript

# Authors:
<p>Names: Ely Asaf and Nadav Malul</p>
<p>Emails: elyas@edu.hac.ac.il and nadavma@edu.hac.ac.il</p>

# Score calculation:
<p> The score is calculated in the function 'calcScore'. <br>
The parameters for the calculation are difficulty, optimal and actual. <br>
Difficulty - It's the timeout delay chosen by the user to the power of -1, which results in a higher multiplier as the delay decreases. <br>
Optimal - It's the amount of steps a player would do if he had finished the game perfectly, calculated as the (Rows * Cols)/2. <br>
Actual - It's the actual amount of steps a player did. <br>
The end result is floor of (optimal / actual) * difficulty * 100000 * ((optimal - 2) + 1).<br>
Explanation: <br>
'(optimal / actual)' stands for the ratio of the minimum amount of steps divided by the actual amount of steps, which means that (0 < optimal <= actual) and therefore (0 < (optimal / actual) <= 1). If (optimal / actual) = 1 then the player played perfectly.
'difficulty' was explained above.
'100,000' constant multipler to reach the numbers which we would like to present.
'(optimal - 1)' is a general factor.</p>

# Shuffle algorithm:
<p> We've decided to use the "Fisher Yates Shuffle Algorithm" which generates a random permutation of the cards by swapping the last card with a random card before it. </p>
