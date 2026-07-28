import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';

// After a deploy, lazy chunks from the previous build 404 for users who still
// have the old page open — reload once to pick up the new asset hashes.
window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    if (!sessionStorage.getItem('chunk-reload')) {
        sessionStorage.setItem('chunk-reload', '1');
        window.location.reload();
    }
});
// Re-arm after a while so a later deploy in the same tab can also trigger one
// reload, without allowing an instant reload loop when a chunk is truly gone.
window.setTimeout(() => sessionStorage.removeItem('chunk-reload'), 30_000);

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);
