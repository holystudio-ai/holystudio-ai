import React, { useRef } from "react";

import studentWork1 from "../../assets/student-works/1.jpg";
import studentWork2 from "../../assets/student-works/2.jpg";
import studentWork3 from "../../assets/student-works/3.jpg";
import studentWork4 from "../../assets/student-works/4.jpg";
import studentWork5 from "../../assets/student-works/5.jpg";
import studentWork9 from "../../assets/student-works/9.jpg";
import studentWork10 from "../../assets/student-works/10.jpg";
import studentWork11 from "../../assets/student-works/11.jpg";
import studentWork12 from "../../assets/student-works/12.jpg";
import studentWork13 from "../../assets/student-works/13.jpg";

const StudentsWorks: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const images = [
        { id: "01", src: studentWork1, alt: "Student work 1" },
        { id: "02", src: studentWork2, alt: "Student work 2" },
        { id: "03", src: studentWork3, alt: "Student work 3" },
        { id: "04", src: studentWork4, alt: "Student work 4" },
        { id: "05", src: studentWork5, alt: "Student work 5" },
        { id: "09", src: studentWork9, alt: "Student work 9" },
        { id: "10", src: studentWork10, alt: "Student work 10" },
        { id: "11", src: studentWork11, alt: "Student work 11" },
        { id: "12", src: studentWork12, alt: "Student work 12" },
        { id: "13", src: studentWork13, alt: "Student work 13" },
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
        <section className="py-8 md:py-24 px-4 bg-black overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-black font-brutal leading-[1.1] tracking-tighter uppercase text-white">
                        Роботи студентів після проходження інтенсиву
                    </h2>
                </div>

                <div className="relative group w-full">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="snap-center shrink-0 w-[70vw] sm:w-[300px] md:w-[360px] aspect-[2/3] brutalist-border border-zinc-800 bg-zinc-950 relative overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/60"
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="absolute inset-0 h-full w-full object-cover object-center"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                            </div>
                        ))}
                    </div>

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
            `}</style>
        </section>
    );
};

export default StudentsWorks;
