// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class Player
{
	private String playerName;
	private BingoCard bingoCard;
	private String gameId;
	private String hostName;
	private Object drawnNumber;
	private String clickedLetter;
	private String clickedNumber;
	private List<Object> clickedNums;
	
	
	public Player(String playerName, String hostName, String gameId)
	{
        this.playerName = playerName;
        this.hostName = hostName;
        this.gameId = gameId;
        clickedNums = new ArrayList<>();
    }
	
	public String getPlayerName()
	{
        return playerName;
    }
	
	public BingoCard getBingoCard()
	{
        return bingoCard;
    }
	
	public void notifyDrawnNumber(Object drawnNumber)
	{
		this.drawnNumber = drawnNumber;
    }
	
	// Unused function from starting web page. May be used in the future
	public String recieveClickedNumber(Object clickedNum)
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
		
		return "Clicked: " + clickedNums.get(clickedNums.size() - 1);
	}
}
