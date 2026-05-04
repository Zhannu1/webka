import React, { useState } from 'react';
import VacancyForm from '../components/VacancyForm';

const Admin = ({ vacancies, addVacancy, deleteVacancy, users, deleteUser }) => {
  const [activeTab, setActiveTab] = useState('vacancies'); // Қай бөлім ашық тұрғанын сақтайды
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="admin-container animate-up">
      <div className="admin-header">
        <h1 className="gradient-text">Админ Панель</h1>
        <p>Сайттағы барлық хабарландырулар мен қолданушыларды басқару аймағы</p>
        
        {activeTab === 'vacancies' && (
          <button 
            className="btn-primary" 
            style={{marginTop: '20px'}}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Жабу' : '➕ Жаңа вакансия қосу'}
          </button>
        )}
      </div>

      {showAddForm && activeTab === 'vacancies' && (
        <div className="admin-form-wrapper animate-up" style={{marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px'}}>
          <h3>Жаңа вакансия мәліметтері</h3>
          <VacancyForm onAdd={(v) => { addVacancy(v); setShowAddForm(false); }} />
        </div>
      )}

      {/* --- Вкладкалар (Tabs) --- */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'vacancies' ? 'active' : ''}`} 
          onClick={() => setActiveTab('vacancies')}
        >
          💼 Вакансиялар ({vacancies.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} 
          onClick={() => setActiveTab('users')}
        >
          👥 Қолданушылар ({users.length})
        </button>
      </div>

      <div className="admin-content">
        {/* === ВАКАНСИЯЛАР КЕСТЕСІ === */}
        {activeTab === 'vacancies' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Лауазымы</th>
                  <th>Компания</th>
                  <th>Жалақысы</th>
                  <th>Әрекет</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v, index) => (
                  <tr key={v.id}>
                    <td>{index + 1}</td>
                    <td style={{fontWeight: 'bold', color: '#64ffda'}}>{v.title}</td>
                    <td>{v.company}</td>
                    <td>{v.salary}</td>
                    <td>
                      <button className="btn-delete" onClick={() => {
                          if(window.confirm("Бұл вакансияны өшіруге сенімдісіз бе?")) deleteVacancy(v.id);
                        }}>Өшіру</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === ҚОЛДАНУШЫЛАР КЕСТЕСІ === */}
        {activeTab === 'users' && (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Аты-жөні</th>
                  <th>Email</th>
                  <th>Рөлі</th>
                  <th>Тіркелген күні</th>
                  <th>Әрекет</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id}>
                    <td>{index + 1}</td>
                    <td style={{fontWeight: 'bold', color: '#fff'}}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {u.role === 'admin' ? 'Админ' : 'Қолданушы'}
                      </span>
                    </td>
                    <td>{u.date}</td>
                    <td>
                      {/* Админді өзі-өзін өшіруден қорғау */}
                      {u.role !== 'admin' && (
                        <button className="btn-delete" onClick={() => {
                            if(window.confirm("Бұл қолданушыны жүйеден өшіруге сенімдісіз бе?")) deleteUser(u.id);
                          }}>Өшіру</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;