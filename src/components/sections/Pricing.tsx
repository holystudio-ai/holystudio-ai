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
            className="bg-[#0b0b10] border border-white/10 rounded-3xl max-[480px]:rounded-[20px] p-5 max-[480px]:p-4 md:p-8 text-center relative overflow-hidden w-full max-[480px]:w-[82vw] max-[480px]:max-w-[360px] md:max-w-md mx-auto shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
            {badge && (
                <div
                    className="absolute top-4 left-4 max-[480px]:top-3 max-[480px]:left-3 flex items-center gap-1.5 bg-red-950/80 border border-red-500/30 rounded-full px-3 py-1.5 max-[480px]:px-2.5 max-[480px]:py-1 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]"></span>
                    <span className="text-[10px] md:text-[11px] font-bold uppercase text-red-400 tracking-widest leading-none">
                        Limited Offer
                    </span>
                </div>
            )}

            <h2 className="text-lg md:text-xl font-black mb-6 max-[480px]:mb-4 mt-8 max-[480px]:mt-6 font-brutal leading-none uppercase text-white tracking-tighter">
                {title}
            </h2>

            <div className="flex justify-center items-center gap-6 max-[480px]:gap-4 md:gap-8 mb-6 max-[480px]:mb-4">
                <div className="flex flex-col items-center">
                    <span
                        className="text-3xl max-[480px]:text-2xl md:text-5xl line-through decoration-red-500 decoration-[3px] max-[480px]:decoration-2 text-white/30 font-black font-brutal tracking-tighter">
                        4000
                    </span>
                    <span className="text-xs md:text-sm text-white/30 font-bold font-brutal mt-0.5">
                        ГРН
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span
                        className="text-5xl max-[480px]:text-4xl md:text-7xl font-black text-white font-brutal tracking-tighter leading-none">
                        {DISPLAY_PRICE}
                    </span>
                    <span className="text-sm max-[480px]:text-xs md:text-base text-white/70 font-bold font-brutal leading-none mt-1">
                        ГРН
                    </span>
                </div>
            </div>

            {showTimer && (
                <div className="mb-4 max-[480px]:mb-3 md:mb-5">
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                        <div className="bg-[#14141c] border border-white/[0.06] rounded-lg md:rounded-xl px-2 py-2 max-[480px]:py-1.5 md:px-4 md:py-4 text-center shadow-inner">
                            <div
                                className="text-2xl max-[480px]:text-xl md:text-4xl font-black leading-none text-white font-brutal">{timeLeft.hours}</div>
                            <div className="mt-1 md:mt-1.5 text-[9px] md:text-[11px] font-semibold text-white/40 font-brutal">год</div>
                        </div>

                        <div className="bg-[#14141c] border border-white/[0.06] rounded-lg md:rounded-xl px-2 py-2 max-[480px]:py-1.5 md:px-4 md:py-4 text-center shadow-inner">
                            <div
                                className="text-2xl max-[480px]:text-xl md:text-4xl font-black leading-none text-white font-brutal">{timeLeft.minutes}</div>
                            <div className="mt-1 md:mt-1.5 text-[9px] md:text-[11px] font-semibold text-white/40 font-brutal">хв</div>
                        </div>

                        <div className="bg-[#14141c] border border-white/[0.06] rounded-lg md:rounded-xl px-2 py-2 max-[480px]:py-1.5 md:px-4 md:py-4 text-center shadow-inner">
                            <div
                                className="text-2xl max-[480px]:text-xl md:text-4xl font-black leading-none text-white font-brutal">{timeLeft.seconds}</div>
                            <div className="mt-1 md:mt-1.5 text-[9px] md:text-[11px] font-semibold text-white/40 font-brutal">сек</div>
                        </div>
                    </div>
                </div>
            )}

            {showBonus && (
                <div
                    className="bg-[#14141c] text-white px-3.5 max-[480px]:px-3 py-3 max-[480px]:py-2 mb-5 max-[480px]:mb-3 flex items-center gap-3 max-[480px]:gap-2.5 mx-auto w-full max-w-[440px] border border-white/[0.06] rounded-xl font-sans">
                    <div
                        className="bg-red-950/60 text-red-500 w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center rounded-lg border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]">
                        <span
                            className="relative -top-[1px] text-[28px] md:text-[32px] font-light leading-none">+</span>
                    </div>

                    <p className="text-[12px] md:text-[13px] normal-case font-semibold text-left leading-[1.05] tracking-tight text-white/90">
                        20 шаблонів промптів для створення ультра-реалістичного контенту
                    </p>
                </div>
            )}

            {text && (
                <p className="text-xs md:text-sm font-bold mb-6 max-[480px]:mb-4 text-white/70 uppercase leading-tight max-w-xs mx-auto font-brutal">
                    {text}
                </p>
            )}

            <button
                type="button"
                onClick={redirectToPayment}
                className="w-full bg-red-600 hover:bg-red-500 text-white text-sm md:text-base font-black py-3.5 max-[480px]:py-3 uppercase rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all font-brutal"
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