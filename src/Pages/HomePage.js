// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';


const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Bonjour et bienvenue!</h1>
      <div className="button-container">
        <Link to="/factures" className="button">
          Gestion de Factures
        </Link>
        <Link to="/clients" className="button">
          Gestion de Clients
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
