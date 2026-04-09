import React, {useLayoutEffect} from 'react';
import {useLocation} from 'react-router-dom';

const STATIC_PROMPTS_PAGE_PATH = '/promts_intensive.html';

const PromptsIntensiveRedirect = () => {
    const location = useLocation();

    useLayoutEffect(() => {
        const targetUrl = new URL(STATIC_PROMPTS_PAGE_PATH, window.location.origin);
        targetUrl.search = location.search;
        targetUrl.hash = location.hash;

        window.location.replace(targetUrl.toString());
    }, [location.hash, location.search]);

    return null;
};

export default PromptsIntensiveRedirect;
