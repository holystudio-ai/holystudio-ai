import React, { useRef } from 'react';
import logoYellow from '../../assets/logo/logo=yellow.png';
import bgVideo from '../../assets/videos/bg.mp4';
import instagramLogo from '../../assets/logo/instagram.png';
import { Link } from "react-router-dom";

import Eugen from '../../assets/team/женя.jpg';
import Kate from '../../assets/team/катя.jpg';
import Marian from '../../assets/team/марян.jpg';

import companyLogo1 from "../../assets/company-logos/1.png";
import companyLogo2 from "../../assets/company-logos/2.png";
import companyLogo3 from "../../assets/company-logos/3.png";
import companyLogo4 from "../../assets/company-logos/4.png";
import companyLogo5 from "../../assets/company-logos/5.png";
import companyLogo6 from "../../assets/company-logos/6.png";
import companyLogo7 from "../../assets/company-logos/7.png";
import companyLogo8 from "../../assets/company-logos/8.png";
import companyLogo9 from "../../assets/company-logos/9.png";
import companyLogo10 from "../../assets/company-logos/10.png";
import companyLogo11 from "../../assets/company-logos/11.png";
import VideoEmbed from "@/src/components/features/VideoEmbed.tsx";

const Team: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const instructors = [
        {
            name: "Катя",
            role: "AI Artist",
            desc: "AI-експерт: пройшла шлях від технічної оптимізації до майстерності у створенні візуального контенту. Навчає бачити як інженер і творити як режисер — контролювати кожен кадр через промпти, досягаючи фотореалізму у відео та фото.",
            image: Kate
        },
        {
            name: "Женя",
            role: "Режисер та Арт-директор",
            desc: "Поєднує режисерський підхід із віральним маркетингом. Навчає працювати з драматургією та темпом, створюючи контент, який розуміє поведінку аудиторії та стає вірусним.",
            image: Eugen
        },
        {
            name: "Марʼян",
            role: "ОПЕРАТОР ТА ПРОДЮСЕР",
            desc: "Кінооператор з глибоким технічним бекграундом. Вчить, як працює світло і фактура в AI. Перетворює генерацію з лотереї на прогнозований продакшен-процес, де параметри задаються з лабараторною точністю.",
            image: Marian
        }
    ];

    const videoWorks = [
        { id: '01', videoId: '2mjyqMQxtKg', title: 'AMIC', caption: 'AMIC', tag: 'РЕКЛАМНИЙ РОЛИК' },
        { id: '02', videoId: 'sNyjAXZDqbs', title: 'AFFX', caption: 'AFFX', tag: 'РЕКЛАМНА КАМПАНІЯ' },
        { id: '03', videoId: '48s3rwVwJOQ', title: 'VERIFIED', caption: 'VERIFIED', tag: 'SHORTS' },
        { id: '04', videoId: 'TM-4yIQ1Yhc', title: 'MONEX', caption: 'MONEX', tag: 'SHORTS' },
        { id: '05', videoId: '_Yqku6a7v48', title: 'PORSCHE', caption: 'PORSHE', tag: 'SPEC AD' },
        { id: '06', videoId: '32-HWZZ570U', title: 'AMIC BRAND ELEMENT', caption: 'AMIC DRAND ELEMENT', tag: 'BRAND ELEMENT' },
    ];
    const companyLogos = [
        { src: companyLogo1, alt: "Company logo 1" },
        { src: companyLogo2, alt: "Company logo 2" },
        { src: companyLogo3, alt: "Company logo 3" },
        { src: companyLogo4, alt: "Company logo 4" },
        { src: companyLogo5, alt: "Company logo 5" },
        { src: companyLogo6, alt: "Company logo 6" },
        { src: companyLogo7, alt: "Company logo 7" },
        { src: companyLogo8, alt: "Company logo 8" },
        { src: companyLogo9, alt: "Company logo 9" },
        { src: companyLogo10, alt: "Company logo 10" },
        { src: companyLogo11, alt: "Company logo 11" },
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth < 768 ? 300 : 500;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-12 md:py-24 px-4 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                <div className="mb-10 md:mb-16 w-full">
                    <div className="w-full relative overflow-hidden border-2 border-zinc-800 bg-black">
                        <video
                            className="absolute inset-0 w-full h-full object-cover"
                            src={bgVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />

                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/60" />

                        <div className="relative z-10 w-full flex flex-col items-center justify-center gap-6 md:gap-10 pt-12 pb-3 md:py-20 px-4">
                            <h2 className="text-2xl md:text-6xl font-black font-brutal leading-[0.9] tracking-tighter uppercase text-white text-center">
                                Тебе навчатимуть <br className="hidden md:block" />
                                професіонали
                            </h2>

                            <div className="flex flex-col justify-center items-center w-full">
                                <img
                                    src={logoYellow}
                                    alt="HOLYSHOOT"
                                    className="w-[280px] md:w-[400px] h-auto object-contain"
                                />
                                <Link to="https://www.instagram.com/holyshoot_films?igsh=MTYweGkxODZ1bHZyOQ==">
                                    <img
                                        src={instagramLogo}
                                        alt="Instagram"
                                        className="w-[140px] md:w-[160px] h-auto object-contain pt-2"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 md:p-10 bg-zinc-900 flex flex-col gap-8 md:gap-10 border-2 border-zinc-800 relative">
                        <div className="max-w-3xl">
                            <p className="text-zinc-400 text-[14px] md:text-[16px] font-bold uppercase mt-3 leading-snug">
                                Ми - рекламний відео продакшн з досвідом роботи 10 років в індустрії. Інтегруємо АІ в проекти клієнтів.
                                <br />
                                <span className="font-black text-white mt-4 block tracking-widest text-[14px] md:text-[16px] uppercase">
                                    Наші крайні АІ роботи:
                                </span>
                            </p>
                        </div>

                        <div className="relative group w-full">
                            <div
                                ref={scrollRef}
                                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {videoWorks.map((video) => {
                                    return (
                                        <div
                                            key={video.id}
                                            className="snap-center shrink-0 w-[85vw] md:w-[500px] brutalist-border border-white bg-black overflow-hidden shadow-2xl"
                                        >
                                            <div className="aspect-video w-full bg-black">
                                                <VideoEmbed videoId={video.videoId} title={video.title} />
                                            </div>

                                            <div className="border-t border-white/15 bg-zinc-950 px-4 py-3 md:px-5 md:py-4">
                                                <p className="text-[14px] md:text-base font-black font-brutal text-white uppercase tracking-tight">
                                                    {video.caption}
                                                </p>
                                                <p className="mt-1 text-[12px] md:text-[14px] font-bold text-purple-500 uppercase">
                                                    {video.tag}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => scroll('left')}
                                className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white text-black w-10 h-10 brutalist-border border-black font-black hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all z-30"
                            >
                                ←
                            </button>

                            <button
                                onClick={() => scroll('right')}
                                className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white text-black w-10 h-10 brutalist-border border-black font-black hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all z-30"
                            >
                                →
                            </button>
                        </div>


                            <div className="logo-marquee group relative overflow-hidden border-2 border-zinc-800 bg-black/60 px-0 py-4 md:py-5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-24 bg-gradient-to-r from-zinc-900 via-zinc-900/75 to-transparent" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-24 bg-gradient-to-l from-zinc-900 via-zinc-900/75 to-transparent" />

                                <div className="logo-marquee__track flex w-max items-center gap-3 md:gap-5">
                                    {companyLogos.map((logo, index) => (
                                        <div
                                            key={`logo-primary-${index}`}
                                            className="flex h-[72px] w-[150px] md:h-[88px] md:w-[190px] shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] px-3 py-2 md:px-4 md:py-3 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
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
                                            className="flex h-[72px] w-[150px] md:h-[88px] md:w-[190px] shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] px-3 py-2 md:px-4 md:py-3 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
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

                <div className="w-full pt-10 flex flex-col items-center">
                    <div className="mb-10 text-center">
                        <h2 className="text-[24px] md:text-[32px] font-black font-brutal uppercase text-white leading-none text-center">
                            Автори і викладачі курсу
                        </h2>
                    </div>

                    <div className="w-full max-w-[1320px] flex flex-wrap justify-center gap-6">
                        {instructors.map((ins, idx) => (
                            <div
                                key={idx}
                                className="w-full md:w-[620px] brutalist-border p-4 md:p-6 bg-zinc-900 border-zinc-800 flex flex-col gap-4 hover:border-purple-500 transition-all group"
                            >
                                <div className="flex gap-5 items-start">
                                    <div
                                        className="
                            w-[140px] h-[140px]
                            min-[480px]:w-[160px] min-[480px]:h-[170px]
                            md:w-[200px] md:h-[220px]
                            shrink-0 brutalist-border border-purple-500 overflow-hidden relative
                        "
                                    >
                                        <img
                                            src={ins.image}
                                            alt={ins.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-start w-full min-w-0">
                                        <h3 className="text-[28px] max-[365px]:text-[22px] md:text-[24px] font-black uppercase font-brutal text-white leading-tight">
                                            {ins.name}
                                        </h3>

                                        <p className="text-purple-500 font-bold uppercase text-[16px] md:text-[14px] mt-1">
                                            {ins.role}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-zinc-400 text-[14px] md:text-[16px] font-bold mt-3 leading-snug">
                                    {ins.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 md:mt-20 text-center px-4">
                    <div className="inline-block bg-white text-black p-4 md:p-6 font-black text-sm md:text-2xl uppercase brutalist-border border-black font-brutal brutalist-shadow-accent">
                        Ми формуємо новий стандарт AI-креаторів.
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }

    @keyframes logo-marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
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
