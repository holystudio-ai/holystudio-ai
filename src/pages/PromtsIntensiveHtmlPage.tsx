import React from "react";

const PromtsIntensiveHtmlPage: React.FC = () => {
    return (
        <div style={{ width: "100%", height: "100vh", background: "#000" }}>
            <iframe
                src="/promts_intensive.html"
                title="Promts Intensive"
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    display: "block",
                    background: "#000",
                }}
            />
        </div>
    );
};

export default PromtsIntensiveHtmlPage;