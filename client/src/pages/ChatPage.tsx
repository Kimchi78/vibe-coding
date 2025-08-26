import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '../redux/store';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  image?: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '' && !image) return;

    const userMessage: Message = { sender: 'user', text: inputText };
    if (image) {
      userMessage.image = image;
    }

    setMessages([...messages, userMessage]);
    setInputText('');
    setImage(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: inputText, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage: Message = { sender: 'ai', text: response.data.text };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { sender: 'ai', text: 'Error: Could not get a response.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div ref={chatHistoryRef} className="flex-grow-1 overflow-auto p-3">
        {messages.map((msg, index) => (
          <div key={index} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`card p-2 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
              {msg.image && <img src={msg.image} alt="upload preview" className="img-fluid mb-2" style={{ maxHeight: '200px' }}/>}
              <p className="mb-0">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-light">
        {image && (
          <div className="position-relative d-inline-block mb-2">
            <img src={image} alt="upload preview" className="img-fluid" style={{ maxHeight: '100px' }}/>
            <button className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => setImage(null)}>X</button>
          </div>
        )}
        <div className="input-group">
          <label htmlFor="image-upload" className="btn btn-secondary">
            <i className="bi bi-image"></i>
          </label>
          <input type="file" id="image-upload" className="d-none" onChange={handleImageUpload} accept="image/*"/>
          <input
            type="text"
            className="form-control"
            placeholder="메시지를 입력하세요..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="btn btn-primary" onClick={handleSendMessage} style={{ backgroundColor: '#00EEFF', borderColor: '#00EEFF' }}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
