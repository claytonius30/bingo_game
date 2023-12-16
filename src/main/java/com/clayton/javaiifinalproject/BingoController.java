// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.clayton.javaiifinalproject.domain.BingoCard;
import com.clayton.javaiifinalproject.domain.GameSession;
import com.clayton.javaiifinalproject.domain.Host;
import com.clayton.javaiifinalproject.domain.Player;

@RestController
//@CrossOrigin(origins = "http://bingo.consulogic.org:3000")
@CrossOrigin(origins = "http://localhost:3000")
public class BingoController
{	
	@Autowired
    private BingoService bingoService;
    
	// Variables used for the initial Bingo web page
	private List<List<Object>> bingoNumbers = new ArrayList<>();
	private List<Object> drawnNums = new ArrayList<>();
	private String drawnLetter;
	private int drawnNumber;
	private List<Object> clickedNums = new ArrayList<>();
	private String clickedLetter;
	private String clickedNumber;
	private static Random random = new Random();
	
	
	// Creates host and game session
	@PostMapping("/host/start-game")
    public ResponseEntity<String> startGame(@RequestParam String hostName)
	{
		if (bingoService.findGameSessionByHost(hostName) == null)
		{
			GameSession gameSession = bingoService.createGameSession(hostName);
			
	        return ResponseEntity.ok(gameSession.getGameId());
		}
		else
			return ResponseEntity.ok("A host with that name already exists. Please choose another name.");
    }
	
	// Creates player and joins host's game session
	@PostMapping("/player/join-game")
    public ResponseEntity<String> joinGame(@RequestParam String playerName, @RequestParam String hostName)
	{
		if (bingoService.findGameSessionByHost(hostName) != null)
		{
			GameSession gameSession = bingoService.findGameSessionByHost(hostName);

        	if (gameSession.findPlayer(playerName) == null)
        	{
	        	Player player = new Player(playerName, hostName, gameSession.getGameId());
	            gameSession.addPlayer(player);
	            return ResponseEntity.ok(gameSession.getGameId());
        	}
        	else
        		return ResponseEntity.ok("A player with that name already exists. Please choose another name.");
        } else
            return ResponseEntity.ok("Host not found");
    }
	
	// Retrieves players from game session
	@GetMapping("/host/players")
	public List<String> getPlayers(@RequestParam String hostName, @RequestParam String gameId)
	{
		Host host = bingoService.findHost(hostName);
		GameSession gameSession = bingoService.findGameSession(gameId);
		
		if (bingoService.findGameSessionByHost(hostName).equals(gameSession))
		{
			List<String> playerNames = new ArrayList<>();
	
			if (host.getGameSession().getPlayers().size() > 0)
		    {
		    	host.getGameSession().getPlayers().stream()
		    		.map(Player::getPlayerName)
		    		.forEach(playerNames::add);
		    	
		    	return playerNames;
		    }
		    return playerNames;
		}
		else
			return null;
    }
	
	// Retrieves player's card
	@GetMapping("/player/bingo-card")
    public List<List<Object>> getBingoCard(@RequestParam String hostName, @RequestParam String playerName)
	{
		GameSession gameSession = bingoService.findGameSessionByHost(hostName);
		
        if (gameSession != null)
        {
            Player player = gameSession.findPlayer(playerName);
            if (player != null)
                return player.getBingoCard().getCardNumbers();
            else
                return new ArrayList<>();
        }
        else
            return new ArrayList<>();
    }
	
	// Retrieves a drawn number
	@GetMapping("/host/draw-number")
    public Object getDrawnNumber(@RequestParam String hostName, @RequestParam String gameId)
	{
		Host host = bingoService.findHost(hostName);
		GameSession gameSession = bingoService.findGameSession(gameId);
		
		if (bingoService.findGameSessionByHost(hostName).equals(gameSession))
			return host.drawNumber();
		else
			return null;
    }
	
	// Restarts a game
	@GetMapping("/host/retart-game")
	public Object distributeNewCards(@RequestParam String hostName, @RequestParam String gameId)
	{
		GameSession gameSession = bingoService.findGameSession(gameId);
		
		if (bingoService.findGameSessionByHost(hostName).equals(gameSession))
		{
			for (Player player : gameSession.getPlayers())
				player.setBingoCard(new BingoCard(gameSession.initializeBingoCard()));
		}
		
		return "Game Reset";
	}
	
	// Stops a game
	@GetMapping("/host/stop-game")
	public Object deleteGameSession(@RequestParam String hostName, @RequestParam String gameId)
	{
		GameSession gameSession = bingoService.findGameSession(gameId);
		
		if (bingoService.findGameSessionByHost(hostName).equals(gameSession))
			bingoService.removeHost(hostName);
		
		return "Game Ended";
	}
	
	// Used prior to web sockets to retrieve a drawn number
	@GetMapping("/player/get-draw")
    public Object getDrawNumber(@RequestParam String hostName, @RequestParam String playerName)
	{
		GameSession gameSession = bingoService.findGameSessionByHost(hostName);
		Object drawnNumber = gameSession.findPlayer(playerName).getDrawnNumber();
		return drawnNumber;
	}
	
