import React from 'react';
import Pricing from "@/src/components/sections/Pricing.tsx";
import heroImage from "../../assets/images/hero-image.jpg";

const blocks = [
    {
        type: "hero",
        title:
            "ОТРИМАЙ НАВИЧКИ ЗІ СТВОРЕННЯ ФОТО І ВІДЕО ТОПОВОЇ ЯКОСТІ, НАВІТЬ ЯКЩО ТИ ПОВНИЙ НУЛЬ ПО НАШІЙ УНІКАЛЬНИЙ ПРОМПТ-СТРУКТУРІ.",
    },
    {
        type: "result",
        title: "РЕЗУЛЬТАТ ГАРАНТОВАНИЙ",
        details:
            "Ми покажемо як отримувати якість з перших генерацій, не витрачаючи купу місяців на вивчення технічки... або повернемо кошти!",
    },
    {
        title: "САМ СОБІ РЕЖИСЕР",
        details: "AI вже стало реальністю: нейромережі замінюють цілі знімальні групи, дозволяючи одній людині, створювати кінематографічні ролики без космічних бюджетів і великих команд",
    },
    {
        title: "НЕ ПРОСПИ...",
        details: "можливість опанувати генеративний AI зараз, щоб перетворити свої ідеї на професійний контент і зірвати куш $$$ нової цифрової ери, поки інші зволікають.",
    },
];

const Hero: React.FC = () => {
    const mainTitle = "НАВЧИСЬ СТВОРЮВАТИ АІ КРЕАТИВИ КІНОШНОЇ ЯКОСТІ З НУЛЯ ЗА 5 ДНІВ.";

    return (
        <section className="pt-32 pb-5 px-4 overflow-x-hidden overflow-y-visible">
            <div className="max-w-7xl mx-auto">
                <div className="flex w-full">
                    <div className="ml-auto inline-block bg-white text-black px-4 py-1 font-black text-sm md:text-lg uppercase mb-6 brutalist-border border-black font-brutal">
                        ІНТЕНСИВ ВІД РЕКЛАМНОГО ВІДЕОПРОДАКШЕНУ
                    </div>
                </div>

                <div className="relative min-h-[78svh] md:min-h-[100dvh] flex flex-col justify-end px-3 pb-12 pt-6 md:p-8 w-full border-black brutalist-border overflow-hidden bg-black">
                    <img
                        src={heroImage}
                        alt=""
                        aria-hidden="true"
                        fetchPriority="high"
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[1]" />
                    <div className="absolute inset-0 bg-black/10 z-[1]" />

                    <div className="relative z-10 group max-w-full overflow-hidden mt-2 md:mt-0">
                        <h1
                            className="
                text-[clamp(35px,8vw,52px)] sm:text-5xl md:text-7xl lg:text-[100px]
                font-black font-brutal leading-[0.92] md:leading-[0.95]
                mb-4 md:mb-8 tracking-tighter select-none text-white
                glitch
                max-w-full overflow-hidden
                break-words
            "
                            data-text={mainTitle}
                        >
                            {mainTitle.split("АІ КРЕАТИВИ").map((part, index) => (
                                <React.Fragment key={index}>
                                    {part}
                                    {index === 0 && <span className="text-purple-500">АІ КРЕАТИВИ</span>}
                                </React.Fragment>
                            ))}
                        </h1>
                    </div>
                </div>

                <div className="flex-box gap-10 items-start mt-12 font-brutal">
                    <div className="flex-box gap-10 items-start mt-12 font-brutal">
                        <div className="flex flex-col gap-6 mt-12">
                            {blocks.map((block, i) => {
                                if (block.type === "hero") {
                                    return (
                                        <div
                                            key={i}
                                            className="border-2 border-dashed border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white"
                                        >
                                            <h3 className="text-[18px] sm:text-[22px] md:text-[34px] font-black uppercase leading-[1.05] tracking-tight text-center">
                                                {block.title}
                                            </h3>
                                        </div>
                                    );
                                }

                                if (block.type === "result") {
                                    return (
                                        <div
                                            key={i}
                                            className="border-2 border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white"
                                        >
                                            <h4 className="mb-2 text-[20px] sm:text-[24px] md:text-[34px] font-black uppercase leading-none">
                                                {block.title}
                                            </h4>

                                            <p className="text-[14px] sm:text-[16px] md:text-[22px] font-bold leading-tight uppercase">
                                                {block.details}
                                            </p>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={i}
                                        className="border-2 border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white"
                                    >
                                        <h4 className="text-[16px] sm:text-[18px] md:text-[28px] font-black uppercase leading-none mb-1">
                                            {block.title}
                                        </h4>

                                        <p className="text-[13px] sm:text-[14px] md:text-[22px] font-bold leading-tight opacity-90">
                                            {block.details}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Pricing badge showBonus text={"ЦІНА ДІЄ ТІЛЬКИ СЬОГОДНІ"} />
                </div>
            </div>
        </section>
    );
};

export default Hero;