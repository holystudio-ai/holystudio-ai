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
        <section className="bg-white px-4 py-12 text-black md:py-16">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center md:text-left">
                    <h2 className="font-brutal text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
                        HOLYSTUDIO
                    </h2>
                    <p className="mt-1 font-brutal text-2xl font-black uppercase tracking-tight text-purple-600 md:text-3xl">
                        AI CREATOR
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <div
                            key={item.num}
                            className="flex items-baseline gap-3 border-4 border-black bg-white px-4 py-3 brutalist-shadow transition-transform hover:-translate-y-1 md:gap-4 md:px-5 md:py-4"
                        >
                            <span className="shrink-0 font-brutal text-base font-black leading-none opacity-40 md:text-xl">
                                /{item.num}
                            </span>
                            <p className="font-brutal text-sm font-black uppercase leading-tight md:text-lg">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col items-center gap-5 border-4 border-black bg-black p-6 text-white md:p-8">
                    <div className="flex items-end justify-center gap-4">
                        <span className="font-brutal text-3xl font-black leading-none text-white/30 line-through decoration-red-500 decoration-[3px] md:text-5xl">
                            {OLD_PRICE}
                        </span>
                        <span className="font-brutal text-5xl font-black leading-none tracking-tighter md:text-7xl">
                            {NEW_PRICE}
                        </span>
                        <span className="mb-1 font-brutal text-sm font-bold text-white/70 md:text-base">
                            ГРН
                        </span>
                    </div>

                    <a
                        href={ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button w-full bg-purple-600 py-4 text-center font-brutal text-base font-black uppercase text-white brutalist-border border-white transition-all hover:bg-purple-500 md:text-lg"
                    >
                        Зробити прорив в AI!
                    </a>

                    <CountdownBlocks/>
                </div>
            </div>
        </section>
    );
};

export default SplitCourseBlock;
