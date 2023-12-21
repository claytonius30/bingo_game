// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


//@CrossOrigin(origins = "http://bingo.consulogic.org:3000")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "http://bingo.logiconsul.org:3000")
@Controller
public class WebSocketController extends TextWebSocketHandler
{
	private final Set<WebSocketSession> sessions = new HashSet<>();

	// Called by the web socket framework when a new web socket connection is established
    @Override
    public void afterConnectionEstablished(WebSocketSession session)
    {
        sessions.add(session);
    }
    
    // Broadcasts a received message to all connected web sockets
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message)
    {
        for (WebSocketSession webSocketSession : sessions) {
            try
			{
				webSocketSession.sendMessage(message);
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
        }
    }
    
    // Updates the set of web socket sessions once a connection has been closed. Essential to reopen the same web socket
    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status)
    {
        sessions.remove(session);
    }
}
