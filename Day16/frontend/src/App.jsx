import { useState, useRef, useEffect } from 'react'
import './App.css'
import {io} from "socket.io-client"

function App() {
  const [messages, setMessages] = useState([])
  const [socket, setsocket] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    let socketInstance = io("http://localhost:3000")
    setsocket(socketInstance)
    scrollToBottom()

    socketInstance.on("ai-message-response",(response)=>{
      const botMessage = {
        id: Date.now(),
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    })
  }, [])

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return

    // Add user message to conversation history
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages([...messages, userMessage])
    socket.emit('ai-message',inputValue)
    setInputValue('')
    

  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat Application</h1>
        <button className="clear-btn" onClick={clearChat}>Clear</button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>Start a conversation! 💬</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{message.timestamp}</span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  )
}

export default App
