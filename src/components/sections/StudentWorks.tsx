import React, { useRef } from "react";

const StudentsWorks: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const videos = [
        { id: "01", title: "AI_CAR_AD", duration: "0:18", tag: "ADS" },
        { id: "02", title: "FASHION_DROP", duration: "0:12", tag: "EDITORIAL" },
        { id: "03", title: "CYBER_SHORT", duration: "0:25", tag: "FILM" },
        { id: "04", title: "BRAND_REEL", duration: "0:14", tag: "SOCIAL" },
    ];

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth < 768 ? 260 : 420;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="py-16 md:py-24 px-4 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Заголовок */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-black font-brutal leading-[1.1] tracking-tighter uppercase text-white">
                        Роботи студентів після проходження інтенсиву
                    </h2>
                </div>

                {/* --- Vertical Video Slider --- */}
                <div className="relative group w-full">

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="snap-center shrink-0 w-[70vw] sm:w-[300px] md:w-[360px] aspect-[9/16] brutalist-border border-white bg-black relative group/card cursor-pointer overflow-hidden shadow-2xl"
                            >
                                {/* Placeholder video layer */}
                                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                                    {/* Play Button */}
                                    <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center group-hover/card:border-purple-500 group-hover/card:bg-purple-500/10 transition-all">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>

                                    {/* Scan line animation */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500/60 shadow-[0_0_15px_#a855f7] animate-scan-y pointer-events-none"></div>
                                </div>

                                {/* REC Interface */}
                                <div className="absolute top-3 left-3 flex gap-2 z-10">
                                    <div className="bg-purple-600 text-white px-2 py-1 font-brutal text-[10px] uppercase animate-pulse">
                                        REC ●
                                    </div>
                                    <div className="bg-black/80 text-white px-2 py-1 font-brutal text-[10px] border border-white/20 uppercase">
                                        9:16
                                    </div>
                                </div>

                                {/* Bottom info */}
                                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent flex justify-between items-end">
                                    <div className="flex flex-col">
                    <span className="text-sm font-black font-brutal text-white uppercase">
                      {video.title}
                    </span>
                                        <span className="text-[10px] font-bold text-purple-500 uppercase">
                      STUDENT_PROJECT
                    </span>
                                    </div>
                                    <span className="text-xs font-black font-brutal text-white/70">
                    {video.duration}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white text-black w-10 h-10 brutalist-border border-black font-black hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all z-30"
                    >
                        ←
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white text-black w-10 h-10 brutalist-border border-black font-black hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all z-30"
                    >
                        →
                    </button>

                </div>
            </div>

            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @keyframes scan-y {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; }
        }

        .animate-scan-y { animation: scan-y 4s linear infinite; }
      `}</style>
        </section>
    );
};

export default StudentsWorks;