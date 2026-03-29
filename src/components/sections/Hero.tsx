import React from 'react';
import Pricing from "@/src/components/sections/Pricing.tsx";
import heroImage from "../../assets/images/hero-image.webp";
import offers from "../../assets/images/offers.png";

const blocks = [
    {
        type: "hero",
        titleStart:
            "В НОВІЙ РЕАЛЬНОСТІ НЕЙРОМЕРЕЖІ ДАЮТЬ ОДНІЙ ЛЮДИНІ МОЖЛИВІСТЬ СТВОРЮВАТИ КОНТЕНТ, З ЯКИМ ",
        titleLight: "ЗАРОБЛЯЮТЬ ВІД 2000$",
        titleEnd: "",
    },
    {
        type: "offer",
        title: "НЕ ПРОСПИ...",
        details: "МОЖЛИВІСТЬ ОПАНУВАТИ ГЕНЕРАТИВНИЙ AI ЗАРАЗ, ЩОБ ПЕРЕТВОРИТИ СВОЇ ІДЕЇ НА ПРОФЕСІЙНИЙ КОНТЕНТ І ЗІРВАТИ КУШ $$$ НОВОЇ ЦИФРОВОЇ ЕРИ, ПОКИ ІНШІ ЗВОЛІКАЮТЬ",
    },
];

const Hero: React.FC = () => {
    const mainTitle = "НАВЧИСЬ СТВОРЮВАТИ АІ КРЕАТИВИ КІНОШНОЇ ЯКОСТІ З НУЛЯ ЗА 5 ДНІВ.";

    const heroBlock = blocks.find((block) => block.type === "hero");
    const offerBlock = blocks.find((block) => block.type === "offer");

    return (
        <section className="pt-20 pb-5 px-4 overflow-x-hidden overflow-y-visible">
            <div className="max-w-7xl mx-auto">
                <div className="relative min-h-[56svh] md:min-h-[100dvh] flex flex-col justify-end px-3 pt-5 md:p-8 w-full border-black brutalist-border overflow-hidden bg-black">
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
                                tracking-tighter select-none text-white
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

                <Pricing badge showBonus showTimer text={"ЦІНА ДІЄ ТІЛЬКИ СЬОГОДНІ"} />

                <div className="flex-box gap-10 items-start mt-12 font-brutal">
                    <div className="flex flex-col gap-6 mt-12 w-full">
                        {heroBlock && (
                            <div className="border-2 border-dashed border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white">
                                <h3 className="text-[18px] sm:text-[22px] md:text-[34px] uppercase leading-[1.05] tracking-tight text-center font-black">
                                    {heroBlock.titleStart}
                                    <span className="font-normal">
                                        {heroBlock.titleLight}
                                    </span>
                                    {heroBlock?.titleEnd}
                                </h3>
                            </div>
                        )}

                        <div className="w-[110%] -ml-[5%] md:w-full md:ml-0 lg:w-[85%] lg:mx-auto">
                            <img
                                src={offers}
                                alt="Special offers"
                                loading="lazy"
                                decoding="async"
                                className="block w-full h-auto object-contain"
                            />
                        </div>

                        {offerBlock && (
                            <div className="border-2 border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white">
                                <h4 className="text-[16px] sm:text-[18px] md:text-[28px] font-black uppercase leading-none mb-1">
                                    {offerBlock.title}
                                </h4>

                                <p className="text-[13px] sm:text-[14px] md:text-[22px] leading-tight opacity-90">
                                    {offerBlock.details}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;