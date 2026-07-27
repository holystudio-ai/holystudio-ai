import React from 'react';
import {formatPriceUah} from '@/src/lib/pricing.ts';
import CountdownBlocks from '@/src/components/sections/split/CountdownBlocks.tsx';

/**
 * Split-test course contents block — replaces the second "special offer"
 * Pricing plate. Styled like the Program grid, but one full-width block per row.
 */

const items = [
    {num: '01', text: '8 практичних уроків + Бонус'},
    {num: '02', text: '20 шаблонів промтів'},
    {num: '03', text: 'Комерційний пайплайн роботи з нейронками: NanoBanana + Kling на базі Higgsfield'},
    {num: '04', text: 'Жива Zoom-сесія з розбором робіт'},
    {num: '05', text: 'Доступ до комерційних замовлень HOLYSTUDIO (для найкращих студентів)'},
    {num: '06', text: 'Постійний доступ до матеріалів'},
];

// Split-test pricing: full ~1000 → 390 грн (matches HomeSplit).
const OLD_PRICE = '1 000';
const NEW_PRICE = formatPriceUah(390);

interface SplitCourseBlockProps {
    /** CTA target link (Telegram bot deep link). */
    ctaHref?: string;
}

const SplitCourseBlock: React.FC<SplitCourseBlockProps> = ({
    ctaHref = 'https://telegram.me/HOLYSTUDIO_AI_bot?start=ZGw6MzM1MDE1',
}) => {
    return (
        <section className="bg-white px-4 py-8 text-black md:py-14">
            <div className="mx-auto flex max-w-2xl flex-col md:max-w-3xl">
                <div className="mb-4 text-center md:mb-6 md:text-left">
                    <h2 className="font-brutal text-3xl font-black uppercase leading-none tracking-tighter md:text-6xl">
                        HOLYSTUDIO
                    </h2>
                    <p className="mt-0.5 font-brutal text-xl font-black uppercase tracking-tight text-purple-600 md:text-3xl">
                        AI CREATOR
                    </p>
                </div>

                {/* Compacted into ONE bordered block with divided rows so the whole
                    offer (heading + items + price + timer) fits a single mobile screen. */}
                <div className="divide-y-2 divide-black border-4 border-black bg-white brutalist-shadow">
                    {items.map((item) => (
                        <div
                            key={item.num}
                            className="flex items-baseline gap-2.5 px-3 py-2 md:gap-4 md:px-5 md:py-3"
                        >
                            <span className="shrink-0 font-brutal text-sm font-black leading-none opacity-40 md:text-xl">
                                /{item.num}
                            </span>
                            <p className="font-brutal text-[11px] font-black uppercase leading-tight md:text-base">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-[#0b0b10] p-4 text-white shadow-[0_4px_40px_rgba(0,0,0,0.6)] md:mt-6 md:gap-5 md:p-8">
                    <div className="flex items-center justify-center gap-5 md:gap-8">
                        <div className="flex flex-col items-center">
                            <span className="whitespace-nowrap font-brutal text-2xl font-black leading-none tracking-tighter text-white/30 line-through decoration-red-500 decoration-[3px] md:text-5xl">
                                {OLD_PRICE}
                            </span>
                            <span className="mt-0.5 font-brutal text-xs font-bold text-white/30 md:text-sm">
                                ГРН
                            </span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="whitespace-nowrap font-brutal text-4xl font-black leading-none tracking-tighter text-white md:text-7xl">
                                {NEW_PRICE}
                            </span>
                            <span className="mt-1 font-brutal text-xs font-bold leading-none text-white/70 md:text-base">
                                ГРН
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 w-full">
                        <div className="pointer-events-none absolute -inset-x-3 -bottom-3 h-9 rounded-full bg-red-600/30 blur-xl"></div>
                        <a
                            href={ctaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button relative block w-full rounded-xl bg-red-600 py-3 text-center font-brutal text-sm font-black uppercase text-white shadow-[0_0_16px_rgba(239,68,68,0.68),0_0_40px_rgba(239,68,68,0.34),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.8),0_0_54px_rgba(239,68,68,0.42),inset_0_1px_0_rgba(255,255,255,0.22)] md:py-4 md:text-lg"
                        >
                            Зробити прорив в AI!
                        </a>
                    </div>

                    <CountdownBlocks compact variant="dark"/>
                </div>
            </div>
        </section>
    );
};

export default SplitCourseBlock;
