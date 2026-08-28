import {useEffect} from 'react';

/**
 * The guide is a standalone HTML file (images inlined). React only exists to
 * give it a short URL; the file itself lives in public/ so Cloudflare serves
 * it as a static page, not through the SPA.
 */
const DirectorGuideHtmlPage: React.FC = () => {
    useEffect(() => {
        window.location.replace('/holystudio-ai-director-guide.html');
    }, []);

    return null;
};

export default DirectorGuideHtmlPage;
