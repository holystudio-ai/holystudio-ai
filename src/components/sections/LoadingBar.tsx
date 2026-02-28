import React from 'react';

const LoadingBar = () => {
    return (
        <div className="w-full mb-8 brutalist-border border-white bg-black h-6 md:h-8 relative overflow-hidden brutalist-shadow">

            <div className="h-full bg-purple-600 animate-loading-progress origin-left w-full"></div>

            <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-black font-brutal text-[10px] md:text-[12px] uppercase tracking-[0.2em] mix-blend-difference">
          LOADING...
        </span>
            </div>

        </div>
    );
};

export default LoadingBar;