import React, {lazy, Suspense, useEffect, useState} from 'react';
import Hero from "@/src/components/sections/Hero.tsx";
import Audience from "@/src/components/sections/Audience.tsx";
import Pricing from "@/src/components/sections/Pricing.tsx";
import {coursePriceUah} from '@/src/lib/pricing.ts';
import Seo from "@/src/components/features/Seo.tsx";
import {buildCourseSchema} from "@/src/lib/seo.ts";
import {redirectToPayment} from "@/src/lib/payment.ts";

const ResultsGallery = lazy(() => import("@/src/components/sections/ResultsGallery.tsx"));
const Team = lazy(() => import("@/src/components/sections/Team.tsx"));
const Program = lazy(() => import("@/src/components/sections/Program.tsx"));
const SkillsSection = lazy(() => import("@/src/components/sections/SkillsSection.tsx"));
const Guarantee = lazy(() => import("@/src/components/sections/Guarantee.tsx"));
const StudentsWorks = lazy(() => import("@/src/components/sections/StudentWorks.tsx"));
const FAQ = lazy(() => import("@/src/components/sections/FAQ.tsx"));

const priceValue = String(coursePriceUah);

const HomePage = () => {
    const [showFloatingCta, setShowFloatingCta] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingCta(window.scrollY > 96);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <Seo
                title="AI Creative Intensive"
                description="Онлайн-інтенсив від HOLYSTUDIO: навчись створювати AI фото та відео кінематографічної якості з нуля за 5 днів. Програма, кейси, гарантія та спеціальна ціна."
                structuredData={buildCourseSchema(priceValue)}
            />
            <main>
                <Hero/>

                <Audience/>

                <Suspense fallback={null}>
                    <ResultsGallery/>
                </Suspense>

                <Suspense fallback={null}>
                    <Team/>
                </Suspense>

                <Suspense fallback={null}>
                    <Program/>
                </Suspense>

                <Pricing badge={true} text="Не проґав можливість бути першим і зірвати куш $$$"
                         title={"спеціальна пропозиція"} showTimer/>

                <Suspense fallback={null}>
                    <SkillsSection/>
                </Suspense>

                <Suspense fallback={null}>
                    <Guarantee/>
                </Suspense>

                <Suspense fallback={null}>
                    <StudentsWorks/>
                </Suspense>


                <section className=" pb-8 px-4 bg-black">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div
                            className="bg-black text-white py-8 px-6 border-2 border-white">
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl md:text-4xl font-black font-brutal leading-none uppercase tracking-tighter">
                                    Спробуй професію майбутнього без ризику
                                </h2>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <Pricing badge={true} title={"спеціальна пропозиція"}
                                     text={"Ти нічого не втрачаєш, окрім можливості бути першим."}
                                     id="bottom-pricing" isEmbedded={true} showTimer/>
                        </div>
                    </div>
                </section>

                <Suspense fallback={null}>
                    <FAQ/>
                </Suspense>
            </main>

            <div
                className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-all duration-300 ${
                    showFloatingCta
                        ? 'translate-y-0 opacity-100 pointer-events-auto'
                        : 'translate-y-6 opacity-0 pointer-events-none'
                }`}
            >
                <button
                    onClick={redirectToPayment}
                    className="bg-purple-600 text-white px-6 py-4 font-black text-sm sm:text-base uppercase brutalist-border border-white transition-all font-brutal inline-block text-center"
                >
                    Залетіти в навчання
                </button>
            </div>
        </div>
    );
};

export default HomePage;
