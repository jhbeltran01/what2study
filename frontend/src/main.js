// Font awesome icons
// import '@fortawesome/fontawesome-free/js/fontawesome'
// import '@fortawesome/fontawesome-free/js/solid'
// import '@fortawesome/fontawesome-free/js/regular'
// import '@fortawesome/fontawesome-free/js/brands'

import './sass/main.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// main app
import App from './App';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render((
  <React.StrictMode>
    <BrowserRouter basename='app'>
      <App />
    </BrowserRouter>
  </React.StrictMode>
));