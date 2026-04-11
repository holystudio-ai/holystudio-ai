import { useEffect } from "react";

const PromtsIntensiveHtmlPage: React.FC = () => {
    useEffect(() => {
        // Redirect to the static HTML page (bypasses SPA)
        window.location.replace("/promts_intensive.html");
    }, []);

    return null;
};

export default PromtsIntensiveHtmlPage;