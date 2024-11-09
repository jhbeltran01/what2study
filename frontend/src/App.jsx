import React, { useEffect } from "react";
import Router from "./routes/Router";
import { Provider, useDispatch } from 'react-redux';
import store from '@root/redux/store'
import axios from 'axios';
import getCsrfToken from '@services/getCsrfToken'

axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken()

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;