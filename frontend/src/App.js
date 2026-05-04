import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin'; 
import Chat from './pages/Chat'; // Чат компонентін қосу
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Zа-яА-ЯәіңғүұқөһӘІҢҒҮҰҚӨҺ\s]*$/.test(value)) {
      setForm({ ...form, name: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, {
          email: form.email,
          password: form.password
        });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
      } else {
        if (form.password !== form.confirmPassword) return setError("Құпия сөздер сәйкес келмейді!");
        
        await axios.post(`${API_URL}/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.email === 'admin@jobportal.kz' ? 'admin' : 'user'
        });
        alert("Тіркелу сәтті өтті! Енді жүйеге кіріңіз.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Қате орын алды!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">JobPortal<span>.kz</span></div>
        <h2 style={{ marginBottom: '20px' }}>{isLogin ? 'Қош келдіңіз!' : 'Жаңа аккаунт ашу'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input type="text" placeholder="Аты-жөніңіз (тек әріптер)" required value={form.name} onChange={handleNameChange} />
          )}
          <input type="email" placeholder="Email поштаңыз" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Пароль (кемінде 6 таңба)" 
              required 
              value={form.password} 
              onChange={(e) => setForm({...form, password: e.target.value})} 
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Жасыру" : "Көрсету"}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {!isLogin && (
             <div className="password-input-wrapper">
               <input 
                 type={showConfirmPassword ? "text" : "password"} 
                 placeholder="Парольді қайталаңыз" 
                 required 
                 value={form.confirmPassword} 
                 onChange={(e) => setForm({...form, confirmPassword: e.target.value})} 
               />
               <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} title={showConfirmPassword ? "Жасыру" : "Көрсету"}>
                 {showConfirmPassword ? "🙈" : "👁️"}
               </span>
             </div>
          )}
          
          {isLogin && (
            <div className="auth-options">
              <label style={{display: 'flex', alignItems: 'center', gap: '5px'}}><input type="checkbox" style={{width: 'auto', margin: 0}} /> Сақтау</label>
              <span className="forgot-link" onClick={() => alert("Нұсқаулық поштаңызға жіберіледі.")}>Парольді ұмыттыңыз ба?</span>
            </div>
          )}

          <button type="submit" className="btn-primary">{isLogin ? 'Жүйеге кіру' : 'Тіркелу'}</button>
        </form>

        <div className="auth-switch">
          {isLogin ? 'Аккаунтыңыз жоқ па?' : 'Аккаунтыңыз бар ма?'} 
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>{isLogin ? 'Тіркелу' : 'Кіру'}</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [searchTerm, setSearchTerm] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  
  // Тема (Dark/Light) күйі
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Хабарландырулар үшін күй
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // Мобильді мәзір күйі

  useEffect(() => {
    fetchVacancies();
    if (user) {
      fetchNotifications();
      fetchUsers();
      fetchTotalUnreadMessages();
      
      const msgInterval = setInterval(fetchTotalUnreadMessages, 5000);
      return () => clearInterval(msgInterval);
    }
  }, [user]);

  // Теманы сақтау және қолдану
  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchVacancies = async () => {
    try {
      const res = await axios.get(`${API_URL}/vacancies`);
      setVacancies(res.data);
    } catch (err) {
      console.error("Error fetching vacancies:", err);
    }
  };

  const fetchTotalUnreadMessages = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/messages/unread-counts/${user.id}`);
      const total = res.data.reduce((sum, item) => sum + parseInt(item.count), 0);
      setTotalUnreadMessages(total);
    } catch (err) {
      console.error("Total unread fetch error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsersList(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/notifications/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setUsersList(usersList.filter(u => u.id !== id));
    } catch (err) {
      alert("Пайдаланушыны өшіру қатесі!");
    }
  };

  const addVacancy = async (v) => {
    try {
      const res = await axios.post(`${API_URL}/vacancies`, v);
      setVacancies([res.data, ...vacancies]);
    } catch (err) {
      alert("Вакансия қосу қатесі!");
    }
  };

  const deleteVacancy = async (id) => {
    try {
      await axios.delete(`${API_URL}/vacancies/${id}`);
      setVacancies(vacancies.filter(v => v.id !== id));
    } catch (err) {
      alert("Вакансияны өшіру қатесі!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Router>
      {user && (
        <header className="main-header">
          <div className="brand">JobPortal<span>.kz</span></div>
          <nav className="nav-menu">
            {/* Тема ауыстырғыш */}
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Гамбургер мәзірі (Мобильді) */}
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
              <Link to="/">Басты бет</Link>
              <Link to="/chat" style={{color: '#ffb703'}}>💬 Чат {totalUnreadMessages > 0 && `(${totalUnreadMessages})`}</Link>
              <Link to="/about">Біз туралы</Link>
              <Link to="/contact">Байланыс</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="admin-link">⚙️ Админ панель</Link>
              )}
            </div>
            
            {/* Хабарландыру қоңырауы */}
            <div className="notification-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
              <span className="notification-bell">🔔</span>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <h3 style={{fontSize: '16px', margin: '10px'}}>Хабарландырулар</h3>
                  {notifications.length === 0 ? (
                    <p style={{fontSize: '12px', padding: '10px', textAlign: 'center'}}>Әлі жоқ</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notification-item ${!n.is_read ? 'unread' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <h4>{n.title}</h4>
                        <p>{n.message}</p>
                        <span style={{fontSize: '10px', opacity: 0.5}}>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </nav>
          
          <div className="user-profile">
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
            <button className="btn-logout" onClick={handleLogout}>Шығу</button>
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={user ? (
          <Home user={user} vacancies={vacancies} addVacancy={addVacancy} deleteVacancy={deleteVacancy} updateVacancy={() => {}} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
        ) : <AuthPage setUser={setUser} />} />
        
        <Route path="/admin" element={user?.role === 'admin' ? (
          <Admin vacancies={vacancies} addVacancy={addVacancy} deleteVacancy={deleteVacancy} users={usersList} deleteUser={deleteUser} />
        ) : <Navigate to="/" />} />

        {/* Чат маршруты - Барлық қолданушылар тізімін жібереміз */}
        <Route path="/chat" element={user ? (
          <div className="main-container" style={{marginTop: '40px'}}>
             <Chat currentUser={user} users={usersList} />
          </div>
        ) : <Navigate to="/" />} />

        <Route path="/jobs" element={<Navigate to="/" />} />
        <Route path="/about" element={user ? <About /> : <Navigate to="/" />} />
        <Route path="/contact" element={user ? <Contact /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
