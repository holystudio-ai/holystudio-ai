import React from 'react';
import LoadingBar from "@/src/components/sections/LoadingBar.tsx";

const title = "DON'T SCROLL THE FUTURE - CREATE IT"

const SkillsSection = () => {
    return (
        <section className="py-20 px-4 bg-zinc-900 border-y-2 border-white overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">

                <div className="mb-12 flex flex-col items-center">
                    <h1
                        className="text-4xl md:text-7xl font-black font-brutal leading-[0.95] mb-8 tracking-tighter glitch select-none"
                        data-text={title}
                    >
                        {title.split('CREATE IT').map((part, index) => (
                            <React.Fragment key={index}>
                                {part}
                                {index === 0 && <span className="text-purple-500">CREATE IT</span>}
                            </React.Fragment>
                        ))}
                    </h1>
                </div>

                <div className="max-w-2xl mx-auto">
                    <LoadingBar/>

                    <div className="brutalist-border p-6 md:p-10 text-left bg-black brutalist-shadow mt-10 relative">
                        <p className="text-[18px] md:text-[22px] mb-6 font-black uppercase leading-tight font-brutal">
                            Опануй навички AI-креатора, який вміє створювати кінематографічний контент і продавати його
                            за реальні гроші:
                        </p>

                        <ul className="space-y-4 text-[14px] md:text-[16px] font-bold">
                            <li className="flex items-start gap-4">
                                <span
                                    className="bg-purple-600 text-white px-2 py-1 font-black font-brutal text-[12px] shrink-0">01</span>
                                <span>Відеоролик: <span
                                    className="text-zinc-400">зроблений в рамках програми курсу.</span></span>
                            </li>

                            <li className="flex items-start gap-4">
                                <span
                                    className="bg-purple-600 text-white px-2 py-1 font-black font-brutal text-[12px] shrink-0">02</span>
                                <span>Фотореалістична генерація: <span className="text-zinc-400">Робота з топовими моделями для створення локацій, персонажів та деталей з контролем пози, одягу та освітлення.</span></span>
                            </li>

                            <li className="flex items-start gap-4">
                                <span
                                    className="bg-purple-600 text-white px-2 py-1 font-black font-brutal text-[12px] shrink-0">03</span>
                                <span>AI-анімація: <span className="text-zinc-400">Перетворення статичних кадрів у динамічне відео за допомогою.</span></span>
                            </li>

                            <li className="flex items-start gap-4">
                                <span
                                    className="bg-purple-600 text-white px-2 py-1 font-black font-brutal text-[12px] shrink-0">04</span>
                                <span>Технічний апскейл: <span className="text-zinc-400">Знання того, як покращувати якість та деталізацію згенерованого контенту до професійних стандартів.</span></span>
                            </li>

                            <li className="flex items-start gap-4">
                                <span
                                    className="bg-purple-600 text-white px-2 py-1 font-black font-brutal text-[12px] shrink-0">05</span>
                                <span>Self-branding: <span className="text-zinc-400">Навички пакування профілю в соцмережах та оформлення AI-портфоліо, яке продає.</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SkillsSection;