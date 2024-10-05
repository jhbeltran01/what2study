import React, { useEffect } from "react";
import Router from "./routes/Router";
import { Provider } from 'react-redux';
import store from '@root/redux/store'
import axios from 'axios';
import getCsrfToken from '@services/getCsrfToken'
import Auth from "./modules/authentication/Auth";

axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken()

const App = () => {
  useEffect(() => {
    
  }, [])

  return (
    <Provider store={store}>
      <Auth />
      <Router />
    </Provider>
  );
};

export default App;
