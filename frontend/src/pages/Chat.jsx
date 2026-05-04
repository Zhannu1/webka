import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Chat = ({ currentUser, users }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [unreadCounts, setUnreadCounts] = useState({}); // { sender_id: count }
    const messagesEndRef = useRef(null);

    // Хабарламаларды жүктеу
    const fetchMessages = async () => {
        if (!selectedUser) return;
        try {
            const res = await axios.get(`${API_URL}/messages/${currentUser.id}/${selectedUser.id}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Хабарламаларды алу қатесі:", err);
        }
    };

    // Оқылмаған хабарламалар санын жүктеу
    const fetchUnreadCounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/messages/unread-counts/${currentUser.id}`);
            const counts = {};
            res.data.forEach(item => {
                counts[item.sender_id] = parseInt(item.count);
            });
            setUnreadCounts(counts);
        } catch (err) {
            console.error("Оқылмағандарды алу қатесі:", err);
        }
    };

    // Хабарламаны оқылды деп белгілеу
    const markAsRead = async (senderId) => {
        try {
            await axios.patch(`${API_URL}/messages/read/${senderId}/${currentUser.id}`);
            fetchUnreadCounts();
        } catch (err) {
            console.error("Оқылды деп белгілеу қатесі:", err);
        }
    };

    useEffect(() => {
        fetchUnreadCounts();
        const interval = setInterval(() => {
            fetchUnreadCounts();
            if (selectedUser) fetchMessages();
        }, 4000); // Поллинг 4 секунд сайын
        return () => clearInterval(interval);
    }, [currentUser, selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages();
            markAsRead(selectedUser.id);
        }
    }, [selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        // Шектеу: 100 таңба
        if (newMessage.length > 100) {
            return alert("Хабарлама 100 таңбадан аспауы керек!");
        }

        try {
            const msgData = {
                sender_id: currentUser.id,
                receiver_id: selectedUser.id,
                message_text: newMessage
            };
            await axios.post(`${API_URL}/messages`, msgData);
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            let errorMsg = "Хабарлама жіберу мүмкін болмады!";
            if (!err.response) {
                errorMsg = "Сервермен байланыс жоқ! (Backend қосулы ма?)";
            } else if (err.response.data && err.response.data.error) {
                errorMsg = err.response.data.error;
            }
            alert(`Қате: ${errorMsg}`);
        }
    };

    // Іздеу бойынша сүзу
    const filteredUsers = users.filter(u => 
        u.id !== currentUser.id && 
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-page-layout animate-up">
            {/* Сол жақ: Қолданушылар тізімі + Іздеу */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h3 style={{margin: '0 0 10px 0'}}>Контактілер</h3>
                    <input 
                        type="text" 
                        placeholder="Іздеу..." 
                        className="search-input-small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="user-list">
                    {filteredUsers.length === 0 ? (
                        <p style={{padding: '20px', fontSize: '13px', color: '#8892b0'}}>Ешкім табылмады</p>
                    ) : (
                        filteredUsers.map(u => (
                            <div 
                                key={u.id} 
                                className={`user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
                                onClick={() => setSelectedUser(u)}
                            >
                                <div className="avatar" style={{width: '35px', height: '35px', fontSize: '14px'}}>
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <p style={{margin: 0, fontWeight: 'bold'}}>{u.name}</p>
                                    <span style={{fontSize: '11px', opacity: 0.6}}>{u.role}</span>
                                </div>
                                {unreadCounts[u.id] > 0 && (
                                    <span className="unread-badge-small">{unreadCounts[u.id]}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Оң жақ: Чат терезесі */}
            <div className="chat-main">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <div className="avatar">{selectedUser.name.charAt(0).toUpperCase()}</div>
                            <div>
                                <h3 style={{margin: 0}}>{selectedUser.name}</h3>
                                <span style={{fontSize: '12px', color: '#64ffda'}}>онлайн</span>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <p style={{textAlign: 'center', color: '#8892b0'}}>Әлі хабарламалар жоқ. Сөйлесуді бастаңыз!</p>
                            ) : (
                                messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`message ${msg.sender_id === currentUser.id ? 'sent' : 'received'}`}
                                    >
                                        {msg.message_text}
                                        <div style={{fontSize: '10px', opacity: 0.6, marginTop: '5px', textAlign: 'right'}}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Хабарлама (макс. 100 таңба)..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="btn-primary">Жіберу</button>
                        </form>
                    </>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#8892b0', textAlign: 'center', padding: '20px'}}>
                        <div>
                           <div style={{fontSize: '40px', marginBottom: '10px'}}>💬</div>
                           <p>Сөйлесу үшін контактіні таңдаңыз</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
