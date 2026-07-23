import React, {useRef} from "react";
import VideoEmbed from "@/src/components/features/VideoEmbed.tsx";
import useAutoScroll from "@/src/hooks/useAutoScroll.ts";

import studentWork1 from "../../../assets/student-works/1.jpg";
import studentWork2 from "../../../assets/student-works/2.jpg";
import studentWork3 from "../../../assets/student-works/3.jpg";
import studentWork4 from "../../../assets/student-works/4.jpg";
import studentWork5 from "../../../assets/student-works/5.jpg";
import studentWork6 from "../../../assets/student-works/6.jpg";
import studentWork7 from "../../../assets/student-works/7.jpg";
import studentWork8 from "../../../assets/student-works/8.jpg";
import studentWork9 from "../../../assets/student-works/9.jpg";
import studentWork10 from "../../../assets/student-works/10.jpg";
import studentWork11 from "../../../assets/student-works/11.webp";

/**
 * Split-test student works slider — videos and photos merged into ONE
 * auto-scrolling slider (videos first, then photos), replacing the separate
 * StudentWorks + StudentVideos sections.
 */

type Slide =
    | {kind: "video"; id: string; videoId: string}
    | {kind: "photo"; id: string; src: string; alt: string};

const slides: Slide[] = [
    {kind: "video", id: "v01", videoId: "iypTTbujOMk"},
    {kind: "video", id: "v02", videoId: "woGSCZ1jZpE"},
    {kind: "video", id: "v03", videoId: "5rkUdfpMLAs"},
    {kind: "video", id: "v04", videoId: "XoXaRQ_o5JI"},
    {kind: "video", id: "v05", videoId: "BQxETrm1u2w"},
    {kind: "video", id: "v06", videoId: "I3r6OM1fExE"},
    {kind: "photo", id: "p01", src: studentWork1, alt: "Робота студента 1"},
    {kind: "photo", id: "p02", src: studentWork2, alt: "Робота студента 2"},
    {kind: "photo", id: "p03", src: studentWork3, alt: "Робота студента 3"},
    {kind: "photo", id: "p04", src: studentWork4, alt: "Робота студента 4"},
    {kind: "photo", id: "p05", src: studentWork5, alt: "Робота студента 5"},
    {kind: "photo", id: "p06", src: studentWork6, alt: "Робота студента 6"},
    {kind: "photo", id: "p07", src: studentWork7, alt: "Робота студента 7"},
    {kind: "photo", id: "p08", src: studentWork8, alt: "Робота студента 8"},
    {kind: "photo", id: "p09", src: studentWork9, alt: "Робота студента 9"},
    {kind: "photo", id: "p10", src: studentWork10, alt: "Робота студента 10"},
    {kind: "photo", id: "p11", src: studentWork11, alt: "Робота студента 11"},
];

const StudentGallery: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const pauseAutoScroll = useAutoScroll(scrollRef);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        pauseAutoScroll();

        const scrollAmount = window.innerWidth < 768 ? 260 : 380;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <section className="overflow-hidden bg-black px-4 py-10 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 text-center md:mb-12">
                    <h2 className="font-brutal text-2xl font-black uppercase leading-[1.1] tracking-tighter text-white md:text-4xl">
                        Роботи студентів
                    </h2>
                    <p className="mt-3 text-sm font-bold uppercase tracking-widest text-purple-500 md:text-base">
                        Зроблено на інтенсиві HOLYSTUDIO
                    </p>
                </div>

                <div className="group relative w-full">
                    <div
                        ref={scrollRef}
                        className="no-scrollbar flex gap-4 overflow-x-auto pb-6 md:gap-6"
                        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                    >
                        {slides.map((slide) => (
                            <div
                                key={slide.id}
                                className="relative shrink-0 overflow-hidden border-zinc-800 bg-zinc-950 shadow-2xl transition-colors duration-300 hover:border-white/60 w-[62vw] sm:w-[260px] md:w-[300px] brutalist-border"
                            >
                                <div className="aspect-[9/16] w-full bg-black">
                                    {slide.kind === "video" ? (
                                        <VideoEmbed
                                            videoId={slide.videoId}
                                            title={`Відео-робота студента ${slide.id}`}
                                            isVertical
                                        />
                                    ) : (
                                        <img
                                            src={slide.src}
                                            alt={slide.alt}
                                            className="h-full w-full object-cover object-center"
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-black bg-white font-black text-black transition-all hover:bg-purple-500 hover:text-white md:-left-5 brutalist-border"
                        aria-label="Прокрутити вліво"
                    >
                        ←
                    </button>

                    <button
                        onClick={() => scroll("right")}
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

export default StudentGallery;
