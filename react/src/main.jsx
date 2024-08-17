import React from 'react';
import ReactDOM from 'react-dom/client'
import Header from './common/Header'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { ThemeProvider } from './theme/ThemePorvider';
import { Provider } from 'react-redux';
import store from './redux/store';

import'./index.css'
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

axios.defaults.baseURL=`http://127.0.0.1:8000/api`;


axios.defaults.headers.common['Authorization']='Bearer '+localStorage.getItem('token');


axios.defaults.headers.common['Accept'] = 'application/json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <ThemeProvider> 
      <BrowserRouter>
      <I18nextProvider i18n={i18n}>
      <App />
      </I18nextProvider>
      </BrowserRouter>
    </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
