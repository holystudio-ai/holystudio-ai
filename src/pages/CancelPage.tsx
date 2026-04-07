import React from 'react';

const CancelPage: React.FC = () => {
    return (
        <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
            <div className="bg-black brutalist-border border-white p-6 md:p-10 text-center max-w-lg w-full">
                <div className="text-5xl mb-4">😔</div>

                <h1 className="text-2xl md:text-3xl font-black font-brutal uppercase tracking-tighter text-white mb-4 leading-tight">
                    Оплату скасовано
                </h1>

                <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                    Щось пішло не так або ти передумав. Не хвилюйся — ти завжди можеш повернутись та оплатити пізніше.
                </p>

                <a
                    href="/"
                    className="inline-block w-full bg-white text-black text-sm md:text-base font-black py-3 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal"
                >
                    Повернутись на головну
                </a>

                <p className="text-xs text-white/50 mt-6">
                    Якщо виникли питання — напиши нам в Instagram{' '}
                    <a
                        href="https://www.instagram.com/holystudio.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white/80 transition-colors"
                    >
                        @holystudio.ai
                    </a>
                </p>
            </div>
        </main>
    );
};

export default CancelPage;
