import React, {useEffect, useState} from 'react';
import {formatPriceUah, coursePriceUah} from '@/src/lib/pricing.ts';
import {redirectToPayment} from '@/src/lib/payment.ts';

const DISPLAY_PRICE = formatPriceUah(coursePriceUah);

const getNextResetTime = (now: Date) => {
    const resetTime = new Date(now);
    resetTime.setHours(2, 0, 0, 0);

    if (now >= resetTime) {
        resetTime.setDate(resetTime.getDate() + 1);
    }

    return resetTime;
};

const getTimeLeft = () => {
    const now = new Date();
    const diff = getNextResetTime(now).getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));

    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return {hours, minutes, seconds};
};

interface PricingProps {
    title?: string;
    text?: string;
    badge?: boolean;
    id?: string;
    isEmbedded?: boolean;
    showBonus?: boolean;
    showTimer?: boolean;
}

const Pricing: React.FC<PricingProps> = ({
                                             isEmbedded = false,
                                             title,
                                             text,
                                             badge = false,
                                             showBonus = false,
                                             showTimer = false
                                         }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        if (!showTimer) {
            return;
        }

        setTimeLeft(getTimeLeft());

        const intervalId = window.setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [showTimer]);

    const content = (
        <div
            className="bg-red-600 brutalist-border border-white p-4 md:p-6 text-center relative overflow-hidden w-full md:max-w-md mx-auto">
            {badge && (
                <div
                    className="absolute top-0 right-0 bg-white text-red-600 px-3 py-1 font-black uppercase text-[10px] md:text-[11px] leading-none font-brutal z-10 tracking-tight">
                    Limited Offer
                </div>
            )}

            <h2 className="text-lg md:text-xl font-black mb-4 mt-4 font-brutal leading-none uppercase text-white tracking-tighter">
                {title}
            </h2>

            <div className="flex justify-center items-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                    <span
                        className="text-3xl md:text-5xl line-through decoration-black decoration-[2px] text-white/70 font-black font-brutal tracking-tighter">
                        4000
                    </span>
                    <span className="text-sm md:text-lg text-white/70 font-black font-brutal">
                        ГРН
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span
                        className="text-3xl md:text-5xl font-black text-white font-brutal tracking-tighter leading-none">
                        {DISPLAY_PRICE}
                    </span>
                    <span className="text-sm md:text-lg text-white font-black font-brutal leading-none">
                        ГРН
                    </span>
                </div>
            </div>

            {showTimer && (
                <div className="mb-5 border-2 border-white bg-black px-3 py-3 text-white">
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                        <div className="min-w-[72px] border-2 border-white bg-white px-2 py-2 text-center text-black">
                            <div
                                className="text-2xl md:text-3xl font-black leading-none font-brutal">{timeLeft.hours}</div>
                            <div className="mt-1 text-[10px] font-black uppercase font-brutal">год</div>
                        </div>

                        <div className="min-w-[72px] border-2 border-white bg-white px-2 py-2 text-center text-black">
                            <div
                                className="text-2xl md:text-3xl font-black leading-none font-brutal">{timeLeft.minutes}</div>
                            <div className="mt-1 text-[10px] font-black uppercase font-brutal">хв</div>
                        </div>

                        <div className="min-w-[72px] border-2 border-white bg-white px-2 py-2 text-center text-black">
                            <div
                                className="text-2xl md:text-3xl font-black leading-none font-brutal">{timeLeft.seconds}</div>
                            <div className="mt-1 text-[10px] font-black uppercase font-brutal">сек</div>
                        </div>
                    </div>
                </div>
            )}

            {showBonus && (
                <div
                    className="bg-black text-white px-3 py-2.5 mb-5 flex items-center gap-3 mx-auto w-full max-w-[440px] border-2 border-white font-sans">
                    <div
                        className="bg-white text-black w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center border-2 border-black">
                        <span
                            className="relative -top-[1px] text-[32px] md:text-[36px] font-light leading-none">+</span>
                    </div>

                    <p className="text-[12px] md:text-[13px] normal-case font-semibold text-left leading-[1.05] tracking-tight">
                        20 шаблонів промптів для створення ультра-реалістичного контенту
                    </p>
                </div>
            )}

            <p className="text-xs md:text-sm font-black mb-6 text-white uppercase leading-tight max-w-xs mx-auto font-brutal">
                {text}
            </p>

            <button
                type="button"
                onClick={redirectToPayment}
                className="w-full bg-white text-black text-sm md:text-base font-black py-2.5 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal"
            >
                ОТРИМАТИ ДОСТУП
            </button>
        </div>
    );

    if (isEmbedded) return <div className="px-1">{content}</div>;

    return (
        <section className="pt-4 pb-4">
            <div className="w-full md:max-w-md mx-auto">
                {content}
            </div>
        </section>
    );
};

export default Pricing;