	// Updates player's card with markings
	@PostMapping("/player/update-card")
	public ResponseEntity<List<List<Object>>> updateBingoNumbers(@RequestParam String playerName, @RequestParam String hostName, 
			@RequestBody List<List<Object>> bingoNumbers)
	{
		GameSession gameSession = bingoService.findGameSessionByHost(hostName);
		Player player = gameSession.findPlayer(playerName);
		List<List<Object>> updatedCard = player.getBingoCard().updateCard(bingoNumbers);
		
		return ResponseEntity.ok(updatedCard);
    }
	
	// checks player's card for a bingo when they hit the 'BINGO' button
	@GetMapping("/player/verify-bingo")
	public List<Object> verifyBigno(@RequestParam String hostName, @RequestParam String playerName)
	{
		GameSession gameSession = bingoService.findGameSessionByHost(hostName);
		Player player = gameSession.findPlayer(playerName);
		
		List<Object> bingoResponse = player.getBingoCard().bingoCheck();
		
		return bingoResponse;
	}
	
	
	
	
	
	
	
	// Functions below are used on the first web page
	
	public List<List<Object>> newNumbers()
	{	
		bingoNumbers.clear();
		
		bingoNumbers.add(List.of(random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5)));
		bingoNumbers.add(List.of(random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5)));
		bingoNumbers.add(List.of(random.nextInt(5), random.nextInt(5), "X", random.nextInt(5), random.nextInt(5)));
		bingoNumbers.add(List.of(random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5)));
		bingoNumbers.add(List.of(random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5), random.nextInt(5)));
		
		return bingoNumbers;
	}
	
	@GetMapping("/getDrawnLetNum")
	public Object getDrawnLetNum()
	{
		int randLetter = random.nextInt(5);
		String[] letters = {"B", "I", "N", "G", "O"};
		
		drawnLetter = letters[randLetter];
		drawnNumber = random.nextInt(5);
		
		drawnNums.add(drawnLetter + " " + drawnNumber);
		
		return drawnNums;
	}
	
	@GetMapping("/getBingoNumbers")
	public List<List<Object>> getBingoNumbers()
	{
		return newNumbers();
	}
	
	@PostMapping("/recieveClickedNumber")
	public ResponseEntity<String> recieveClickedNumber(@RequestBody Object clickedNum)
	{
		String[] parts = ((String) clickedNum).split(" ");
		
		if (parts[0].equals("0"))
			clickedLetter = "B";
		else if (parts[0].equals("1"))
			clickedLetter = "I";
		else if (parts[0].equals("2"))
			clickedLetter = "N";
		else if (parts[0].equals("3"))
			clickedLetter = "G";
		else if (parts[0].equals("4"))
			clickedLetter = "O";
		
		clickedNumber = parts[1];
		
		clickedNums.add(clickedLetter + " " + clickedNumber + " (row " + parts[2] + ")");
		
		return ResponseEntity.ok("Clicked: " + clickedNums.get(clickedNums.size() - 1));
	}
	
	@PostMapping("/updateBingoNums")
	public ResponseEntity<String> updateBingoNumbers(@RequestBody List<List<Object>> updatedBingoNumbers)
	{
 
        bingoNumbers = updatedBingoNumbers;
        
        String bingoResponse = bingoCheck(bingoNumbers);

        return ResponseEntity.ok(bingoResponse);
    }
	
	@PostMapping("/verifyBingo")
	public ResponseEntity<String> verifyBigno(@RequestBody List<List<Object>> bingoNumbers)
	{
		String bingoResponse = bingoCheck(bingoNumbers);
		
		if (bingoResponse.equals("no bingo"))
			return ResponseEntity.ok("Sorry no BIGNO yet");
		else
			return ResponseEntity.ok(bingoResponse);
	}
	
	public String bingoCheck(List<List<Object>> bingoNums)
	{
		int rowCount = 1;
		
		// checks for row Bingo
		for (List<Object> row : bingoNums)
		{
			int selCount = 0;
			for (Object num : row)
			{
				if (num.toString().contains("X") || num.toString().contains("("))
					selCount++;
				if (selCount == 5)
					return String.format("Bingo! row%d", rowCount);
			}
			rowCount++;
		}
		
		// Checks for column Bingo
		for (int colIndex = 0; colIndex < bingoNums.get(0).size(); colIndex++)
		{
		    int selCount = 0;
		    for (int rowIndex = 0; rowIndex < bingoNums.size(); rowIndex++)
		    {
		        Object num = bingoNums.get(rowIndex).get(colIndex);
		        if (num.toString().contains("X") || num.toString().contains("("))
		            selCount++;
		        if (selCount == 5)
		            return String.format("Bingo! column%d", colIndex + 1);
		    }
		}
		
		// Checks for left diagonal Bingo
		int leftDiagCount = 0;
		for (int i = 0; i < bingoNums.size(); i++)
		{
		    Object num = bingoNums.get(i).get(i);
		    if (num.toString().contains("X") || num.toString().contains("("))
		        leftDiagCount++;
		    if (leftDiagCount == 5)
		        return "Bingo! Ldiagonal";
		}

		// Checks for right diagonal Bingo
		int rightDiagCount = 0;
		for (int i = 0; i < bingoNums.size(); i++)
		{
		    Object num = bingoNums.get(i).get(bingoNums.get(i).size() - 1 - i);
		    if (num.toString().contains("X") || num.toString().contains("("))
		        rightDiagCount++;
		    if (rightDiagCount == 5)
		        return "Bingo! Rdiagonal";
		}
		return "no bingo";	
	}
}
