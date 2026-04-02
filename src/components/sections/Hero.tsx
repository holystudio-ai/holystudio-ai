import React from 'react';
import Pricing from "@/src/components/sections/Pricing.tsx";
import heroImage from "../../assets/images/hero-image.webp";
import offers from "../../assets/images/offers.webp";

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
        <section className="overflow-x-hidden px-4 pb-8 pt-20 md:pb-10 md:pt-24">
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden border-4 border-black bg-black">
                    <img
                        src={heroImage}
                        alt="AI creative course hero"
                        fetchPriority="high"
                        loading="eager"
                        decoding="async"
                        className="block h-auto max-h-[72svh] w-full object-cover object-center md:max-h-[90svh]"
                    />
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