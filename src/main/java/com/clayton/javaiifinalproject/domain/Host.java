// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class Host
{
	private String hostName;
	private GameSession gameSession;
    private List<Object> drawnNums;
//	private Set<Object> drawnNums;
    private Object currentDrawnNum;
    private Random random = new Random();
    
    
    public Host(String hostName)
    {
    	this.hostName = hostName;
    	drawnNums = new ArrayList<>();
//    	drawnNums = new HashSet<>();
    	
    	generateAllDraws();
    }
    
    private void generateAllDraws()
    {
    	String[] letters = {"B", "I", "N", "G", "O"};
    	
    	for (String letter : letters)
    	{
    		for (int i=0; i<2; i++)
    			drawnNums.add(letter + " " + i);
    	}
    }
    
    public Object drawNumber()
    {
    	int rand;
    	
        if (drawnNums.size() != 0)
        {
        	rand = random.nextInt(drawnNums.size());
        	
	    	currentDrawnNum = drawnNums.get(rand);
	    	drawnNums.remove(currentDrawnNum);
        }
        else
        	currentDrawnNum = "All numbers drawn.";
    	
    	gameSession.notifyPlayers(currentDrawnNum);
    	
        return currentDrawnNum;
    }
    
    // Randomly generates a Bingo number to be drawn
//    public Object drawNumber()
//    {
//        int randLetter = random.nextInt(5);
//        String[] letters = {"B", "I", "N", "G", "O"};
//        String drawnLetter = letters[randLetter];
//        int drawnNumber = random.nextInt(2);
//        
//        currentDrawnNum = drawnLetter + " " + drawnNumber;
//        
//    	drawnNums.add(currentDrawnNum);
//    	gameSession.notifyPlayers(currentDrawnNum);
//    	
//        return currentDrawnNum;
//    }
}
