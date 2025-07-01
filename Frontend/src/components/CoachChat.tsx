import React, { useState, useRef, useEffect } from 'react';
import './CoachChat.css';
import pixelHead from '../assets/pixelhead.png';
import pixelFull from '../assets/pixel.png';
import { apiFetch } from '../api/fetchClient';


type Message = { sender: 'user' | 'bot'; text: string };

const CoachChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const toggleChat = () => {
  if (isOpen) {
    // Schließen → reset
    setMessages([]);
    setInput('');
    setIsTyping(false);
  } else {
    // Öffnen → Begrüßung reinschicken
    setMessages([
      {
        sender: 'bot',
        text: 'Hey Champ! Ask me anything about training or nutrition'
      }
    ]);
  }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const userMsg: Message = { sender: 'user', text: input };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to chat.');
        setIsTyping(false);
        return;
      }

      try {
        const prompt = `CoachBot question: ${input}`;

        // ✨ Kleine Verzögerung vor API-Call (wirkt natürlicher)
        await new Promise(res => setTimeout(res, 800));

        const response = await apiFetch<{ antwort: string }>('/ai/chat-create-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ prompt })
        });

        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: response.antwort || 'No response' }
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: 'Oops! Something went wrong.' }
        ]);
      } finally {
        setIsTyping(false);
        setInput('');
      }
    }
  };

  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, isTyping]);


  return (
    <>
      <div className="chat-float-button" onClick={toggleChat}>
        <img src={pixelHead} alt="Coach Bubble" />
      </div>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">Your Coach</div>
          <button className="chat-close-button" onClick={toggleChat}>×</button>
          
          <div className="chat-messages">
            {messages.map((msg, i) =>



              msg.sender === 'bot' ? (
                <div className="chat-row bot" key={i}>
                  <img src={pixelFull} alt="Coach" className="chat-avatar" />
                  <div className="chat-bubble-left">{msg.text}</div>
                </div>
              ) : (
                <div className="chat-row user" key={i}>
                  <div className="chat-bubble-right">{msg.text}</div>
                </div>
              )
            )}

            {/*Typing-Blase */}
            {isTyping && (
              <div className="chat-row bot">
                <img src={pixelFull} alt="typing" className="chat-avatar" />
                <div className="chat-bubble-left typing">Coach is typing...</div>
              </div>
            )}

            {/* Hier Scroll-Marker */}
            <div ref={messagesEndRef} />


          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleSendMessage}
            placeholder="Ask me about workouts or nutrition..."
          />
        </div>
      )}
    </>
  );
};

export default CoachChat;
