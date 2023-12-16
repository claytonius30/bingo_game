// Clayton DeSimone
// Java II Final Project
// 12/11/23 

'use strict';

$(function () {
    console.log(window.location.href);

    // Loads the first web page
    if (window.location.href.indexOf('index.html') > -1 || window.location.href.indexOf('.html') === -1) {
        console.log("First Bingo page loaded");

        $('#tohostpage').on('click', function () {
            window.location = 'host.html';
            console.log("Continued HOST page");
        });

        $('#toplayerpage').on('click', function () {
            window.location = 'player.html';
            console.log("Continued PLAYER page");
        });

        // Gets the canvas element and its 2d context
        const canvas = document.getElementById('bingo-card');
        const ctx = canvas.getContext('2d');

        // Sets canvas dimensions
        canvas.width = 400;
        canvas.height = 480;

        let bingoLetters = ['B', 'I', 'N', 'G', 'O'];
        let bingoNumbers = [];
        let drawnNumbers = [];
        let currentDrawnNum = "";
        let verifyMessage = "";

        // fetch('http://bingo.consulogic.org/getBingoNumbers') // Adjust the URL to match your endpoint
        fetch('http://localhost:8080/getBingoNumbers') // Adjust the URL to match your endpoint
            .then(response => response.json())
            .then(data => {
                bingoNumbers = data; // Assign the received data to the bingoNumbers variable
                drawBingoCard(bingoNumbers);
            })
            .catch(error => console.error('Error:', error));
        
        // Adds a click event listener to the canvas
        canvas.addEventListener('click', (event) => {
            const cellSize = canvas.width / 5; // Calculate cell size based on canvas dimensions
            const x = event.offsetX;
            const y = event.offsetY;

            const clickedRow = Math.floor(y / cellSize - 1);
            const clickedCol = Math.floor(x / cellSize);

            // Checks if letter is clicked instead of number
            if (clickedRow < 0 | (clickedRow == 2 & clickedCol == 2)) {
                // Clicked on the letters, do nothing
                return;
            }

            let letty = currentDrawnNum.slice(0, 1);
            let numby = parseInt(currentDrawnNum.slice(2, 4));
            let convLet = null;

            if (letty == 'B') {
                convLet = 0;
            } else if (letty == 'I') {
                convLet = 1;
            } else if (letty == 'N') {
                convLet = 2;
            } else if (letty == 'G') {
                convLet = 3;
            } else if (letty == 'O') {
                convLet = 4;
            }


            if (clickedCol === convLet && bingoNumbers[clickedRow][clickedCol] === numby) {
                bingoNumbers[clickedRow][clickedCol] = '(' + bingoNumbers[clickedRow][clickedCol] + ')';
                drawBingoCard(bingoNumbers);
            }

            //Sends clicked card number to the server
            // fetch('http://bingo.consulogic.org/recieveClickedNumber', {
            fetch('http://localhost:8080/recieveClickedNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clickedCol + " " + bingoNumbers[clickedRow][clickedCol] + " " + (clickedRow + 1)),
            })
            .then(response => response.text())
            .then(message => {
                console.log(message); // Server response
            })
            .catch(error => console.error('Error:', error));

            // Sends updated card data to the server
            // fetch('http://bingo.consulogic.org/updateBingoNums', {
            fetch('http://localhost:8080/updateBingoNums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bingoNumbers),
            })
            .then(response => response.text())
            .then(message => {
                if (message !== 'no bingo') {
                    console.log("Backend: " + message); // Server response
                }
            })
            .catch(error => console.error("Error:", error));
        });
        
        // Function that returns the drawn letter and number
        $('#drawnumber').on('click', function () {
            $('#bingocheck').text("");
            // fetch('http://bingo.consulogic.org/getDrawnLetNum')
            fetch('http://localhost:8080/getDrawnLetNum')
            .then(response => response.json())
            .then(data => {
                drawnNumbers = data;
                currentDrawnNum = drawnNumbers[drawnNumbers.length - 1];
                console.log("Draw button: " + currentDrawnNum);
                $('#drawnspace').text(currentDrawnNum);

            })
            .catch(error => console.error('Error:', error));
        });

        // Verifies if BINGO is present on card when bingo button clicked, returns message
        $('#bingobutton').on('click', function () {
            if (currentDrawnNum !== "") {
                // fetch('http://bingo.consulogic.org/verifyBingo', {
                fetch('http://localhost:8080/verifyBingo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bingoNumbers),
                })
                .then(response => response.text())
                .then(message => {
                    verifyMessage = message;
                    currentDrawnNum = drawnNumbers[drawnNumbers.length - 1];
                    console.log("BINGO button: " + verifyMessage);
                    $('#bingocheck').text(verifyMessage);

                })
                .catch(error => console.error('Error:', error));
            }
            else {
                $('#bingocheck').text("Please draw a number");
                console.log("BINGO button: Please draw a number");
            }
        });
        

        // Function to draw the Bingo card
        function drawBingoCard(bingoNumbers) {
            const cellSize = canvas.width / 5; // Adjust cell size according to canvas dimensions
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'black';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draws BINGO letters above each column
            for (let col = 0; col < bingoLetters.length; col++) {
                ctx.fillText(bingoLetters[col], col * cellSize + cellSize / 2, cellSize / 2);
            }

            // Draws Bingo card numbers
            for (let row = 0; row < bingoNumbers.length; row++) {
                for (let col = 0; col < bingoNumbers[row].length; col++) {
                    // Draw cell
                    ctx.strokeRect(col * cellSize, (row + 1) * cellSize, cellSize, cellSize);
                    ctx.fillText(bingoNumbers[row][col].toString(), col * cellSize + cellSize / 2, (row + 1) * cellSize + cellSize / 2);
                }
            }
        }
    }
});