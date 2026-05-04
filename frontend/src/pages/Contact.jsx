import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Форма жіберілгенде шығатын хабарлама
    alert('Хабарламаңыз сәтті жіберілді! Біз сізбен жақын арада байланысамыз.');
    setFormData({ name: '', email: '', message: '' }); // Форманы тазалау
  };

  return (
    <div className="contact-container">
      <div className="text-center">
        <h1 className="gradient-text">Бізбен байланыс</h1>
        <p className="subtitle">Сұрақтарыңыз немесе ұсыныстарыңыз болса, бізге жазыңыз.</p>
      </div>

      <div className="contact-content">
        {/* Сол жақ: Ақпараттық карточкалар */}
        <div className="contact-info">
          <div className="contact-card">
            <span className="icon">📧</span>
            <div>
              <h3>Email</h3>
              <p>info@jobportal.kz</p>
            </div>
          </div>
          <div className="contact-card">
            <span className="icon">📞</span>
            <div>
              <h3>Телефон</h3>
              <p>+7 (700) 123 45 67</p>
            </div>
          </div>
          <div className="contact-card">
            <span className="icon">🏢</span>
            <div>
              <h3>Мекен-жай</h3>
              <p>Астана қ., IT Hub, 5-қабат</p>
            </div>
          </div>
        </div>

        {/* Оң жақ: Хат жазу формасы */}
        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Хабарлама жіберу</h2>
            <input 
              type="text" 
              placeholder="Аты-жөніңіз" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Email поштаңыз" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
            <textarea 
              placeholder="Хабарламаңызды осында жазыңыз..." 
              rows="5" 
              required 
              value={formData.message} 
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            ></textarea>
            <button type="submit" className="btn-primary">
              Жіберу
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;