// Clayton DeSimone
// Java II Final Project
// 12/11/23 

package com.clayton.javaiifinalproject;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer
{
	String wsEndpoint = "http://localhost:3000";
//	String wsEndpoint = "http://bingo.consulogic.org:3000";
//	String wsEndpoint = "http://146.190.162.34:3000";
	
	// Registers 4 web socket end points associated with web socket controller
	@Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry)
	{		
        registry.addHandler(new WebSocketController(), "/websocket-endpoint")
        		.setAllowedOrigins(wsEndpoint);
        
        registry.addHandler(new WebSocketController(), "/draw-win-endpoint")
        		.setAllowedOrigins(wsEndpoint);
        
        registry.addHandler(new WebSocketController(), "/win-message-endpoint")
        		.setAllowedOrigins(wsEndpoint);
        
        registry.addHandler(new WebSocketController(), "/game-end-endpoint")
        		.setAllowedOrigins(wsEndpoint);
    }
}
