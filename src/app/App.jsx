// src/app/App.jsx
// Session 7: Redux Provider added — activates RTK for all components.
import { Provider } from 'react-redux';
import { reduxStore } from '@core/store/store';
import { ThemeProvider } from '@app/providers/ThemeContext';
import MainLayout from '@app/layouts/MainLayout';

function App() {
    return (
        <Provider store={reduxStore}>
            <ThemeProvider>
                <MainLayout />
            </ThemeProvider>
        </Provider>
    );
}

export default App;
