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
    private List<Object> allDrawNums;
//	private Set<Object> allDrawNums;
    private Object currentDrawnNum;
    private Random random = new Random();
    
    
    public Host(String hostName)
    {
    	this.hostName = hostName;
    	allDrawNums = new ArrayList<>();
//    	allDrawNums = new HashSet<>();
    	
    	generateAllDraws();
    }
    
    // Clears allDrawNums and re-populates with all numbers
    public void resetDrawNums()
    {
    	allDrawNums.clear();
    	gameSession.getDrawnNums().clear();
    	generateAllDraws();
    }
    
    // Generates all draw number values
    private void generateAllDraws()
    {
    	String[] letters = {"B", "I", "N", "G", "O"};
    	
    	for (String letter : letters)
    	{
    		for (int i=0; i<6; i++)
    			allDrawNums.add(letter + " " + i);
    	}
    }
    
    // Randomly draws and removes number from allDrawNums. Notifies players and returns current draw.
    public Object drawNumber()
    {
    	int rand;
    	
        if (allDrawNums.size() != 0)
        {
        	rand = random.nextInt(allDrawNums.size());
        	
	    	currentDrawnNum = allDrawNums.get(rand);
	    	allDrawNums.remove(currentDrawnNum);
	    	gameSession.getDrawnNums().add(currentDrawnNum);
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
//    	allDrawNums.add(currentDrawnNum);
//    	gameSession.notifyPlayers(currentDrawnNum);
//    	
//        return currentDrawnNum;
//    }
}
