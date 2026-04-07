import React from 'react';

const ServicePage: React.FC = () => {
    return (
        <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
            <div className="bg-black brutalist-border border-white p-6 md:p-10 text-center max-w-lg w-full">
                <div className="text-5xl mb-4">🔔</div>

                <h1 className="text-2xl md:text-3xl font-black font-brutal uppercase tracking-tighter text-white mb-4 leading-tight">
                    Обробка платежу
                </h1>

                <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                    Ця сторінка використовується для обробки платіжних сповіщень.
                </p>

                <a
                    href="/"
                    className="inline-block w-full bg-white text-black text-sm md:text-base font-black py-3 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal"
                >
                    На головну
                </a>
            </div>
        </main>
    );
};

export default ServicePage;

