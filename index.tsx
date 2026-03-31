import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, useLocation} from 'react-router-dom';
import App from './App';
import {trackPageView} from '@/src/lib/analytics.ts';

function AnalyticsPageTracker() {
    const location = useLocation();

    useEffect(() => {
        trackPageView();
    }, [location.pathname, location.search]);

    return null;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AnalyticsPageTracker/>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);
