import React from 'react';

interface PricingProps {
    title?: string;
    text?: string;
    badge?: boolean;
    id?: string;
    isEmbedded?: boolean;
}

const Pricing: React.FC<PricingProps> = ({id = "pricing", isEmbedded = false, title, text, badge=false}) => {
    const content = (
        <div
            className="bg-red-600 brutalist-border border-white p-4 md:p-6 text-center relative overflow-hidden max-w-md mx-auto">

            {badge && (
                <div
                    className="absolute top-0 right-0 bg-white text-red-600 px-2 py-0.5 font-black uppercase text-[8px] font-brutal z-10">
                    Limited Offer
                </div>
            )}


            <h2 className="text-lg md:text-xl font-black mb-4 mt-4 font-brutal leading-none uppercase text-white tracking-tighter">
                {title}
            </h2>

            <div className="flex justify-center items-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                    <span
                        className="text-base md:text-xl line-through text-white/70 font-black font-brutal tracking-tighter">4000</span>
                    <span className="text-[8px] md:text-[10px] text-white/70 font-black font-brutal">ГРН</span>
                </div>
                <div className="flex flex-col items-center">
                    <span
                        className="text-3xl md:text-5xl font-black text-white font-brutal tracking-tighter leading-none">770</span>
                    <span className="text-sm md:text-lg text-white font-black font-brutal leading-none">ГРН</span>
                </div>
            </div>

            <p className="text-xs md:text-sm font-black mb-6 text-white uppercase leading-tight max-w-xs mx-auto font-brutal">
                {text || "ЦІНА ДІЄ ТІЛЬКИ СЬОГОДНІ"}
            </p>

            <button
                onClick={() => window.open('https://t.me/your_bot_link', '_blank')}
                className="w-full bg-white text-black text-sm md:text-base font-black py-2.5 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal"
            >
                ОТРИМАТИ ДОСТУП
            </button>
        </div>
    );

    if (isEmbedded) return <div id={id} className="px-1">{content}</div>;

    return (
        <section id={id} className="pt-4 pb-12 px-6">
            <div className="max-w-md mx-auto">
                {content}
            </div>
        </section>
    );
};

export default Pricing;