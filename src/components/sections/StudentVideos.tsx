import React, { useRef } from "react";
import VideoEmbed from "@/src/components/features/VideoEmbed.tsx";

/**
 * Video-works slider for student results — sits directly below the photo
 * slider (StudentWorks) on the split page. Each card is a vertical YouTube
 * Short opened in the shared VideoEmbed modal.
 */

const videos = [
    { id: "01", videoId: "iypTTbujOMk", tag: "AI SHORTS" },
    { id: "02", videoId: "woGSCZ1jZpE", tag: "AI SHORTS" },
    { id: "03", videoId: "5rkUdfpMLAs", tag: "AI SHORTS" },
    { id: "04", videoId: "XoXaRQ_o5JI", tag: "AI SHORTS" },
    { id: "05", videoId: "BQxETrm1u2w", tag: "AI SHORTS" },
    { id: "06", videoId: "I3r6OM1fExE", tag: "AI SHORTS" },
];

const StudentVideos: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        const scrollAmount = window.innerWidth < 768 ? 260 : 380;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="pb-12 pt-2 md:pb-24 md:pt-4 px-4 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-4xl font-black font-brutal leading-[1.1] tracking-tighter uppercase text-white">
                        Відео-роботи студентів
                    </h2>
                    <p className="mt-3 text-sm md:text-base font-bold uppercase tracking-widest text-purple-500">
                        Зроблено на інтенсиві HOLYSTUDIO
                    </p>
                </div>

                <div className="relative group w-full">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {videos.map((video) => (
                            <div
                                key={video.id}
                                className="snap-center shrink-0 w-[62vw] sm:w-[260px] md:w-[300px] brutalist-border border-zinc-800 bg-zinc-950 relative overflow-hidden shadow-2xl transition-colors duration-300 hover:border-white/60"
                            >
                                <div className="aspect-[9/16] w-full bg-black">
                                    <VideoEmbed
                                        videoId={video.videoId}
                                        title={`Відео-робота студента ${video.id}`}
                                        isVertical
                                    />
                                </div>

                                <div className="border-t border-white/15 bg-zinc-950 px-4 py-3">
                                    <p className="text-[12px] font-bold uppercase text-purple-500">
                                        {video.tag}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white text-black w-10 h-10 brutalist-border border-black font-black hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all z-30"
                        aria-label="Прокрутити вліво"
                    >
                        ←
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white text-black w-10 h-10 brutalist-border border-black font-black hidden md:flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all z-30"
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

export default StudentVideos;
