import React from 'react';
import Hero from "@/src/components/sections/Hero.tsx";
import Audience from "@/src/components/sections/Audience.tsx";
import ResultsGallery from "@/src/components/sections/ResultsGallery.tsx";
import Team from "@/src/components/sections/Team.tsx";
import Program from "@/src/components/sections/Program.tsx";
import Pricing from "@/src/components/sections/Pricing.tsx";
import SkillsSection from "@/src/components/sections/SkillsSection.tsx";
import Guarantee from "@/src/components/sections/Guarantee.tsx";
import StudentsWorks from "@/src/components/sections/StudentWorks.tsx";
import FAQ from "@/src/components/sections/FAQ.tsx";

const HomePage = () => {
    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <main>
                <Hero/>

                <Audience/>

                <ResultsGallery/>

                <Team/>

                <Program/>

                <Pricing badge={true} text="ЩОБ СТАТИ РАННЬОЮ ПТАШКОЮ І НЕ ЛИТИ СЛЬОЗИ ПІЗНІШЕ"
                         title={"спеціальна пропозиція"}/>

                <SkillsSection/>

                <Guarantee/>

                <StudentsWorks/>


                <section className="pt-12 pb-16 px-4 bg-black border-t-2 border-purple-600">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div
                            className="bg-black text-white py-8 px-6 border-2 border-white">
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl md:text-4xl font-black font-brutal leading-none uppercase tracking-tighter">
                                    Першому диня, а останньому лушпиння*
                                </h2>
                                <p className="text-xs md:text-sm font-bold border-l-4 border-purple-500 pl-4 font-brutal opacity-80 uppercase max-w-2xl">
                                    *популярний вираз про важливість швидкості: хто встиг першим, той забрав найкраще.
                                </p>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <Pricing badge={true} title={"спеціальна пропозиція"}
                                     text={"770 грн щоб забрати свою диню, а тим хто вагається лишимо тільки лушпиння"}
                                     id="bottom-pricing" isEmbedded={true}/>
                        </div>
                    </div>
                </section>

                <FAQ/>
            </main>
        </div>
    );
};

export default HomePage;