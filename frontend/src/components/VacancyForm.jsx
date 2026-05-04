import React, { useState } from 'react';

const VacancyForm = ({ onAdd }) => {
  const [vacancy, setVacancy] = useState({ 
    title: '', 
    company: '', 
    salary: '',
    img: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (vacancy.title && vacancy.company) {
      onAdd(vacancy);
      setVacancy({ title: '', company: '', salary: '', img: '', phone: '', email: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '15px' }}>
      <input 
        type="text" 
        placeholder="Лауазым атауы (мысалы: IT Маман)" 
        value={vacancy.title}
        required
        onChange={(e) => setVacancy({...vacancy, title: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Компания атауы" 
        value={vacancy.company}
        required
        onChange={(e) => setVacancy({...vacancy, company: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Жалақысы (мысалы: 450,000 ₸)" 
        value={vacancy.salary}
        required
        onChange={(e) => setVacancy({...vacancy, salary: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Сурет URL-і (мысалы: https://...)" 
        value={vacancy.img}
        onChange={(e) => setVacancy({...vacancy, img: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Телефон (мысалы: +7 701...)" 
        value={vacancy.phone}
        onChange={(e) => setVacancy({...vacancy, phone: e.target.value})}
      />
      <input 
        type="email" 
        placeholder="Байланыс Email-і" 
        value={vacancy.email}
        onChange={(e) => setVacancy({...vacancy, email: e.target.value})}
      />
      <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '10px'}}>
        Жариялау
      </button>
    </form>
  );
};

export default VacancyForm;