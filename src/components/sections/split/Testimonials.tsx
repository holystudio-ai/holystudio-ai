import React, {useRef} from 'react';
import useAutoScroll from '@/src/hooks/useAutoScroll.ts';

import review1 from '../../../assets/students-reviews/review1.png';
import review2 from '../../../assets/students-reviews/review2.png';
import review3 from '../../../assets/students-reviews/review3.png';
import review4 from '../../../assets/students-reviews/review4.png';
import review5 from '../../../assets/students-reviews/review5.png';
import review6 from '../../../assets/students-reviews/review6.png';
import review7 from '../../../assets/students-reviews/review7.png';
import review8 from '../../../assets/students-reviews/review8.png';
import review9 from '../../../assets/students-reviews/review9.png';

/**
 * Split-test reviews block — a plain slider of review screenshots
 * (edits brief 2.0, point 7). Cards keep a fixed width and their natural
 * height, so every screenshot stays readable and uncropped.
 */

const screenshots = [review1, review2, review3, review4, review5, review6, review7, review8, review9];

const Testimonials: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const pauseAutoScroll = useAutoScroll(scrollRef);

    const scroll = (direction: 'left' | 'right') => {
        const track = scrollRef.current;
        const card = track?.firstElementChild as HTMLElement | null;
        if (!track || !card) return;

        // Keep the auto-scroll off the element while the smooth animation runs,
        // otherwise the two fight over scrollLeft and the slider gets stuck.
        pauseAutoScroll();

        // Step by whole cards so a card always lands flush against the left edge —
        // scrolling by the raw viewport width leaves the next card half off-screen
        // on mobile, where the card (78vw) is narrower than the track.
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = card.offsetWidth + gap;
        const perView = Math.max(1, Math.round(track.clientWidth / step));
        const maxScroll = track.scrollWidth - track.clientWidth;
        const index = track.scrollLeft / step;

        // floor/ceil (not round) so a click always moves in the pressed direction
        // even when auto-scroll has left us mid-card.
        const nextIndex =
            direction === 'left'
                ? Math.ceil(index - 0.02) - perView
                : Math.floor(index + 0.02) + perView;

        track.scrollTo({
            left: Math.min(maxScroll, Math.max(0, nextIndex * step)),
            behavior: 'smooth',
        });
    };

    return (
        <section className="overflow-hidden bg-zinc-900 px-4 py-12 md:py-20">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center md:mb-14">
                    <h2 className="font-brutal text-2xl font-black uppercase leading-[1.05] tracking-tighter text-white md:text-5xl">
                        Цей курс вже пройшло{' '}
                        <span className="text-purple-500">300+ студентів</span>
                        <br className="hidden md:block" /> і ось відгуки частини з них
                    </h2>
                </div>

                <div className="group relative w-full">
                    <div
                        ref={scrollRef}
                        className="no-scrollbar flex gap-4 overflow-x-auto pb-6 md:gap-6"
                        style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                    >
                        {screenshots.map((src, idx) => (
                            <div
                                key={idx}
                                className="flex h-[220px] w-[78vw] shrink-0 items-center justify-center overflow-hidden border-black bg-[#f2f5f8] p-3 sm:w-[calc(50%-8px)] md:h-[300px] md:w-[calc(50%-12px)] lg:h-[340px] xl:h-[420px] brutalist-border"
                            >
                                <img
                                    src={src}
                                    alt={`Відгук студента ${idx + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-black bg-white font-black text-black transition-all hover:bg-purple-500 hover:text-white md:-left-5 brutalist-border"
                        aria-label="Прокрутити вліво"
                    >
                        ←
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-black bg-white font-black text-black transition-all hover:bg-purple-500 hover:text-white md:-right-5 brutalist-border"
                        aria-label="Прокрутити вправо"
                    >
                        →
                    </button>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </section>
    );
};

export default Testimonials;
