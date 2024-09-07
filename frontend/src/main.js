// Font awesome icons
// import '@fortawesome/fontawesome-free/js/fontawesome'
// import '@fortawesome/fontawesome-free/js/solid'
// import '@fortawesome/fontawesome-free/js/regular'
// import '@fortawesome/fontawesome-free/js/brands'

import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import Auth from './modules/authentication/Auth';

// main app

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth />
  </React.StrictMode>
);