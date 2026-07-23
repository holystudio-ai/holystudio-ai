import React, {useRef} from 'react';
import logoYellow from '../../assets/logo/logo-yellow.png';
import bgVideo from '../../assets/videos/bg.mp4';
import instagramLogo from '../../assets/logo/instagram.png';
import {Link} from 'react-router-dom';

import Eugen from '../../assets/team/женя.jpg';
import Kate from '../../assets/team/катя.jpg';
import Marian from '../../assets/team/марян.jpg';

import companyLogo1 from '../../assets/company-logos/1.png';
import companyLogo2 from '../../assets/company-logos/2.png';
import companyLogo3 from '../../assets/company-logos/3.png';
import companyLogo4 from '../../assets/company-logos/4.png';
import companyLogo5 from '../../assets/company-logos/5.png';
import companyLogo6 from '../../assets/company-logos/6.png';
import companyLogo7 from '../../assets/company-logos/7.png';
import companyLogo8 from '../../assets/company-logos/8.png';
import companyLogo9 from '../../assets/company-logos/9.png';
import companyLogo10 from '../../assets/company-logos/10.png';
import companyLogo11 from '../../assets/company-logos/11.png';
import VideoEmbed from '@/src/components/features/VideoEmbed.tsx';
import useAutoScroll from '@/src/hooks/useAutoScroll.ts';

import workPoster1 from '../../assets/video-posters/work-poster1.png';
import workPoster2 from '../../assets/video-posters/work-poster2.png';
import workPoster3 from '../../assets/video-posters/work-poster3.png';
import workPoster4 from '../../assets/video-posters/work-poster4.png';
import workPoster5 from '../../assets/video-posters/work-poster5.png';
import workPoster6 from '../../assets/video-posters/work-poster6.png';

interface TeamProps {
    /** Use the split-test production copy (new headline + body + accented "10"). */
    productionVariant?: 'default' | 'split';
    /** Slowly auto-scroll the works slider and keep the arrows visible on mobile too. */
    sliderAutoScroll?: boolean;
}

