import React from 'react';

const LoadingBar = () => {
    return (
        <div
            className="w-full max-w-[180px] mx-auto mb-4 brutalist-border border-white bg-black h-6 md:h-8 relative overflow-hidden brutalist-shadow mr-2">
            <div className="h-full bg-purple-600 animate-loading-progress origin-left"></div>
            <div className="absolute inset-0 flex items-center justify-center">
      <span
          className="text-white font-black font-brutal text-[8px] md:text-[10px] uppercase tracking-[0.2em] mix-blend-difference">
        LOADING...
      </span>
            </div>
        </div>
    );
};

export default LoadingBar;