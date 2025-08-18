import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/appContext';
import { ApiProvider } from './context/apiContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApiProvider>    
    <AppProvider>
      <App />
    </AppProvider>
    </ApiProvider>
   
  </React.StrictMode>
);


