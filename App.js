import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logoImage from './robo.png';

function App() {
  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState(''); // Separate state for bot response
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Add initial message when the component mounts
    setChatHistory([
      { type: 'bot', message: 'Hi there! I am your friendly business coach chatbot, ask me anything about your business so that I can help you.' },
    ]);
  }, []); // Empty dependency array ensures this effect runs only once

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userInput.trim() !== '') {
      // Update chat history with user message
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'user', message: userInput },
      ]);

      // Send user input to the Flask backend
      const API_URL = 'http://localhost:5000/api/chatbot';
      try {
        const response = await axios.post(API_URL, { question: userInput });

        // Update bot response character by character
        const { response: botOutput } = response.data;
        updateBotResponse(botOutput);

      } catch (error) {
        console.error('Error fetching chatbot response:', error);
      }

      setUserInput('');
    }
  };

  // Update bot response character by character
  const updateBotResponse = (response) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setBotResponse((prevResponse) => {
        if (currentIndex === response.length) {
          clearInterval(interval);
          return [...prevResponse, response[currentIndex - 1]].join(''); // Join characters at the end
        }
        return [...prevResponse, response[currentIndex]].join('');
      });
      currentIndex++;
    }, 50); // Adjust typing speed as needed
  };

  return (
    <div className="App">
      <div className="header">
        <img src={logoImage} alt="Logo" className="logo" />
        <h1 className="center-heading">Khayelitsha Business Coach</h1>
      </div>
      <div className="chat-container">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`message ${chat.type}`}>
            <span>{chat.message}</span>
          </div>
        ))}
        {botResponse && (
          <div className="message bot">
            <span>{botResponse}</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Enter your question..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
