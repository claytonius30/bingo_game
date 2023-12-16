// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject.domain;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@EqualsAndHashCode
@Data
public class BingoCard
{
	private List<List<Object>> cardNumbers;
	private List<Object> bingoWins;
	
	
	public BingoCard(List<List<Object>> initialNumbers)
	{
        this.cardNumbers = initialNumbers;
        bingoWins = new ArrayList<>();
        bingoWins.add("no bingo");
    }
	
	// Updates a Player's card with markings
	public List<List<Object>> updateCard(List<List<Object>> updatedNumbers)
	{
		this.cardNumbers = updatedNumbers;
		
		return cardNumbers;
    }
	
	// Checks if Player has a bingo when the press the 'BINGO' button
	public List<Object> bingoCheck()
	{
		int count = 0;
		int rowCount = 1;
		
		// checks for row Bingo
		for (List<Object> row : cardNumbers)
		{
			int selCount = 0;
			for (Object num : row)
			{
				if (num.toString().contains("X") || num.toString().contains("("))
					selCount++;
				if (selCount == 5) {
					if (bingoWins.contains("no bingo"))
						bingoWins.remove("no bingo");
					if (!bingoWins.contains("Bingo! row:" + rowCount))
					{
						bingoWins.add(0, "Bingo! row:" + rowCount);
						count++;
					}
				}
			}
			rowCount++;
		}
		// Checks for column Bingo
		for (int colIndex = 0; colIndex < cardNumbers.get(0).size(); colIndex++)
		{
		    int selCount = 0;
		    for (int rowIndex = 0; rowIndex < cardNumbers.size(); rowIndex++)
		    {
		        Object num = cardNumbers.get(rowIndex).get(colIndex);
		        if (num.toString().contains("X") || num.toString().contains("("))
		            selCount++;
		        if (selCount == 5) {
		        	if (bingoWins.contains("no bingo"))
						bingoWins.remove("no bingo");
		        	if (!bingoWins.contains("Bingo! column:" + (colIndex + 1)))
		        	{
						bingoWins.add(0, "Bingo! column:" + (colIndex + 1));
						count++;
		        	}
		        }
		    }
		}
		// Checks for left diagonal Bingo
		int leftDiagCount = 0;
		for (int i = 0; i < cardNumbers.size(); i++)
		{
		    Object num = cardNumbers.get(i).get(i);
		    if (num.toString().contains("X") || num.toString().contains("("))
		        leftDiagCount++;
		    if (leftDiagCount == 5) {
		    	if (bingoWins.contains("no bingo"))
					bingoWins.remove("no bingo");
	        	if (!bingoWins.contains("Bingo! diagonal:Left"))
	        	{
	        		bingoWins.add(0, "Bingo! diagonal:Left");
	        		count++;
	        	}
	        }
		}
		// Checks for right diagonal Bingo
		int rightDiagCount = 0;
		for (int i = 0; i < cardNumbers.size(); i++)
		{
		    Object num = cardNumbers.get(i).get(cardNumbers.get(i).size() - 1 - i);
		    if (num.toString().contains("X") || num.toString().contains("("))
		        rightDiagCount++;
		    if (rightDiagCount == 5) {
		    	if (bingoWins.contains("no bingo"))
					bingoWins.remove("no bingo");
	        	if (!bingoWins.contains("Bingo! diagonal:Right"))
	        	{
	        		bingoWins.add(0, "Bingo! diagonal:Right");
	        		count++;
	        	}
		    }
		}
		
		// Black out Bingo
		if (bingoWins.size() >= 12 && !bingoWins.contains("BLACKOUT BINGO!!"))
		{
			bingoWins.add("BLACKOUT BINGO!!");
			count++;
		}
		
		// If no Bingo already exists display "no bingo"
		if (bingoWins.get(0).equals("no bingo"))
			return bingoWins;
		// If Bingo already exists but none added, display "no more bingos"
		if (bingoWins.get(0).equals("no more bingos"))
			return bingoWins;
		if (count == 0 && !bingoWins.contains("no more bingos"))
			bingoWins.add(0, "no more bingos");
		else
			bingoWins.remove("no more bingos");
		
		return bingoWins;
	}
}
