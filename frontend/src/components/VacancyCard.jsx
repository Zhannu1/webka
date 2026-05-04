import React from 'react';

const VacancyCard = ({ vacancy, onDelete, onUpdate }) => {
  return (
    <div className="vacancy-card">
      <div className="card-top">
        {/* Вакансияның жеке фотосы */}
        <img src={vacancy.img || "https://via.placeholder.com/150"} alt={vacancy.title} className="vacancy-img" />
        <div className="vacancy-info">
          <h3>{vacancy.title}</h3>
          <p className="company-name">🏢 {vacancy.company}</p>
          <p className="salary-tag">💰 {vacancy.salary}</p>
        </div>
      </div>
      
      {/* Байланыс мәліметтері */}
      <div className="vacancy-contacts">
        <p>📞 {vacancy.phone}</p>
        <p>📧 {vacancy.email}</p>
      </div>

      <div className="card-actions">
        <button onClick={() => onUpdate(vacancy.id)}>Өзгерту</button>
        <button onClick={() => onDelete(vacancy.id)} className="btn-delete-small">Өшіру</button>
      </div>
    </div>
  );
};

export default VacancyCard;