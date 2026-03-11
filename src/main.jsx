import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@app/App';
import './index.css';
import logger from '@core/utils/logger';
import { LanguageProvider } from '@app/providers/LanguageContext';

// App startup timing
logger.time('AppMount');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>
);

logger.timeEnd('AppMount');
