import React, {useEffect, useRef, useState} from 'react';
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

const formatTimeLeft = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));

    const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(safeSeconds % 60).padStart(2, '0');

    return {hours, minutes, seconds};
};

const getDailyTimeLeft = () => {
    const now = new Date();
    const diff = getNextResetTime(now).getTime() - now.getTime();

    return formatTimeLeft(diff / 1000);
};

interface PricingProps {
    title?: string;
    text?: string;
    badge?: boolean;
    id?: string;
    isEmbedded?: boolean;
    showBonus?: boolean;
    showTimer?: boolean;
    /** 'daily' — resets each day at 02:00 (default). 'countdown' — N minutes, restarts on every reload/expiry. */
    timerMode?: 'daily' | 'countdown';
    /** Minutes for 'countdown' mode. */
    countdownMinutes?: number;
    /** Discounted price to display. Defaults to the shared course price (env). */
    price?: number;
    /** Full/old (struck-through) price label. */
    oldPrice?: string;
    /** CTA button label. */
    ctaText?: string;
    /** CTA target link (Telegram bot deep link). */
    ctaHref?: string;
    /** Render the countdown in the brutalist "program block" style. */
    timerBlocks?: boolean;
    /** When set, the CTA smooth-scrolls to this element id instead of opening `ctaHref`. */
    ctaScrollToId?: string;
    /** On mobile: stretch the card to full width (like the hero) and trim its height. */
    wideMobile?: boolean;
}

