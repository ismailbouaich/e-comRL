import React from 'react';
import ReactDOM from 'react-dom/client'
import Header from './common/Header'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import { ThemeProvider } from './theme/ThemePorvider';

import'./index.css'

axios.defaults.baseURL=`http://127.0.0.1:8000/api`;


axios.defaults.headers.common['Authorization']='Bearer '+localStorage.getItem('token');


axios.defaults.headers.common['Accept'] = 'application/json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> 
      <BrowserRouter>
        <div>
          <Header />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
