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
public class Host
{
	private String hostName;
	private GameSession gameSession;
    private List<Object> drawnNums;
    private Object currentDrawnNum;
    private Random random = new Random();
    
    
    public Host(String hostName)
    {
    	this.hostName = hostName;
    	drawnNums = new ArrayList<>();
    }
    
    // Randomly generates a Bingo number to be drawn
    public Object drawNumber()
    {
        int randLetter = random.nextInt(5);
        String[] letters = {"B", "I", "N", "G", "O"};
        String drawnLetter = letters[randLetter];
        int drawnNumber = random.nextInt(2);
        
        currentDrawnNum = drawnLetter + " " + drawnNumber;
        
//        if (drawnNums.size() < 49)
//        {
//	        if(!drawnNums.contains(currentDrawnNum))
//	        {
	        	drawnNums.add(currentDrawnNum);
	        	gameSession.notifyPlayers(currentDrawnNum);
//	        	return currentDrawnNum;
//	        }
//	        else
//	        	return drawNumber();
//	        }
//        else
//        	return "All Numbers Called";
        
        return currentDrawnNum;
    }
}
