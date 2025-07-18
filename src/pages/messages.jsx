
import React, { useState, useEffect, useRef } from 'react';
import LoggedInLayout from '../components/loggedin';
import api from '../api';
import io from 'socket.io-client';

const SOCKET_URL = 'https://agrilink.up.railway.app';

const NewChatModal = ({ isOpen, onClose, onStartChat, existingChats }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!isOpen) return;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/users');
        if (Array.isArray(response.data)) {
          const existingChatUserIds = existingChats.map(c => c._id);
          const filteredUsers = response.data.filter(
            user => user.role !== loggedInUser.role &&
              user._id !== loggedInUser._id &&
              !existingChatUserIds.includes(user._id)
          );
          setUsers(filteredUsers);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isOpen, loggedInUser.role, loggedInUser._id, existingChats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Start a New Conversation</h2>
        <div className="max-h-96 overflow-y-auto">
          {loading ? <p>Loading users...</p> : (
            users.length > 0 ? users.map(user => (
              <div key={user._id} onClick={() => onStartChat(user)} className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center font-bold mr-3">{user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            )) : <p className="text-gray-500">No new users to chat with.</p>
          )}
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
      </div>
    </div>
  );
};

export function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    activeChatRef.current = activeChatUser;
  }, [activeChatUser]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/chatList');
      const userIds = res.data.chatList || [];

      if (userIds.length > 0) {
        const userPromises = userIds.map(id => api.get(`/api/profile/${id}`));
        const userResponses = await Promise.all(userPromises);
        const conversationUsers = userResponses.map(response => response.data);
        setConversations(conversationUsers);
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    socketRef.current = io(SOCKET_URL);
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on('newMessage', (message) => {
      const currentChatId = activeChatRef.current
        ? [loggedInUser._id, activeChatRef.current._id].sort().join('-')
        : null;

      if (message.chatId === currentChatId) {
        
        if (message.sender !== loggedInUser._id) {
          setMessages(prev => [...prev, message]);
        }
      }
    });

    return () => {
      socketRef.current.off('newMessage');
    };
  }, [loggedInUser._id]);

  const handleSelectConversation = async (user) => {
    setActiveChatUser(user);
    const chatId = [loggedInUser._id, user._id].sort().join('-');
    socketRef.current.emit('joinChat', chatId);
    try {
      const res = await api.post('/api/findChats', { chatId });
      setMessages(res.data.chats || []);
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatUser) return;

    const chatId = [loggedInUser._id, activeChatUser._id].sort().join('-');
    const messageData = {
      chatId: chatId,
      sender: loggedInUser._id,
      receiver: activeChatUser._id,
      content: newMessage,
      imageTrue: false,
    };

    socketRef.current.emit('sendMessage', messageData);

    const optimisticMessage = {
      sender: loggedInUser._id,
      content: newMessage,
      _id: Date.now()
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
  };

  const handleStartNewChat = async (userToChatWith) => {
    try {
      await api.post('/api/addchat', { id: userToChatWith._id });
      setIsModalOpen(false);
      fetchConversations();
    } catch (err) {
      console.error("Failed to start new chat", err);
    }
  };

  return (
    <LoggedInLayout>
      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onStartChat={handleStartNewChat} existingChats={conversations.map(c => c.name)} />
      <div className="h-[calc(100vh-128px)] flex">
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Conversations</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
          <ul className="overflow-y-auto flex-grow">
            {loading ? <p className="p-4">Loading...</p> : conversations.map((user) => (
              <li key={user._id} onClick={() => handleSelectConversation(user)} className={`p-4 cursor-pointer flex items-center space-x-4 ${activeChatUser?._id === user._id ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold">{user.name.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 capitalize">{user.name}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 flex flex-col bg-gray-50">
          {activeChatUser ? (
            <>
              <div className="p-4 border-b bg-white"><p className="text-md font-semibold capitalize">{activeChatUser.name}</p></div>
              <div className="flex-grow p-6 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div key={msg._id || index} className={`flex ${msg.sender === loggedInUser._id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === loggedInUser._id ? 'bg-green-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>{msg.content}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                <div className="flex items-center">
                  <input type="text" placeholder="Type a message..." className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <button type="submit" className="ml-3 flex-shrink-0 bg-green-600 text-white p-3 rounded-full hover:bg-green-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full"><p className="text-gray-500">Select a conversation to start chatting.</p></div>
          )}
        </div>
      </div>
    </LoggedInLayout>
  );
}
