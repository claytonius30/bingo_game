// Clayton DeSimone
// Java II Final Project
// 12/11/23 

'use strict';

$(function () {
  console.log(window.location.href);

  let wS = '';

  // Function to get the configuration based on the environment
  async function getConfigForEnvironment() {
    // Load your config.json file
    const response = await fetch('config.json');
    const config = await response.json();

    // Get the environment from the window location or any other source
    const env = window.location.href.indexOf('http://bingo.consulogic.org') > -1 ? 'production' : 'local';

    if (env === 'production') {
      // wS = '146.190.162.34';
      wS = 'bingo.consulogic.org';
    } else if (env === 'local') {
      wS = 'localhost:8080';
    }

    // Return the config for the specified environment, default to local if not found
    return config[env] || config.local;
  }

  getConfigForEnvironment()
    .then(config => {
        const backendUrl = config.backendUrl;

    // Loads the first web page
    if (window.location.href.indexOf('player.html') > -1 || window.location.href.indexOf('.html') === -1) {
      console.log("Player Join page loaded");
      
      // Join a host's game
      $('#joingame').on('click', function () {
        const playerNameInput = $('#playername').val();
        const hostNameInput = $('#hostname').val();

        if (playerNameInput !== "" && hostNameInput !== "") {
          // Sends player and host name to server (creates a Player)
          $.post(`${backendUrl}/player/join-game`, { playerName: playerNameInput, hostName: hostNameInput }, function (data) {
            let joinResponse = data;
            if (joinResponse !== "Host not found" && joinResponse !== "A player with that name already exists. Please choose another name.") {
              console.log(`Join Game button: Game joined with ID: ${joinResponse}`);
              // Updates the URL with the host name and player name
              const newUrl = `${window.location.origin}/player-card.html?hostName=${hostNameInput}&playerName=${playerNameInput}`;
              window.location.href = newUrl;
            } else {
              $('#joingamecheck').text(joinResponse);
              console.log(`Join Game button: ${joinResponse}`);
            }
          });
        } else {
          $('#joingamecheck').text("Please enter your name and a host name");
          console.log("Join Game button: Please enter your name and a host name");
        }
      });
    // This block handles the dynamically loaded player card page  
    } else if (window.location.href.indexOf('player-card.html') > -1) {    
      console.log("Player Card page loaded");

      $('#endgame-container').hide();
      $('#reconnectbutton-container').show();

      // Assigns host and player names from URL
      const urlParams = new URLSearchParams(window.location.search);
      const hostName = urlParams.get('hostName');
      const playerName = urlParams.get('playerName');

      $('#playersname').text(playerName);
      $('#hostsname').text(`host: ${hostName}`);

      let socket = new WebSocket(`ws://${wS}/websocket-endpoint`);
      let socket2 = new WebSocket(`ws://${wS}/draw-win-endpoint`);
      let socket3 = new WebSocket(`ws://${wS}/win-message-endpoint`);
      let socket4 = new WebSocket(`ws://${wS}/game-end-endpoint`);

      
      $('#reconnectbutton').on("click", function () {
        if (socket.readyState === WebSocket.CLOSED) {
          socket = new WebSocket(`ws://${wS}/websocket-endpoint`);
        } else if (socket2.readyState === WebSocket.CLOSED) {
          socket2 = new WebSocket(`ws://${wS}/draw-win-endpoint`);
        } else if (socket3.readyState === WebSocket.CLOSED) {
          socket3 = new WebSocket(`ws://${wS}/win-message-endpoint`);
        } else if (socket4.readyState === WebSocket.CLOSED) {
          socket4 = new WebSocket(`ws://${wS}/game-end-endpoint`);
        }
      });
      
      // First web socket connection opened (chat messages)
      socket.addEventListener('open', (event) => {
        console.log("First WebSocket connection opened:", event);
        $('#chatmessage-container').show();
        $('#connectionstatus1').hide();
        $('#reconnectbutton').hide();
      });

      // Listens for closed first web socket
      socket.addEventListener('close', (event) => {
        console.log("First WebSocket connection closed:", event);
        $('#chatmessage-container').hide();
        $('#connectionstatus1').show();
        $('#reconnectbutton').show();
      });

      // Second web socket connection opened (draw numbers, notify host of joined players)
      socket2.addEventListener('open', (event) => {
        console.log("Second WebSocket connection opened:", event);
        $('#drawnnumber-container').show();
        $('#connectionstatus2').hide();
        $('#reconnectbutton').hide();
      });

      // Listens for closed second web socket
      socket2.addEventListener('close', (event) => {
        console.log("Second WebSocket connection closed:", event);
        $('#drawnnumber-container').hide();
        $('#connectionstatus2').show();
        $('#reconnectbutton').show();      
      });

      // Third web socket connection opened (bingo check messages)
      socket3.addEventListener('open', (event) => {
        console.log("Third WebSocket connection opened:", event);
        $('#bingomessage-container').show();
        $('#connectionstatus3').hide();
        $('#reconnectbutton').hide();
      });

      // Listens for closed third web socket
      socket3.addEventListener('close', (event) => {
        console.log("Third WebSocket connection closed:", event);
        $('#bingomessage-container').hide();
        $('#connectionstatus3').show();
        $('#reconnectbutton').show();      
      });

      // Fourth web socket connection opened (end/restart game)
      socket4.addEventListener('open', (event) => {
        console.log("Fourth WebSocket connection opened:", event);
        $('#connectionstatus4').hide();
        $('#reconnectbutton').hide();
      });

      // Listens for closed fourth web socket
      socket4.addEventListener('close', (event) => {
        console.log("Fourth WebSocket connection closed:", event);
        $('#connectionstatus4').show();
        $('#reconnectbutton').show();
      });

      // Sends notification to host that player joined
      window.onload = function() {
        setTimeout( function() {
          const message = {
            type: 'player',
            content: playerName
          };
          if (socket2.readyState === WebSocket.OPEN) {
            socket2.send(JSON.stringify(message));
          } else {
            console.log("Socket2 is closed. Cannot send data.");
          }
        }, 1000);
      };

      // Gets the canvas element and its 2d context
      const canvas = document.getElementById('bingo-card');
      const ctx = canvas.getContext('2d');

      // Sets canvas dimensions
      canvas.width = 400;
      canvas.height = 480;

      const bingoLetters = ['B', 'I', 'N', 'G', 'O'];

      // Using hostName and playerName to fetch and display the player's card
      getCard(hostName, playerName);

      // Adds click event listener to the canvas
      canvas.addEventListener('click', (event) => {
        // Retrieves drawn number from server
        $.get(`${backendUrl}/player/get-draw?hostName=${hostName}&playerName=${playerName}`, function (data1) {
          let drawnNumber = data1;

          // Calculate card cell size based on canvas dimensions
          const cellSize = canvas.width / 5;
          const x = event.offsetX;
          const y = event.offsetY;
          const clickedRow = Math.floor(y / cellSize - 1);
          const clickedCol = Math.floor(x / cellSize);

          // Checks if letter is clicked instead of number
          if (clickedRow < 0 | (clickedRow == 2 & clickedCol == 2)) {
              // Clicked on the letters, do nothing
              return;
          }
          
          // Assigns drawn letter and number
          let letty = drawnNumber.slice(0, 1);
          let numby = parseInt(drawnNumber.slice(2, 4));
          let convLet = null;

          // Converts drawn bingo letter to number
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

          // Retrieves player's card from server
          $.get(`${backendUrl}/player/bingo-card?hostName=${hostName}&playerName=${playerName}`, function (data2) {
            let bingoNumbers = data2;

            // Adds parenthesis to clicked number
            if (clickedCol === convLet && bingoNumbers[clickedRow][clickedCol] === numby) {
              bingoNumbers[clickedRow][clickedCol] = '(' + bingoNumbers[clickedRow][clickedCol] + ')';

              // Sends updated (marked) card to server
              fetch(`${backendUrl}/player/update-card?hostName=${hostName}&playerName=${playerName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bingoNumbers)
              })
              .then(response => response.json())
              .then(data3 => {
                  let updatedBingoNumbers = data3;
                  drawBingoCard(updatedBingoNumbers);
              });
            }
          });
        });
      });
      
      // Sends chat message
      $("#messagebutton, #message-input").on("click keypress", function(event) {  
        if ((event.type === "click" || (event.type === "keypress" && event.key === "Enter")) && !event.shiftKey) {  
          let messageInput = $('#message-input');
          const messageContent = messageInput.val().trim();
          if (messageContent !== '') {
            const message = {
              sender: playerName,
              content: messageContent
            };
            // Verifies websocket is open before sending to server
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify(message));
            } else {
              console.log("Socket is closed. Cannot send data.");
            }
            messageInput.val("");
          }
          if (event.type === "keypress") {
            event.preventDefault(); // Prevent the default 'Enter' key behavior (e.g., newline in a textarea)
          }
        }
      });

      // Sends Bingo check message
      $('#bingobutton').on('click', function () {
        $.get(`${backendUrl}/player/verify-bingo?hostName=${hostName}&playerName=${playerName}`, function (data) {
          let bingoResponse = data;

          const message = {
            type: 'bingo',
            player: playerName,
            content: bingoResponse
          };
          if (socket3.readyState === WebSocket.OPEN) {
            socket3.send(JSON.stringify(message));
          } else {
            console.log("Socket3 is closed. Cannot send data.");
          }
        });
      });

      // Listens for chat messages
      socket.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        displayMessage(receivedMessage.sender, receivedMessage.content);
        // Used to mitigate Browser-sync
        // if (receivedMessage.sender !== hostName) {
        //   // This statement keeps a single player's message from broadcasting as many times as their are other players minus one (took hours and hours)
        //   if ($('#chat-messages').children(':first-child').text().includes(receivedMessage.content) &&
        //     $('#chat-messages').children(':first-child').next().text().includes(receivedMessage.content)) {
        //     $('#chat-messages').children(':first-child').remove();
        //   }
        // }
      });

      // Listens for draw numbers
      socket2.addEventListener('message', (event) => {
        const receivedNumber = JSON.parse(event.data);
        if (receivedNumber.type === 'draw') {
          displayNumber(receivedNumber.content);
        }
      });

      // Listens for game Reset
      socket4.addEventListener('message', (event) => {
        console.log("Game reset received:", event.data);
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.type === 'reset') {
          $('#bingowin').empty();
          $('#drawnspace').empty();
          count = 1;
          $('#bingowin').prepend(receivedMessage.content);
          setTimeout( function() {
            $('#bingowin').empty();
          }, 5000);
          getCard(hostName, playerName);
        };
      });

      // Listens for Ended game
      socket4.addEventListener('message', (event) => {
        console.log("Game end received:", event.data);
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.type === 'endgame') {
          $('#card-container').hide();
          // Closes socket4 first
          setTimeout( function() {
            socket4.close();
          }, 1000);
          // Closes socket2 after socket4 is closed
          socket2.onclose = function (event) {
            // Closes socket after socket2 is closed
            socket.onclose = function (event) {
              // Closes socket3 after socket is closed
              socket3.onclose = function (event) {
                $('#gameendresponse').text(receivedMessage.content);
                $('#endgame-container').show();
                $('#reconnectbutton-container').hide();
              };
              socket3.close();
            };
            socket.close();
          };
          socket2.close();
        };
      });

      // Returns to home page
      $('#gotohomepage').on('click', function () {
        window.location.href = 'index.html';
      });
      
      // Listens for Bingo check messages
      // socket2.addEventListener('message', (event) => {
      socket3.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.type === 'bingoMessage') {
          displayBingoMessage(receivedMessage.message);
          // Used to mitigate Browser-sync
          // if ($('#bingocheck').children(':first-child').text().includes(receivedMessage.message) &&
          //   $('#bingocheck').children(':first-child').next().text().includes(receivedMessage.message)) {
          //     $('#bingocheck').children(':first-child').remove();
          // }
          setTimeout(function(){
            $('#bingocheck').empty();
          }, 2000);
        }
      });

      // Builds the Bingo card
      function drawBingoCard(bingoNumbers) {
        const cellSize = canvas.width / 5;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Displays BINGO letters above each column
        for (let col = 0; col < bingoLetters.length; col++) {
            ctx.fillText(bingoLetters[col], col * cellSize + cellSize / 2, cellSize / 2);
        }

        // Displays Bingo card numbers
        for (let row = 0; row < bingoNumbers.length; row++) {
            for (let col = 0; col < bingoNumbers[row].length; col++) {
                // Draw cell
                ctx.strokeRect(col * cellSize, (row + 1) * cellSize, cellSize, cellSize);
                ctx.fillText(bingoNumbers[row][col].toString(), col * cellSize + cellSize / 2, (row + 1) * cellSize + cellSize / 2);
            }
        }
      }

      // Gets Bingo card numbers from server
      // function getCard(hostName, playerName) {
      //   $.get(`${backendUrl}/player/bingo-card?hostName=${hostName}&playerName=${playerName}`, function (data) {
      //     let bingoNumbers = data;
      //     drawBingoCard(bingoNumbers);
      //   });
      // }
      function getCard(hostName, playerName) {
        fetch(`${backendUrl}/player/bingo-card?hostName=${hostName}&playerName=${playerName}`)
          .then(response => response.json())
              // if (!response.ok) {
              //     throw new Error(`HTTP error! Status: ${response.status}`);
              // }
              // return response.json();
          // }
          .then(data => {
              let bingoNumbers = data;
              drawBingoCard(bingoNumbers);
          })
          .catch(error => console.error('Error:', error));
      }

  // ******************** Used prior to web sockets
      // Displays the current drawn number from server
      function updateDrawnNumber(hostName, playerName) {
        $.get(`${backendUrl}/player/get-draw?hostName=${hostName}&playerName=${playerName}`, function (data) {
          let drawnNumber = data;
          if (drawnNumber !== null) {
            $('#drawnspace').text(drawnNumber);
            console.log("Update draw number: " + drawnNumber);
          }
        });
      }
      
      // Displays chat messages
      function displayMessage(sender, content) {
        console.log("Chat message received:", sender, content);
        const chatMessages = $('#chat-messages');
        const messageElement = $('<div>').html(`<strong>${sender}:</strong> ${content}`);
        chatMessages.prepend(messageElement);;
      }

      // Displays drawn number
      function displayNumber(content) {
        console.log("Drawn number received:", content);
        const numberWindow = $('#drawnspace');
        numberWindow.text(content);
      }

      // Displays Bingo check messages
      let count = 1;
      function displayBingoMessage(message) {
        if (message !== "") {
          console.log("Bingo message received:", message);
        }
        if (message.includes("!")) {
          const winMessage = $('#bingowin');
          const winElement = $('<div>').html(message);
          winMessage.prepend(`win#: ${count} - - - - - - -`);
          winMessage.prepend(winElement);
          count++;
        } else {
          const noWinMessage = $('#bingocheck');
          const noWinElement = $('<div>').html(message);
          noWinMessage.prepend(noWinElement);
        }
      }
    }
  })
  .catch(error => console.error('Error loading config:', error));
});
