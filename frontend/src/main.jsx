import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { UserProvider } from './context/UserContext';
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <UserProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </UserProvider>
        </React.StrictMode>
    );
}
