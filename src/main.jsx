import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@app/App';
import './index.css';
import logger from '@core/utils/logger';
import { LanguageProvider } from '@app/providers/LanguageContext';
import { reduxStore } from '@core/store/store';
import { receiveCall } from '@core/store/slices/callsSlice';

// App startup timing
logger.time('AppMount');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('SW registration failed: ', err);
        });
    });
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>
);

// Global debug helper
window.simulateIncomingCall = (type = 'video', name = 'Susanna Davis', avatar = 'https://ui-avatars.com/api/?name=Susanna+Davis&background=random') => {
    reduxStore.dispatch(receiveCall({
        id: `call-${Date.now()}`,
        type,
        name,
        avatar
    }));
};

logger.timeEnd('AppMount');
