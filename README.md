Clayton DeSimone

Challenge:
Design a web application that allows a host and players to play Bingo online, removing the need to meet 
in person in order to play.

Context:
For the final project in my Java II class I needed to create some type of application. I decided to create 
a web app to allow the ability to facilitate a Bingo game or tournament online so players can play virtually 
with one another using a tablet, smart phone, or desktop computer. I also wanted to include the ability for 
players and host to chat with each other through the app, similar to instant messaging, in order to allow 
communication throughout the game.

Action:
Using Java for the server-side logic, I created several classes including: Player, Host, BingoCard, and 
GameSession. Using Spring MVC, I also created BingoController to control HTTP requests endpoints, as well as 
a BingoService class to control each game session (for initial game setup, reset, and end-of-game logic). 
I used the Web Socket API for the interaction between players and host (such as the chat, drawn number updates, 
and updates if someone scored a bingo), which required its own WebSocketController class and a WebSocketConfig 
class for web socket endpoints. For the client-side, I used Visual Studio to run Javascript, CSS, and HTML.

In order to serve the application I used a DigitalOcean droplet using an Ubuntu server.

Result:
By the end of the semester, I successfully completed the app and was able to run the server and play a Bingo 
game with my class on our last day. The game was a success without any errors that stopped us from completing 
the game. I was able to use this opportunity to take notes and further improve the game based on suggestions 
from my classmates.

Reflection:
I learned how much is involved in running a web app that interacts with different participants on their own devices 
and the many ways to facilitate interaction. I learned to appreciate the importance of using REST services and how to 
efficiently direct communication between the server and client-side using HTTP requests.