const Pricing: React.FC<PricingProps> = ({
                                             isEmbedded = false,
                                             title,
                                             text,
                                             badge = false,
                                             showBonus = false,
                                             showTimer = false,
                                             timerMode = 'daily',
                                             countdownMinutes = 10,
                                             price,
                                             oldPrice = '4000',
                                             ctaText = 'ОТРИМАТИ ДОСТУП',
                                             ctaHref = 'https://telegram.me/HOLYSTUDIO_AI_bot?start=ZGw6MzI3OTcz',
                                             timerBlocks = false,
                                             ctaScrollToId,
                                             wideMobile = false
                                         }) => {
    const displayPrice = price !== undefined ? formatPriceUah(price) : DISPLAY_PRICE;

    // When ctaScrollToId is set, the CTA scrolls to that block (the on-page
    // offer) instead of deep-linking out — used by the /split hero timer.
    const handleCtaClick = ctaScrollToId
        ? (e: React.MouseEvent) => {
              e.preventDefault();
              document.getElementById(ctaScrollToId)?.scrollIntoView({behavior: 'smooth', block: 'start'});
          }
        : undefined;

    // Countdown deadline lives only in memory (a ref), so it starts fresh on
    // every page load and loops back to `countdownMinutes` when it hits 0.
    const deadlineRef = useRef<number | null>(null);

    const getTimeLeft = React.useCallback(() => {
        if (timerMode === 'countdown') {
            const durationMs = countdownMinutes * 60 * 1000;

            if (deadlineRef.current === null || deadlineRef.current <= Date.now()) {
                deadlineRef.current = Date.now() + durationMs;
            }

            return formatTimeLeft((deadlineRef.current - Date.now()) / 1000);
        }

        return getDailyTimeLeft();
    }, [timerMode, countdownMinutes]);

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
    }, [showTimer, getTimeLeft]);

    const timerItems = [
        {value: timeLeft.hours, label: 'год'},
        {value: timeLeft.minutes, label: 'хв'},
        {value: timeLeft.seconds, label: 'сек'}
    ];

    const content = (
        <div
            className={`bg-[#0b0b10] border border-white/10 rounded-lg p-5 md:p-7 text-center relative overflow-hidden w-full md:max-w-md mx-auto shadow-[0_4px_40px_rgba(0,0,0,0.6)] ${
                wideMobile ? 'max-[480px]:p-3' : 'max-[480px]:p-4 max-[480px]:w-[82vw] max-[480px]:max-w-[360px]'
            }`}>
            {badge && (
                <div
                    className="absolute top-4 left-4 max-[480px]:top-3 max-[480px]:left-3 flex items-center gap-1.5 bg-red-950/80 border border-red-500/30 rounded-full px-3 py-1.5 max-[480px]:px-2.5 max-[480px]:py-1 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]"></span>
                    <span className="text-[10px] md:text-[11px] font-bold uppercase text-red-400 tracking-widest leading-none">
                        Limited Offer
                    </span>
                </div>
            )}

            {title && (
                <h2 className="text-lg md:text-xl font-black mb-5 max-[480px]:mb-4 mt-8 max-[480px]:mt-7 font-brutal leading-none uppercase text-white tracking-tighter">
                    {title}
                </h2>
            )}

            <div
                className={`flex justify-center items-center gap-5 max-[480px]:gap-4 md:gap-8 mb-5 ${wideMobile ? 'max-[480px]:mb-3' : 'max-[480px]:mb-4'} ${!title && badge ? `mt-8 ${wideMobile ? 'max-[480px]:mt-6' : 'max-[480px]:mt-7'}` : ''}`}>
                <div className={`flex flex-col items-center ${wideMobile ? 'max-[480px]:flex-row max-[480px]:items-baseline max-[480px]:gap-1.5' : ''}`}>
                    <span
                        className="whitespace-nowrap text-3xl max-[480px]:text-2xl md:text-5xl line-through decoration-red-500 decoration-[3px] max-[480px]:decoration-2 text-white/30 font-black font-brutal tracking-tighter">
                        {oldPrice}
                    </span>
                    <span className={`text-xs md:text-sm text-white/30 font-bold font-brutal mt-0.5 ${wideMobile ? 'max-[480px]:mt-0' : ''}`}>
                        ГРН
                    </span>
                </div>

                <div className={`flex flex-col items-center ${wideMobile ? 'max-[480px]:flex-row max-[480px]:items-baseline max-[480px]:gap-1.5' : ''}`}>
                    <span
                        className="whitespace-nowrap text-5xl max-[480px]:text-4xl md:text-7xl font-black text-white font-brutal tracking-tighter leading-none">
                        {displayPrice}
                    </span>
                    <span className={`text-sm max-[480px]:text-xs md:text-base text-white/70 font-bold font-brutal leading-none mt-1 ${wideMobile ? 'max-[480px]:mt-0' : ''}`}>
                        ГРН
                    </span>
                </div>
            </div>

            {text && (
                <p className="text-xs md:text-sm font-bold mb-5 max-[480px]:mb-4 text-white/70 uppercase leading-tight max-w-xs mx-auto font-brutal">
                    {text}
                </p>
            )}

            <div className={`relative z-10 mb-5 ${wideMobile ? 'max-[480px]:mb-3' : 'max-[480px]:mb-4'}`}>
                <div
                    className="pointer-events-none absolute -inset-x-3 -bottom-3 h-9 rounded-full bg-red-600/30 blur-xl"></div>
                <a
                    href={ctaScrollToId ? `#${ctaScrollToId}` : ctaHref}
                    onClick={handleCtaClick}
                    {...(ctaScrollToId ? {} : {target: '_blank', rel: 'noopener noreferrer'})}
                    className={`button relative block w-full bg-red-600 hover:bg-red-500 text-white text-sm md:text-base font-black py-4 ${wideMobile ? 'max-[480px]:py-3' : 'max-[480px]:py-3.5'} uppercase rounded-xl shadow-[0_0_16px_rgba(239,68,68,0.68),0_0_40px_rgba(239,68,68,0.34),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_54px_rgba(239,68,68,0.42),inset_0_1px_0_rgba(255,255,255,0.22)] font-brutal`}
                >
                    {ctaText}
                </a>
            </div>

            {showTimer && (
                <div className={`mb-5 ${wideMobile ? 'max-[480px]:mb-3' : 'max-[480px]:mb-4'}`}>
                    <div className="grid grid-cols-3 gap-2.5 max-[480px]:gap-2.5 md:gap-4">
                        {timerItems.map((item) => (
                            timerBlocks ? (
                                <div
                                    key={item.label}
                                    className={`flex ${wideMobile ? 'max-[480px]:h-[58px]' : 'max-[480px]:h-[70px]'} h-[76px] md:h-[94px] flex-col items-center justify-center border-4 border-black bg-white px-2 text-center shadow-[5px_5px_0px_0px_#a855f7] max-[480px]:shadow-[4px_4px_0px_0px_#a855f7]`}
                                >
                                    <div className={`text-[34px] ${wideMobile ? 'max-[480px]:text-[26px]' : 'max-[480px]:text-[30px]'} md:text-[46px] font-black leading-none text-black font-brutal tracking-tight`}>
                                        {item.value}
                                    </div>
                                    <div className="mt-1 text-[9px] md:text-[11px] font-black text-purple-600 font-brutal uppercase leading-none tracking-widest">
                                        {item.label}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    key={item.label}
                                    className={`flex ${wideMobile ? 'max-[480px]:h-[58px]' : 'max-[480px]:h-[70px]'} h-[76px] md:h-[94px] flex-col items-center justify-center bg-[#17171f] border border-white/[0.07] rounded-lg px-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_22px_rgba(0,0,0,0.24)]`}
                                >
                                    <div
                                        className={`text-[34px] ${wideMobile ? 'max-[480px]:text-[26px]' : 'max-[480px]:text-[30px]'} md:text-[46px] font-black leading-none text-white font-brutal tracking-tight`}>
                                        {item.value}
                                    </div>
                                    <div
                                        className="mt-1.5 text-[9px] md:text-[11px] font-semibold text-white/40 font-brutal uppercase leading-none">
                                        {item.label}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {showBonus && (
                <div
                    className={`bg-[#14141c] text-white px-3.5 max-[480px]:px-3 py-3 max-[480px]:py-2 mb-5 ${wideMobile ? 'max-[480px]:mb-0.5' : 'max-[480px]:mb-3'} flex items-center gap-3 max-[480px]:gap-2.5 mx-auto w-full max-w-[440px] border border-white/[0.06] rounded-xl font-sans`}>
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
