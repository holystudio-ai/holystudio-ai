import React, { useRef, useState } from 'react';
import logoYellow from '../../assets/logo/logo=yellow.png';
import bgVideo from '../../assets/videos/bg.mp4';
import instagramLogo from '../../assets/logo/instagram.png';
import { Link } from "react-router-dom";

import Eugen from '../../assets/team/женя.jpg';
import Kate from '../../assets/team/катя.jpg';
import Marian from '../../assets/team/марян.jpg';

import works1 from "../../assets/videos/works1.mp4";
import works2 from "../../assets/videos/works2.mp4";
import works3 from "../../assets/videos/works3.mp4";
import works4 from "../../assets/videos/works4.mp4";
import workPoster1 from "../../assets/video-posters/work-poster1.png";
import workPoster2 from "../../assets/video-posters/work-poster2.png";
import workPoster3 from "../../assets/video-posters/work-poster3.png";
import workPoster4 from "../../assets/video-posters/works-poster4.png";

const Team: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
    const instructors = [
        {
            name: "Катя",
            role: "AI Artist",
            desc: "AI-експерт, яка вивчає нейромережі роками: пройшла шлях від технічної оптимізації до майстерності у створенні контенту. Навчає бачити як інженер і творити як режисер — контролювати кожен кадр через промти, досягаючи фотореалізму у відео та фото.",
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
        { id: '01', title: 'AMIC ENERGY', duration: '0:15', tag: 'РЕКЛАМНИЙ РОЛИК', src: works1, poster: workPoster1 },
        { id: '02', title: 'AFFX ACADEMY', duration: '0:12', tag: 'РЕКЛАМНА КАМПАНІЯ', src: works2, poster: workPoster2 },
        { id: '03', title: 'VERAFIED', duration: '0:30', tag: 'FASHION VIDEO', src: works3, poster: workPoster3 },
        { id: '04', title: 'AMIC ENERGY', duration: '0:30', tag: 'BRAND ELEMENT', src: works4, poster: workPoster4 },
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

    const stopAllVideosExcept = (id: string) => {
        for (const videoId in videoRefs.current) {
            const videoEl = videoRefs.current[videoId];
            if (!videoEl) continue;

            if (videoId !== id) {
                videoEl.pause();
                videoEl.currentTime = 0;
                videoEl.muted = true;
            }
        }
    };

    const openFullscreen = async (videoEl: HTMLVideoElement) => {
        try {
            if (videoEl.requestFullscreen) {
                await videoEl.requestFullscreen();
                return;
            }

            const safariVideo = videoEl as HTMLVideoElement & {
                webkitEnterFullscreen?: () => void;
            };

            if (safariVideo.webkitEnterFullscreen) {
                safariVideo.webkitEnterFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen failed:', error);
        }
    };

    const handlePlay = async (id: string) => {
        stopAllVideosExcept(id);

        const currentVideo = videoRefs.current[id];
        if (!currentVideo) return;

        try {
            currentVideo.currentTime = 0;
            currentVideo.muted = false;
            currentVideo.volume = 1;
            await currentVideo.play();
            setActiveVideoId(id);
        } catch (error) {
            console.error('Video play failed:', error);
        }
    };

    const handlePause = (id: string) => {
        const currentVideo = videoRefs.current[id];
        if (!currentVideo) return;

        currentVideo.pause();
        currentVideo.currentTime = 0;
        currentVideo.muted = true;

        setActiveVideoId((prev) => (prev === id ? null : prev));
    };

    const handleEnded = (id: string) => {
        const currentVideo = videoRefs.current[id];
        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.muted = true;
        }

        if (activeVideoId === id) {
            setActiveVideoId(null);
        }
    };

    const handleLoadedMetadata = (id: string) => {
        const currentVideo = videoRefs.current[id];
        if (!currentVideo) return;

        currentVideo.muted = true;

        // Safari often keeps the preview black after reload unless it seeks
        // to an actual frame instead of relying on metadata-only preload.
        try {
            if (currentVideo.currentTime === 0) {
                currentVideo.currentTime = 0.01;
            }
        } catch (error) {
            console.error('Preview seek failed:', error);
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
                                Ми рекламний відео продакшн з досвідом реальної роботи в індустрії. Практикуюча команда,
                                яка інтегрує АІ в реальні комерційні проекти.
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
                                    const isActive = activeVideoId === video.id;

                                    return (
                                        <div
                                            key={video.id}
                                            className="snap-center shrink-0 w-[85vw] md:w-[500px] aspect-video brutalist-border border-white bg-black relative overflow-hidden shadow-2xl"
                                        >
                                            <video
                                                ref={(el) => {
                                                    videoRefs.current[video.id] = el;
                                                }}
                                                className="work-video absolute inset-0 w-full h-full bg-black object-cover object-center"
                                                src={`${video.src}#t=0.001`}
                                                poster={video.poster}
                                                playsInline
                                                preload="auto"
                                                muted
                                                controls={isActive}
                                                controlsList="nodownload noplaybackrate noremoteplayback"
                                                disablePictureInPicture
                                                onLoadedMetadata={() => handleLoadedMetadata(video.id)}
                                                onEnded={() => handleEnded(video.id)}
                                            />

                                            {!isActive && (
                                                <>
                                                    <img
                                                        src={video.poster}
                                                        alt={`${video.title} poster`}
                                                        className="absolute inset-0 z-[5] w-full h-full object-cover"
                                                    />

                                                    <div className="absolute inset-0 bg-black/30 z-10" />

                                                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-10" />

                                                    <div className="absolute inset-0 pointer-events-none z-10">
                                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500/60 shadow-[0_0_15px_#a855f7] animate-scan-y" />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePlay(video.id)}
                                                        className="absolute inset-0 z-20 flex items-center justify-center"
                                                        aria-label={`Play ${video.title}`}
                                                    >
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/30 flex items-center justify-center bg-black/30 backdrop-blur-[2px] hover:border-purple-500 hover:bg-purple-500/10 transition-all">
                                                            <svg
                                                                className="w-7 h-7 md:w-8 md:h-8 text-white ml-0.5"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1 md:gap-2 z-20 pointer-events-none">
                                                        <div className="bg-purple-600 text-white px-1.5 py-0.5 font-brutal text-[8px] md:text-[10px] uppercase animate-pulse">
                                                            REC ●
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-between items-end z-20 pointer-events-none">
                                                        <div className="flex flex-col">
                            <span className="text-[14px] md:text-base font-black font-brutal text-white uppercase tracking-tight">
                                {video.title}
                            </span>
                                                            <span className="text-[12px] md:text-[14px] font-bold text-purple-500 uppercase">
                                {video.tag}
                            </span>
                                                        </div>

                                                        <span className="text-[11px] md:text-[13px] font-bold text-white/80 uppercase">
                            {video.duration}
                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {isActive && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const currentVideo = videoRefs.current[video.id];
                                                            if (currentVideo) {
                                                                openFullscreen(currentVideo);
                                                            }
                                                        }}
                                                        className="absolute top-3 left-3 z-30 bg-black/70 text-white border border-white/20 px-3 py-1 text-[10px] md:text-xs font-black uppercase hover:bg-purple-500 hover:text-white transition-all"
                                                        aria-label={`Fullscreen ${video.title}`}
                                                    >
                                                        Full
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePause(video.id)}
                                                        className="absolute top-3 right-3 z-30 bg-black/70 text-white border border-white/20 px-3 py-1 text-[10px] md:text-xs font-black uppercase hover:bg-white hover:text-black transition-all"
                                                        aria-label={`Stop ${video.title}`}
                                                    >
                                                        Stop
                                                    </button>
                                                </>
                                            )}
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

    @keyframes scan-y {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(200px); opacity: 0; }
    }

    .animate-scan-y {
        animation: scan-y 3.5s linear infinite;
    }

    /* У маленькому плеєрі відео заповнює горизонтальну картку */
    .work-video {
        object-fit: cover;
        object-position: center;
        background: black;
    }

    /* У fullscreen відео показується у рідній орієнтації без кропу */
    .work-video:fullscreen {
        object-fit: contain !important;
        object-position: center !important;
        background: black !important;
        width: 100vw !important;
        height: 100vh !important;
    }

    .work-video:-webkit-full-screen {
        object-fit: contain !important;
        object-position: center !important;
        background: black !important;
        width: 100vw !important;
        height: 100vh !important;
    }

    .work-video::-webkit-media-controls {
        z-index: 2147483647;
    }
            `}</style>
        </section>
    );
};

export default Team;
