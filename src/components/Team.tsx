import React, {useRef} from 'react';
import logo from '../assets/logo/logo.png';
import bgVideo from '../assets/videos/bg.mp4';

const Team: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const instructors = [
        {
            name: "Катя",
            role: "AI Artist",
            desc: "Перфекціоністка з безкомпромісною вимогою до якості: від концепції до фінального пікселя. Навчає вибудовувати фотореалістичні сцени та контролювати нейромережу, уникаючи випадкових результатів."
        },
        {
            name: "Женя",
            role: "Режисер та Арт-директор",
            desc: "Поєднує режисерський підхід із віральним маркетингом. Навчає працювати з драматургією та темпом, створюючи контент, який розуміє поведінку аудиторії та стає вірусним."
        },
        {
            name: "Марʼян",
            role: "Оператор та техконтроль",
            desc: "Кінооператор з глибоким технічним бекграундом. Вчить, як працює світло і фактура в AI. Перетворює генерацію з лотереї на прогнозований продакшен-процес, де параметри задаються з лабараторною точністю. "
        }
    ];

    const videoPlaceholders = [
        {id: '01', title: 'CYBER_COMMERCIAL', duration: '0:15', tag: 'ADS'},
        {id: '02', title: 'FASHION_GEN_v4', duration: '0:12', tag: 'EDITORIAL'},
        {id: '03', title: 'CINEMATIC_STORY', duration: '0:30', tag: 'FILM'},
        {id: '04', title: 'PRODUCT_MOTION', duration: '0:08', tag: 'PRODUCT'},
        {id: '05', title: 'AVATAR_INTERVIEW', duration: '0:20', tag: 'TECH'},
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
                        {/* BACKGROUND VIDEO */}
                        <video
                            className="absolute inset-0 w-full h-full object-cover"
                            src={bgVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />

                        {/* OVERLAY (щоб текст читався) */}
                        <div className="absolute inset-0 bg-black/10"/>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/60"/>

                        {/* CONTENT */}
                        <div
                            className="relative z-10 w-full flex flex-col items-center justify-center gap-6 md:gap-10 py-12 md:py-20 px-4">
                            <h2 className="text-2xl md:text-6xl font-black font-brutal leading-[0.9] tracking-tighter uppercase text-white text-center">
                                Тебе навчатимуть <br className="hidden md:block"/>
                                професіонали
                            </h2>

                            <div className="flex justify-center items-center w-full">
                                <img
                                    src={logo}
                                    alt="HOLYSHOOT"
                                    className="w-[280px] md:w-[400px] h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className="mt-8 p-4 md:p-10 bg-zinc-900 flex flex-col gap-8 md:gap-10 border-2 border-zinc-800 relative">
                        <div className="max-w-3xl">
                            <p className="text-[18px] md:text-[24px] font-black font-brutal uppercase text-white leading-tight">
                                Рекламний відео продакшн <span
                                className="text-purple-500 text-shadow-sm">HOLYSHOOT</span>
                            </p>
                            <p className="text-zinc-400 text-[14px] md:text-[16px] font-bold mt-3 leading-snug">
                                Ми рекламний відео продакшн з досвідом реальної роботи в індустрії. Практикуюча команда,
                                яка інтегрує АІ в реальні комерційні проекти.
                                <br/>
                                <span
                                    className="font-black text-white mt-4 block tracking-widest text-[14px] md:text-[16px] uppercase">
                                    Наші крайні АІ роботи:
                                </span>
                            </p>
                        </div>

                        {/* --- Video Case Slider --- */}
                        <div className="relative group w-full">
                            <div
                                ref={scrollRef}
                                className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
                                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                            >
                                {videoPlaceholders.map((video) => (
                                    <div
                                        key={video.id}
                                        // w-[85vw] на мобілці, щоб було видно краї сусідніх карток
                                        className="snap-center shrink-0 w-[85vw] md:w-[500px] aspect-video brutalist-border border-white bg-black relative group/card cursor-pointer overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                            <div
                                                className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                                            <div
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/30 flex items-center justify-center group-hover/card:border-purple-500 group-hover/card:bg-purple-500/10 transition-all">
                                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                            <div
                                                className="absolute top-0 left-0 w-full h-[2px] bg-purple-500/60 shadow-[0_0_15px_#a855f7] animate-scan-y pointer-events-none"></div>
                                        </div>

                                        {/* Касетний інтерфейс */}
                                        <div
                                            className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1 md:gap-2 z-10">
                                            <div
                                                className="bg-purple-600 text-white px-1.5 py-0.5 font-brutal text-[8px] md:text-[10px] uppercase animate-pulse">REC
                                                ●
                                            </div>
                                            <div
                                                className="bg-black/80 text-white px-1.5 py-0.5 font-brutal text-[8px] md:text-[10px] border border-white/20 uppercase">4K_RAW
                                            </div>
                                        </div>

                                        <div
                                            className="absolute bottom-0 left-0 w-full p-3 md:p-4 bg-gradient-to-t from-black to-transparent flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span
                                                    className="text-[10px] md:text-base font-black font-brutal text-white uppercase tracking-tight">{video.title}</span>
                                                <span
                                                    className="text-[7px] md:text-[10px] font-bold text-purple-500 uppercase">{video.tag}_MASTER_PROJECT</span>
                                            </div>
                                            <span
                                                className="text-[8px] md:text-xs font-black font-brutal text-white/70">{video.duration}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Кнопки навігації (приховані на мобільних) */}
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

                {/* --- Сітка викладачів --- */}
                <div className=" w-full mx-auto py-10">
                    {/* Головний заголовок секції */}
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-[24px] md:text-[32px] font-black font-brutal uppercase text-white leading-none">
                            Автори і викладачі курсу
                        </h2>
                        <div className="h-1.5 w-40 bg-purple-600 mt-2"></div>
                    </div>

                    {/* Сітка викладачів */}
                    <div className="grid grid-cols-1 min-[768px]:grid-cols-2 gap-6 justify-center">
                        {instructors.map((ins, idx) => (
                            <div
                                key={idx}
                                className="brutalist-border p-4 md:p-6 bg-zinc-900 border-zinc-800 flex flex-col gap-4 hover:border-purple-500 transition-all group"
                            >
                                {/* TOP: photo left + name/role right */}
                                <div className="flex gap-5 items-start">
                                    <div className="
  w-[140px] h-[140px]
  min-[480px]:w-[160px] min-[480px]:h-[170px]
  md:w-[200px] md:h-[220px]
  shrink-0 brutalist-border border-purple-500 overflow-hidden relative
">
                                        <img
                                            src={`https://picsum.photos/seed/instructor_${idx}_pro/400/400`}
                                            alt={ins.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* ВАЖЛИВО: додаємо w-full */}
                                    <div className="flex flex-col justify-start w-full min-w-0">
                                        <h3 className="text-[24px] md:text-[24px] font-black uppercase font-brutal text-white leading-tight">
                                            {ins.name}
                                        </h3>

                                        <p className="text-purple-500 font-bold uppercase text-[14px] md:text-[14px] mt-1">
                                            {ins.role}
                                        </p>
                                    </div>
                                </div>

                                {/* BOTTOM: description full width */}
                                <p className="text-zinc-400 font-medium text-[14px] md:text-[16px] leading-tight pt-4">
                                    {ins.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Фінальний банер */}
                <div className="mt-12 md:mt-20 text-center px-4">
                    <div
                        className="inline-block bg-white text-black p-4 md:p-6 font-black text-sm md:text-2xl uppercase brutalist-border border-black font-brutal brutalist-shadow-accent">
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
                .animate-scan-y { animation: scan-y 3.5s linear infinite; }
            `}</style>
        </section>
    );
};

export default Team;