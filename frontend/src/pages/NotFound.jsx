import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Кешіріңіз, бұл бет табылмады.</h2>
      <Link to="/" className="btn-primary">
        Басты бетке қайту
      </Link>
    </div>
  );
};

export default NotFound;