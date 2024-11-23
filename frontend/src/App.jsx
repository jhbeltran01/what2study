import React from "react";
import Router from "./routes/Router";
import { Provider } from 'react-redux';
import store from '@root/redux/store'
import axios from 'axios';
import getCsrfToken from '@services/getCsrfToken'
import StartReviewer from './StartReviewer/Main'

axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken()

const App = () => {
  return (
    // <StartReviewer />
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;