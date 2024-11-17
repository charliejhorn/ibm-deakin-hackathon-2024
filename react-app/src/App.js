import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello! How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('mistral');

  const generateResponse = async (prompt) => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel, // Use the selected model
          prompt: prompt,
          stream: false
        }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  };

  const handleSend = async () => {
    if (userInput.trim()) {
      const userMessage = { sender: 'user', text: userInput };
      setMessages(prev => [...prev, userMessage]);
      setUserInput('');
      setIsLoading(true);

      // Create context from previous messages
      const context = messages.map(message => `${message.sender}: ${message.text}`).join('\n');
      const prompt = `${context}\nuser: ${userInput}`;

      // Get AI response
      const aiResponse = await generateResponse(prompt);
      setIsLoading(false);

      setMessages(prev => [...prev, {
        sender: 'agent',
        text: aiResponse
      }]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat Interface</h1>
        <div className="chat-window">
          <div className="messages">
            {isLoading && (
              <div className="message agent">
                <div className="loading">...</div>
              </div>
            )}
            {[...messages].reverse().map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="input-area">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
            >
              <option value="mistral">mistral</option>
              <option value="mmmistral">mmmistral</option>
              <option value="FinAdvice">FinAdvice</option>
            </select>
            <button onClick={handleSend} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
