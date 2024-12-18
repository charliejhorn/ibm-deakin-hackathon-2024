import React, { useState } from 'react';
import './Chat.css';
import generateResponse from '../Model';
import { micromark } from 'micromark';

const Chat = () => {
    const [messages, setMessages] = useState([
        { sender: 'agent', text: 'Hello! How can I assist you today?' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [selectedModel, setSelectedModel] = useState('auto-reply');
    const [selectedModel, setSelectedModel] = useState('FinAdviceINST');

    const handleSend = async () => {
        if (userInput.trim()) {
            const userMessage = { sender: 'user', text: userInput };
            setMessages(prev => [...prev, userMessage]);
            setUserInput('');
            setIsLoading(true);

            if (selectedModel === 'auto-reply') {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: 'agent',
                        text: 'auto-reply'
                    }
                ]);
                setIsLoading(false);
                return;
            }

            const context = messages.map(message => `${message.sender}: ${message.text}`).join('\n');
            
            let prompt;
            if (selectedModel === 'FinAdviceINST') {
                const systemPrompt = `You are an AI financial advisor specializing in investment strategies. Your goal is to provide clear, accurate, and helpful investment advice to banking users. You should consider the user's financial goals, risk tolerance, and investment horizon when giving advice. Always prioritize the user's financial well-being and provide information on potential risks and benefits associated with different investment options. Remember to be polite, professional, and informative in your responses. Please respond to the following question:`;
                prompt = `${systemPrompt}\n${context}\nuser: ${userInput}`;
            } else {
                prompt = `${context}\nuser: ${userInput}`;
            }

            // Get AI response
            const aiResponse = await generateResponse(selectedModel, prompt);
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
        <div className="chat-window">
        <div className="messages">
            {isLoading && (
                <div className="message agent">
                    <div className="loading">...</div>
                </div>
            )}
            {[...messages].reverse().map((message, index) => (
                <div 
                    key={index} 
                    className={`message ${message.sender}`} 
                    dangerouslySetInnerHTML={{ __html: micromark(message.text) }}
                />
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
                <option value='auto-repy'>auto-reply</option>
                <option value="mistral">mistral</option>
                <option value="mmmistral">mmmistral</option>
                <option value="FinAdvice">FinAdvice</option>
                <option value="FinAdviceINST">FinAdviceINST</option>
            </select>
            <button onClick={handleSend} disabled={isLoading}>
                Send
            </button>
        </div>
        </div>
    );
};

export default Chat;