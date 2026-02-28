import React from 'react';

const Audience: React.FC = () => {
    const items = [
        {
            title: "Новачок в AI",
            desc: (
                <>
                    Навчимо тебе використовувати нейронки і досягти перших результатів, які будуть на голову краще ніж у
                    багатьох інших. Почни з нуля і <span className="font-bold text-white">зроби свою першу AI-роботу вже на інтенсиві.</span>
                </>
            ),
            img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&h=400&auto=format&fit=crop"
        },
        {
            title: "Маркетологи, та інші креативні професії",
            desc: (
                <>
                    AI - це твій новий асистент. Створюй деталізовані мудборди, точні референси та креативні концепції
                    за лічені хвилини. <span className="font-bold text-white">Візуалізуй ідеї без компромісів</span> - саме так, як
                    вони виглядають у твоїй голові.
                </>
            ),
            img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&h=400&auto=format&fit=crop"
        },
        {
            title: "Фрілансери",
            desc: (
                <>
                    <span className="font-bold text-white">Час апгрейднути свій чек</span>. Додавай AI-скіли у портфоліо, закривай
                    проєкти в х 3 швидше та пропонуй
                    клієнтам візуал, від якого відвисає щелепа.
                </>
            ),
            img: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=400&h=400&auto=format&fit=crop"
        },
        {
            title: "Фотографи, Оператори",
            desc: (
                <>
                    Перевіряй ідеї ще до першого кліку затвора. Тестуй світлові схеми та генеруй розкадровки. Створюй
                    <span className="font-bold text-white"> ідеальний пре-продакшн на будь-якій локації</span>, щоб втілити задум
                    без жодних сюрпризів на зйомці.
                </>
            ),
            img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=400&h=400&auto=format&fit=crop"
        }
    ];

    return (
        <section id="audience" className="py-8 md:py-16 px-6 bg-black">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black font-brutal mb-6 md:mb-10 tracking-tighter leading-none text-white text-center md:text-left">
                    КОМУ ПІДХОДИТЬ <span className="text-purple-500">КУРС</span>
                </h2>

                {/* Змінено: grid-cols-1 для мобілок, md:grid-cols-2 для десктопа */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 items-stretch">
                    {items.map((item, idx) => (
                        <div key={idx}
                             className="brutalist-border bg-zinc-900 border-purple-500 flex flex-col overflow-hidden group h-full">

                            <div className="w-full aspect-video overflow-hidden border-b-2 border-purple-500 relative">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                            </div>

                            <div className="p-5 md:p-6 flex-1 flex flex-col bg-zinc-900">
                                {/* Збільшено розмір тексту для читабельності на мобільних */}
                                <h3 className="text-xl md:text-lg font-black mb-3 uppercase font-brutal text-white leading-tight">
                                    {item.title}
                                </h3>

                                <div className="text-base md:text-sm text-zinc-400 leading-tight md:leading-snug">
                                    {item.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Audience;