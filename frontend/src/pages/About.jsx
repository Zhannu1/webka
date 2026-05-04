import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      {/* Басты Hero бөлімі */}
      <section className="about-hero">
        <div className="about-text">
          <h1 className="gradient-text">JobPortal.kz туралы</h1>
          <p className="subtitle">
            Қазақстандағы ең жылдам дамып келе жатқан IT мамандар мен жұмыс берушілерді біріктіретін платформа.
          </p>
        </div>
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="IT Команда" 
            className="about-main-image"
          />
        </div>
      </section>

      {/* Біздің миссиямыз */}
      <section className="about-mission">
        <div className="mission-card">
          <div className="icon">🚀</div>
          <h3>Біздің миссиямыз</h3>
          <p>Әрбір маманның өз әлеуетін ашатын армандағы жұмысын табуына және компаниялардың ең мықты таланттарды тартуына көмектесу.</p>
        </div>
        <div className="mission-card">
          <div className="icon">💡</div>
          <h3>Біздің көзқарасымыз</h3>
          <p>Жұмыс іздеу процесін қиындықсыз, интуитивті және баршаға қолжетімді ету.</p>
        </div>
        <div className="mission-card">
          <div className="icon">🤝</div>
          <h3>Біздің құндылықтарымыз</h3>
          <p>Ашықтық, сенімділік және үнемі даму. Біз үшін әрбір қолданушының жетістігі маңызды.</p>
        </div>
      </section>

      {/* Статистика */}
      <section className="about-stats">
        <div className="stat-item">
          <h2>10,000+</h2>
          <p>Белсенді қолданушылар</p>
        </div>
        <div className="stat-item">
          <h2>500+</h2>
          <p>IT Компаниялар</p>
        </div>
        <div className="stat-item">
          <h2>2,000+</h2>
          <p>Жарияланған вакансиялар</p>
        </div>
      </section>
    </div>
  );
};

export default About;