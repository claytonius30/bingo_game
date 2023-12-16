// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.clayton.javaiifinalproject.domain.GameSession;
import com.clayton.javaiifinalproject.domain.Host;

@Service
public class BingoService
{
	private List<GameSession> gameSessions = new ArrayList<>();
    private List<Host> hosts = new ArrayList<>();
    private Map<String, GameSession> hostGameSessionMap = new HashMap<>();

    // Creates a GameSession and initializes a Host, adds to lists and map
    public GameSession createGameSession(String hostName)
    {
        Host host = new Host(hostName);
        GameSession gameSession = new GameSession(generateUniqueGameId(), host);
        hosts.add(host);
        gameSessions.add(gameSession);
        hostGameSessionMap.put(hostName, gameSession);
        host.setGameSession(gameSession);
        
        return gameSession;
    }
    
    // Generates a game ID to associate with a Host's game
    private String generateUniqueGameId()
    {
        long timestamp = System.currentTimeMillis();
        int randomSuffix = new Random().nextInt(1000); 
        return "Game_" + timestamp + "_" + randomSuffix;
    }
    
    // Locates a GameSession within gameSessions list using game ID
    public GameSession findGameSession(String gameId)
    {
        return gameSessions.stream()
            .filter(session -> session.getGameId().equals(gameId))
            .findFirst()
            .orElse(null);
    }

    // Locates a Host within hosts list using Host's name
    public Host findHost(String hostName)
    {
        return hosts.stream()
            .filter(host -> host.getHostName().equals(hostName))
            .findFirst()
            .orElse(null);
    }
    
    // Locates a GameSession within hostGameSessionMap using Host's name
    public GameSession findGameSessionByHost(String hostName)
    {
    	return hostGameSessionMap.get(hostName);
    }
    
    // Removes a Host from all collections when a game ends
    public void removeHost(String hostName)
    { 	
    	String hostToBeRemoved = hostName;
    	gameSessions.remove(hostGameSessionMap.get(hostToBeRemoved));
		System.out.println("GAME SESSION SIZE:" + getGameSessions().size());
    	hostGameSessionMap.remove(hostToBeRemoved);
    	System.out.println("MAP SIZE:" + getHostGameSessionMap().size());
    	hosts.remove(findHost(hostToBeRemoved));
    	System.out.println("HOSTS SIZE:" + getHosts().size());
    }
    
    
	public List<GameSession> getGameSessions()
	{
		return gameSessions;
	}

	public List<Host> getHosts()
	{
		return hosts;
	}

	public Map<String, GameSession> getHostGameSessionMap()
	{
		return hostGameSessionMap;
	}
}
