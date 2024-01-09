import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './assets/Icons/fa6-sharp-light/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from './services/authService.tsx';



ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </React.StrictMode>,
)
