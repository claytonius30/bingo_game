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
    if (window.location.href.indexOf('host.html') > -1 || window.location.href.indexOf('.html') === -1) {
        console.log("Host Create page loaded");

      // Start a bingo game
      $('#startgame').on('click', function () {
        const hostNameInput = $("#hostname").val();

        if (hostNameInput !== "") {
          // Sends host name to server (creates a Host)
          $.post(`${backendUrl}/host/start-game`, { hostName: hostNameInput }, function (data) {
          // $.post('http://146.190.162.34/host/start-game', { hostName: hostNameInput }, function (data) {
          // $.post('http://localhost:8080/host/start-game', { hostName: hostNameInput }, function (data) {
            let gameResponse = data;
            if (gameResponse !== "A host with that name already exists. Please choose another name.") {
              console.log(`Start Game button: Game created with ID: ${gameResponse}`);
              // Updates the URL with the host name and game ID
              const newUrl = `${window.location.origin}/host-draw.html?hostName=${hostNameInput}&gameId=${gameResponse}`;
              window.location.href = newUrl;
            } else {
              $('#gamecreatecheck').text(gameResponse);
              console.log(`Start Game button: ${gameResponse}`);
            }
          });
        } else {
          $('#gamecreatecheck').text("Please enter a name");
          console.log("Start Game button: Please enter a name");
        }
      });
    // This block handles the dynamically loaded host draw page
    } else if (window.location.href.indexOf("host-draw.html") > -1) {
      console.log("Host Draw page loaded");

      $('#endgame-container').hide();
      $('#reconnectbutton-container').show();

      // Assigns host name and game ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const hostName = urlParams.get('hostName');
      const gameId = urlParams.get('gameId');

      $('#hostsname').text(hostName);

      let socket = new WebSocket(`ws://${wS}/websocket-endpoint`);
      let socket2 = new WebSocket(`ws://${wS}/draw-win-endpoint`);
      let socket3 = new WebSocket(`ws://${wS}/win-message-endpoint`);
      let socket4 = new WebSocket(`ws://${wS}/game-end-endpoint`);
      // Initializes web sockets (for chat messages and draw numbers/bingo check respectively)
      // let socket = new WebSocket('ws://146.190.162.34/websocket-endpoint');
      // let socket2 = new WebSocket('ws://146.190.162.34/draw-win-endpoint');
      // let socket3 = new WebSocket('ws://146.190.162.34/win-message-endpoint');
      // let socket4 = new WebSocket('ws://146.190.162.34/game-end-endpoint');
      // let socket = new WebSocket('ws://localhost:8080/websocket-endpoint');
      // let socket2 = new WebSocket('ws://localhost:8080/draw-win-endpoint');
      // let socket3 = new WebSocket('ws://localhost:8080/win-message-endpoint');
      // let socket4 = new WebSocket('ws://localhost:8080/game-end-endpoint');
      

      $('#reconnectbutton').on("click", function () {
        if (socket.readyState === WebSocket.CLOSED) {
          socket = new WebSocket(`ws://${wS}/websocket-endpoint`);
          // socket = new WebSocket('ws://146.190.162.34/websocket-endpoint');
          // socket = new WebSocket('ws://localhost:8080/websocket-endpoint');
        } else if (socket2.readyState === WebSocket.CLOSED) {
          socket2 = new WebSocket(`ws://${wS}/draw-win-endpoint`);
          // socket2 = new WebSocket('ws://146.190.162.34/draw-win-endpoint');
          // socket2 = new WebSocket('ws://localhost:8080/draw-win-endpoint');
        } else if (socket3.readyState === WebSocket.CLOSED) {
          socket3 = new WebSocket(`ws://${wS}/win-message-endpoint`);
          // socket3 = new WebSocket('ws://146.190.162.34/win-message-endpoint');
          // socket3 = new WebSocket('ws://localhost:8080/win-message-endpoint');
        } else if (socket4.readyState === WebSocket.CLOSED) {
          socket4 = new WebSocket(`ws://${wS}/game-end-endpoint`);
          // socket4 = new WebSocket('ws://146.190.162.34/game-end-endpoint');
          // socket4 = new WebSocket('ws://localhost:8080/game-end-endpoint');
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
        $('#stopgame-container').show();
        $('#connectionstatus4').hide();
        $('#reconnectbutton').hide();
      });

      // Listens for closed fourth web socket
      socket4.addEventListener('close', (event) => {
        console.log("Fourth WebSocket connection closed:", event);
        $('#stopgame-container').hide();
        $('#connectionstatus4').show();
        $('#reconnectbutton').show();
      });

      // Sends chat message
      $("#messagebutton, #message-input").on("click keypress", function(event) {  
        if ((event.type === "click" || (event.type === "keypress" && event.key === "Enter")) && !event.shiftKey) {
          const messageInput = $('#message-input');
          const messageContent = messageInput.val().trim();
          if (messageContent !== "") {
            const message = {
                sender: hostName,
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

      // Sends a draw number
      $('#drawnumber').on('click', function () {
        $.get(`${backendUrl}/host/draw-number?hostName=${hostName}&gameId=${gameId}`, function(data) {
        // $.get(`http://146.190.162.34/host/draw-number?hostName=${hostName}&gameId=${gameId}`, function(data) {
        // $.get(`http://localhost:8080/host/draw-number?hostName=${hostName}&gameId=${gameId}`, function(data) {
          let drawnNumber = data;
          if (drawnNumber !== "") {

            const message = {
                type: 'draw',
                content: drawnNumber
            };
            if (socket2.readyState === WebSocket.OPEN) {
              socket2.send(JSON.stringify(message));
            } else {
              console.log("Socket2 is closed. Cannot send data.");
            }
          }
        });
      });

      // Resets game
      $('#resetgame').on('click', function () {
        $('#bingowin').empty();
        $('#drawnspace').empty();
        count = 1;
        $.get(`${backendUrl}/host/retart-game?hostName=${hostName}&gameId=${gameId}`, function(data) {
        // $.get(`http://146.190.162.34/host/retart-game?hostName=${hostName}&gameId=${gameId}`, function(data) {
        // $.get(`http://localhost:8080/host/retart-game?hostName=${hostName}&gameId=${gameId}`, function(data) {
          let resetResponse = data;
          $('#bingowin').prepend(resetResponse);
          setTimeout( function() {
            $('#bingowin').empty();
          }, 5000);
        });
        const message = {
          type: 'reset',
          content: "Host Restarted The Game"
        };
        if (socket4.readyState === WebSocket.OPEN) {
          socket4.send(JSON.stringify(message));
        } else {
          console.log("Socket4 is closed. Cannot send data.");
        }
      });

      // STOPs the game
      $('#endgame').on('click', function () {
        $('#stopgame-container').hide();
        const message = {
          type: 'endgame',
          content: "Host Ended The Game"
        };
        if (socket4.readyState === WebSocket.OPEN) {
          socket4.send(JSON.stringify(message));
        } else {
          console.log("Socket4 is closed. Cannot send data.");
        }
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
              $.get(`${backendUrl}/host/stop-game?hostName=${hostName}&gameId=${gameId}`, function(data) {
              // $.get(`http://146.190.162.34/host/stop-game?hostName=${hostName}&gameId=${gameId}`, function(data) {
              // $.get(`http://localhost:8080/host/stop-game?hostName=${hostName}&gameId=${gameId}`, function(data) {
                let response = data;
                $('#gameendresponse').text(response);
                $('#endgame-container').show();
                $('#reconnectbutton-container').hide();
                $('#playerlist-container').hide();
              });
              // Shows/hides end-of-game elements
              // $("#gotohomepage").show();
              // $('#reconnectbutton').hide();
              // $("#draw-container").hide();
              // $("#stopgame-container").hide();
              // $("#message-input-container").hide();
            };
            socket3.close();
          };
          socket.close();
        };
        socket2.close();
      });

      // Returns to home page
      $('#gotohomepage').on('click', function () {
        window.location.href = "index.html";
      });

      // Allows host to view additional players who may not be displayed
      $("#playersLink").on("click", function(event) {
        event.preventDefault();
        $.get(`${backendUrl}/host/players?hostName=${hostName}&gameId=${gameId}`, function(data) {
        // $.get(`http://146.190.162.34/host/players?hostName=${hostName}&gameId=${gameId}`, function(data) {
        // $.get(`http://localhost:8080/host/players?hostName=${hostName}&gameId=${gameId}`, function(data) {
          let playerNames = data;
          if (playerNames.length !== 0) {
            console.log(`Players link: ${playerNames}`);
            $('#players').children().remove();
            for (const name of playerNames) {
              $('#players').append(`<li>${name}</li>`);
            }
          } else {
            console.log("Players link: (no players joined)");
            $('#players').append(`<span>(no players joined)</span>`);
            setTimeout(function(){
              $('#players').empty();
            }, 2000);
          }
        });
      });
      
      // Listens for chat messages
      socket.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        displayMessage(receivedMessage.sender, receivedMessage.content);
        // Used to mitigate Browser-sync
        // if (receivedMessage.sender !== hostName) {
        //   if ($('#chat-messages').children(':first-child').text().includes(receivedMessage.content) &&
        //     $('#chat-messages').children(':first-child').next().text().includes(receivedMessage.content)) {
        //     $('#chat-messages').children(':first-child').remove();
        //   }
        // }
      });
      
      // Listens for joined players
      socket2.addEventListener('message', (event) => {
        const joinedPlayer = JSON.parse(event.data);
        if (joinedPlayer.type === 'player') {
          console.log("player joined:", event.data);
          $("#players").append(`<li>${joinedPlayer.content}</li>`);
        }
      });

      // Listens for draw numbers
      socket2.addEventListener('message', (event) => {
        const receivedNumber = JSON.parse(event.data);
        if (receivedNumber.type === "draw") {
          displayNumber(receivedNumber.content);
        }
      });

      // Listens for Bingo check message
        socket3.addEventListener('message', (event) => {
        const receivedBingoMessages = JSON.parse(event.data);
        
        if (receivedBingoMessages.type === 'bingo') {
          receivedBingoMessages.content.forEach(element => {
            displayBingoMessage(receivedBingoMessages.player, element);
          });
          // Used to mitigate Browser-sync
          // if ($('#bingocheck').children(':first-child').text().includes(receivedBingoMessages.content) &&
          //   $('#bingocheck').children(':first-child').next().text().includes(receivedBingoMessages.content)) {
          //     $('#bingocheck').children(':first-child').remove();
          // }
          setTimeout(function(){
            $('#bingocheck').empty();
          }, 2000);
        }
      });

      // Displays chat messages
      function displayMessage(sender, content) {
        console.log("Chat message received:", sender, content);
        const chatMessages = $('#chat-messages');
        const messageElement = $('<div>').html(`<strong>${sender}:</strong> ${content}`);
        chatMessages.prepend(messageElement);
      }

      //Displays drawn number
      function displayNumber(content) {
        console.log("Displaying Draw Number:", content);
        const numberWindow = $('#drawnspace');
        numberWindow.text(content);
      }

      // Displays Bingo check messages
      let count = 1;
      function displayBingoMessage(sender, content) {
        let bingoMessage = "";
        if (content.includes("!")) {
          if (!$('#bingowin').children().text().includes(`${sender}: ${content}`)) {
            const bingoWinMessages = $('#bingowin');
            const winElement = $('<div>').html(`${sender}: ${content}`);
            bingoWinMessages.prepend(`win#: ${count} - - - - - - -`);
            bingoWinMessages.prepend(winElement);
            count++;
            bingoMessage = $('#bingowin').children(':first-child').text();
          }
        } else {
          const noBingoMessages = $('#bingocheck');
          const noWinElement = $('<div>').html(`${sender}: ${content}`);
          noBingoMessages.prepend(noWinElement);
          bingoMessage = $('#bingocheck').children(':first-child').text();
        }
        const checkMessage = {
          type: 'bingoMessage',
          message: bingoMessage
        };
        if (bingoMessage !== "") {
          console.log('Bingo message received:', bingoMessage);
        }
        if (socket3.readyState === WebSocket.OPEN) {
          socket3.send(JSON.stringify(checkMessage));
        } else {
          console.log("Socket3 is closed. Cannot send data.");
        }
      }
    }
  })
  .catch(error => console.error('Error loading config:', error));
});
