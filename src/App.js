import React, { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import Menu from '../src/components/menu/Menu'; // Import Menu component

/*put your own key*/
const API_KEY = "_";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ message: "Hello! Select a topic to start learning.", sender: "ChatGPT" }]);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const themes = ["Fourier Transform", "Complex Numbers", "Probability", "Linear Algebra"]; // Add more themes as needed

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setMessages([{ message: `You've selected: ${theme}. Let's discuss!`, sender: "ChatGPT" }]);
  };

  const handleSend = async (message) => {
    const newMessage = { message, sender: "user", direction: "outgoing" };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message
    }));

    const systemMessage = {
      role: "system",
      content: `Explain the topic '${selectedTheme}' as if I am a university student with basic math knowledge.`
    };

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage, ...apiMessages]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((res) => res.json())
      .then((data) => {
        setMessages([...chatMessages, { message: data.choices[0].message.content, sender: "ChatGPT" }]);
        setTyping(false);
      });
  }

  return (
    <div className="App">
      <div className="container">
        <Menu themes={themes} onSelectTheme={handleThemeSelect} />
        <div className="chat-section">
          <MainContainer>
            <ChatContainer>
              <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}>
                {messages.map((msg, i) => (
                  <Message
                    key={i}
                    model={{
                      message: msg.message,
                      sender: msg.sender,
                      direction: msg.sender === "user" ? "outgoing" : "incoming"
                    }}
                  />
                ))}
              </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
