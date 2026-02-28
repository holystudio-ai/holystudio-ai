import React from 'react';

const Guarantee: React.FC = () => {
    return (
        <section className="py-12 px-4 bg-zinc-900 text-white border-y-4 border-purple-600">
            <div className="max-w-4xl mx-auto ">

                <div className="flex flex-col md:flex-row gap-6 items-center mb-8 justify-between">
                    <div
                        className="text-6xl md:text-9xl font-black font-brutal leading-none text-purple-500 opacity-80">
                        100%
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black font-brutal leading-tight mb-2 uppercase">
                            ГАРАНТІЯ ПОВЕРНЕННЯ
                        </h2>
                    </div>
                </div>

                <div className="brutalist-border border-purple-500 p-6 md:p-8 bg-black brutalist-shadow overflow-hidden relative">

                    <h3 className="text-lg md:text-2xl font-black uppercase font-brutal mb-4">
                        НЕ ВПЕВНЕНИЙ? «А якщо в мене не вийде? Я просто викину гроші?»
                    </h3>

                    <p className="text-sm md:text-base font-bold leading-relaxed opacity-90">
                        Ми настільки впевнені у своїй системі, що даємо <span className="text-purple-500">100% гарантію повернення коштів</span>.
                        Якщо ти пройдеш уроки, використаєш наші інструкції, але не зможеш створити відео за нашим
                        прикладом —
                        ми повернемо повну вартість.
                    </p>

                    <p className="mt-4 text-sm md:text-base font-bold leading-relaxed opacity-90">
                        Ти нічим не ризикуєш. Ризикують лише ті, хто «проґавить» цю хвилю.
                    </p>

                    <p className="mt-6 text-xs md:text-sm opacity-60 uppercase font-black font-brutal">
                        Детальні умови повернення прописані в розділі FAQ
                    </p>

                </div>
            </div>
        </section>
    );
};

export default Guarantee;