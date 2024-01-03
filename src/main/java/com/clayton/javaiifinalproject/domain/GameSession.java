// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class GameSession
{
	private String gameId;
	private Host host;
    private List<Player> players;
    private List<BingoCard> bingoCards;
    private List<Object> drawnNums;
    private Random random = new Random();
    
    
    public GameSession(String gameId)
    {
        this.gameId = gameId;
    }
    
    public GameSession(String gameId, Host host)
    {
        this.gameId = gameId;
        this.host = host;
        players = new ArrayList<>();
        bingoCards = new ArrayList<>();
        drawnNums = new ArrayList<>();
    }
    
    // Adds a Player to the game session
    public void addPlayer(Player player)
    {
        this.players.add(player);
        player.setBingoCard(new BingoCard(initializeBingoCard()));
    }
    
    // Notifies all players in GameSession of the drawn number
    public void notifyPlayers(Object drawnNumber)
    {
        for (Player player : players)
            player.notifyDrawnNumber(drawnNumber);
    }
    
    // Locates a player within players list
    public Player findPlayer(String playerName)
    {
        return players.stream()
            .filter(player -> player.getPlayerName().equals(playerName))
            .findFirst()
            .orElse(null);
    }
    
    // Randomly generates all numbers to be populated on a player's card 
    public List<List<Object>> initializeBingoCard()
    {
    	List<List<Object>> bingoCard = new ArrayList<>();

        bingoCard.add(List.of(random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1)));
        bingoCard.add(List.of(random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1)));
        bingoCard.add(List.of(random.nextInt(1), random.nextInt(1), "X", random.nextInt(1), random.nextInt(1)));
        bingoCard.add(List.of(random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1)));
        bingoCard.add(List.of(random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1), random.nextInt(1)));
        
        return bingoCard;
    }
}
