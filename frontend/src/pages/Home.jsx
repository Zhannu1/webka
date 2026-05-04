import React from 'react';
import VacancyForm from '../components/VacancyForm';
import VacancyCard from '../components/VacancyCard';
import SearchBar from '../components/SearchBar';

const Home = ({ user, vacancies, addVacancy, deleteVacancy, updateVacancy, setSearchTerm, searchTerm }) => {
  const filtered = vacancies.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="main-container">
      {/* Басты беттегі үлкен фото */}
      <div className="home-hero">
        <div className="hero-content">
          <h1>Бос жұмыс орындарын табыңыз</h1>
          <p>Қазақстандағы ең үздік компанияларда қызмет етіңіз</p>
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80" alt="Жұмыс барысы" />
        </div>
      </div>

      <div className="grid-layout">
        {user?.role === 'admin' && (
          <aside className="form-sidebar">
            <h3>Жаңа вакансия қосу</h3>
            <VacancyForm onAdd={addVacancy} />
          </aside>
        )}
        <section className="vacancy-section" style={{ gridColumn: user?.role === 'admin' ? 'auto' : '1 / -1' }}>
          <h3>Өзекті хабарландырулар ({filtered.length})</h3>
          <div className="vacancy-list">
            {filtered.map(v => (
              <VacancyCard key={v.id} vacancy={v} onDelete={deleteVacancy} onUpdate={updateVacancy} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;