const Team: React.FC<TeamProps> = ({productionVariant = 'default', sliderAutoScroll = false}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const pauseAutoScroll = useAutoScroll(scrollRef, {enabled: sliderAutoScroll});

    const instructors = [
        {
            name: 'Катя',
            role: 'AI Artist',
            desc: 'AI-експерт: пройшла шлях від технічної оптимізації до майстерності у створенні візуального контенту. Навчає бачити як інженер і творити як режисер — контролювати кожен кадр через промпти, досягаючи фотореалізму у відео та фото.',
            image: Kate,
        },
        {
            name: 'Женя',
            role: 'Режисер та Арт-директор',
            desc: 'Поєднує режисерський підхід із віральним маркетингом. Навчає працювати з драматургією та темпом, створюючи контент, який розуміє поведінку аудиторії та стає вірусним.',
            image: Eugen,
        },
        {
            name: 'Марʼян',
            role: 'ОПЕРАТОР ТА ПРОДЮСЕР',
            desc: 'Кінооператор з глибоким технічним бекграундом. Вчить, як працює світло і фактура в AI. Перетворює генерацію з лотереї на прогнозований продакшен-процес, де параметри задаються з лабараторною точністю.',
            image: Marian,
        },
    ];

    const videoWorks = [
        {id: '01', videoId: 'xNfiBxSdNIk', title: 'AMIC', caption: 'AMIC', tag: 'РЕКЛАМНИЙ РОЛИК', thumbnail: workPoster1},
        {id: '02', videoId: 'sNyjAXZDqbs', title: 'AFFX', caption: 'AFFX', tag: 'РЕКЛАМНА КАМПАНІЯ', thumbnail: workPoster2},
        {id: '03', videoId: '48s3rwVwJOQ', title: 'VERIFIED', caption: 'VERIFIED', tag: 'SHORTS', thumbnail: workPoster3},
        {id: '04', videoId: 'TM-4yIQ1Yhc', title: 'MONEX', caption: 'MONEX', tag: 'SHORTS', thumbnail: workPoster5},
        {id: '05', videoId: '_Yqku6a7v48', title: 'PORSCHE', caption: 'PORSHE', tag: 'SPEC AD', thumbnail: workPoster6},
        {
            id: '06',
            videoId: '32-HWZZ570U',
            title: 'AMIC BRAND ELEMENT',
            caption: 'AMIC DRAND ELEMENT',
            tag: 'BRAND ELEMENT',
            thumbnail: workPoster4
        },
    ];

    const companyLogos = [
        {src: companyLogo1, alt: 'Company logo 1'},
        {src: companyLogo2, alt: 'Company logo 2'},
        {src: companyLogo3, alt: 'Company logo 3'},
        {src: companyLogo4, alt: 'Company logo 4'},
        {src: companyLogo5, alt: 'Company logo 5'},
        {src: companyLogo6, alt: 'Company logo 6'},
        {src: companyLogo7, alt: 'Company logo 7'},
        {src: companyLogo8, alt: 'Company logo 8'},
        {src: companyLogo9, alt: 'Company logo 9'},
        {src: companyLogo10, alt: 'Company logo 10'},
        {src: companyLogo11, alt: 'Company logo 11'},
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;

        pauseAutoScroll();

        const scrollAmount = window.innerWidth < 768 ? 300 : 640;

        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="overflow-hidden bg-black px-4 py-12 md:px-4 md:py-24">
            <div className="mx-auto flex max-w-7xl flex-col items-center">
                <div className="mb-10 w-full md:mb-16">
                    <div className="relative w-full overflow-hidden border-2 border-zinc-800 bg-black">
                        <video
                            className="absolute inset-0 h-full w-full object-cover"
                            src={bgVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />

                        <div className="absolute inset-0 bg-black/10"/>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/60"/>

                        <div
                            className="relative z-10 flex w-full flex-col items-center justify-center gap-6 px-4 pb-3 pt-12 md:gap-10 md:py-20">
                            <h2 className="text-center font-brutal text-2xl font-black uppercase leading-[0.9] tracking-tighter text-white md:text-6xl">
                                Тебе навчатимуть <br className="hidden md:block"/>
                                професіонали
                            </h2>

                            <div className="flex w-full flex-col items-center justify-center">
                                <img
                                    src={logoYellow}
                                    alt="HOLYSHOOT"
                                    className="h-auto w-[280px] object-contain md:w-[400px]"
                                />

                                <Link to="https://www.instagram.com/holyshoot_films?igsh=MTYweGkxODZ1bHZyOQ==">
                                    <img
                                        src={instagramLogo}
                                        alt="Instagram"
                                        className="h-auto w-[140px] object-contain pt-2 md:w-[160px]"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative mt-8 flex flex-col gap-8 border-2 border-zinc-800 bg-zinc-900 p-4 md:gap-10 md:p-10">
                        <div className="max-w-3xl">
                            {productionVariant === 'split' ? (
                                <div className="mt-3">
                                    <h3 className="font-brutal text-[18px] font-black uppercase leading-[1.1] tracking-tight text-white md:text-[26px]">
                                        Ми — рекламний відео продакшн, що диктує тренди.{' '}
                                        <span className="text-purple-500">10</span> років в індустрії, тепер — підсилені AI.
                                    </h3>

                                    <p className="mt-4 text-[14px] font-bold normal-case leading-snug text-zinc-400 md:text-[16px]">
                                        Ми не просто «генеруємо картинки». Ми інтегруємо AI-технології у великий бізнес,
                                        створюючи контент, який раніше здавався неможливим. Від традиційного кінодосвіду
                                        до візуальних революцій для лідерів ринку.
                                    </p>

                                    <span className="mt-4 block text-[14px] font-black uppercase tracking-widest text-white md:text-[16px]">
                                        Подивіться, як виглядає майбутнє реклами:
                                    </span>
                                </div>
                            ) : (
                                <p className="mt-3 text-[14px] font-bold uppercase leading-snug text-zinc-400 md:text-[16px]">
                                    Ми - рекламний відео продакшн з досвідом роботи 10 років в індустрії. Інтегруємо АІ в
                                    проекти клієнтів.
                                    <br/>
                                    <span
                                        className="mt-4 block text-[14px] font-black uppercase tracking-widest text-white md:text-[16px]">
                                        Наші крайні АІ роботи:
                                    </span>
                                </p>
                            )}
                        </div>

                        <div className="relative w-full group">
                            <div
                                ref={scrollRef}
                                className={`no-scrollbar flex gap-4 overflow-x-auto pb-4 md:gap-6 ${
                                    sliderAutoScroll ? '' : 'snap-x snap-mandatory'
                                }`}
                                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                            >
                                {videoWorks.map((video) => (
                                    <div
                                        key={video.id}
                                        className="snap-center shrink-0 overflow-hidden border border-white bg-black shadow-2xl brutalist-border w-[85vw] sm:w-[78vw] md:w-[720px]"
                                    >
                                        <div className="aspect-video w-full bg-black">
                                            <VideoEmbed videoId={video.videoId} title={video.title} thumbnail={video.thumbnail}/>
                                        </div>

                                        <div className="border-t border-white/15 bg-zinc-950 px-4 py-3 md:px-5 md:py-4">
                                            <p className="text-[14px] font-black uppercase tracking-tight text-white font-brutal md:text-base">
                                                {video.caption}
                                            </p>
                                            <p className="mt-1 text-[12px] font-bold uppercase text-purple-500 md:text-[14px]">
                                                {video.tag}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => scroll('left')}
                                className={`absolute top-1/2 z-30 h-10 w-10 -translate-y-1/2 items-center justify-center border-black bg-white font-black text-black transition-all hover:bg-purple-500 hover:text-white md:flex md:-left-5 brutalist-border ${
                                    sliderAutoScroll ? 'flex left-0' : 'hidden -left-5'
                                }`}
                                aria-label="Прокрутити вліво"
                            >
                                ←
                            </button>

                            <button
                                onClick={() => scroll('right')}
                                className={`absolute top-1/2 z-30 h-10 w-10 -translate-y-1/2 items-center justify-center border-black bg-white font-black text-black transition-all hover:bg-purple-500 hover:text-white md:flex md:-right-5 brutalist-border ${
                                    sliderAutoScroll ? 'flex right-0' : 'hidden -right-5'
                                }`}
                                aria-label="Прокрутити вправо"
                            >
                                →
                            </button>
                        </div>

                        <div
                            className="logo-marquee group relative overflow-hidden border-2 border-zinc-800 bg-black/60 px-0 py-4 md:py-5">
                            <div
                                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-zinc-900 via-zinc-900/75 to-transparent md:w-24"/>
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-zinc-900 via-zinc-900/75 to-transparent md:w-24"/>

                            <div className="logo-marquee__track flex w-max items-center gap-3 md:gap-5">
                                {companyLogos.map((logo, index) => (
                                    <div
                                        key={`logo-primary-${index}`}
                                        className="flex h-[72px] w-[150px] shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] px-3 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] md:h-[88px] md:w-[190px] md:px-4 md:py-3"
                                    >
                                        <img
                                            src={logo.src}
                                            alt={logo.alt}
                                            className="block max-h-full max-w-full object-contain object-center"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}

                                {companyLogos.map((logo, index) => (
                                    <div
                                        key={`logo-duplicate-${index}`}
                                        aria-hidden="true"
                                        className="flex h-[72px] w-[150px] shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] px-3 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] md:h-[88px] md:w-[190px] md:px-4 md:py-3"
                                    >
                                        <img
                                            src={logo.src}
                                            alt=""
                                            className="block max-h-full max-w-full object-contain object-center"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center pt-10">
                    <div className="mb-10 text-center">
                        <h2 className="text-center font-brutal text-[24px] font-black uppercase leading-none text-white md:text-[32px]">
                            Автори і викладачі курсу
                        </h2>
                    </div>

                    <div className="flex w-full max-w-[1320px] flex-wrap justify-center gap-6">
                        {instructors.map((ins, idx) => (
                            <div
                                key={idx}
                                className="group flex w-full flex-col gap-4 border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-purple-500 md:w-[620px] md:p-6 brutalist-border"
                            >
                                <div className="flex items-start gap-5">
                                    <div
                                        className="relative h-[140px] w-[140px] shrink-0 overflow-hidden border-purple-500 min-[480px]:h-[170px] min-[480px]:w-[160px] md:h-[220px] md:w-[200px] brutalist-border">
                                        <img
                                            src={ins.image}
                                            alt={ins.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex min-w-0 w-full flex-col justify-start">
                                        <h3 className="font-brutal text-[28px] font-black uppercase leading-tight text-white max-[365px]:text-[22px] md:text-[24px]">
                                            {ins.name}
                                        </h3>

                                        <p className="mt-1 text-[16px] font-bold uppercase text-purple-500 md:text-[14px]">
                                            {ins.role}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 text-[14px] font-bold leading-snug text-zinc-400 md:text-[16px]">
                                    {ins.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 px-4 text-center md:mt-20">
                    <div
                        className="inline-block border-black bg-white p-4 font-brutal text-sm font-black uppercase text-black md:p-6 md:text-2xl brutalist-border brutalist-shadow-accent">
                        Ми формуємо новий стандарт AI-креаторів.
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                @keyframes logo-marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .logo-marquee__track {
                    animation: logo-marquee 32s linear infinite;
                    will-change: transform;
                }

                .logo-marquee:hover .logo-marquee__track {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default Team;