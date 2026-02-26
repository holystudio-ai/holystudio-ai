import React from 'react';
import Header from '@/src/components/layout/Header.tsx';
import Hero from '@/src/components/Hero';
import Audience from '@/src/components/Audience';
import Team from '@/src/components/Team';
import Program from '@/src/components/Program';
import Pricing from '@/src/components/Pricing';
import FAQ from '@/src/components/FAQ';
import Guarantee from '@/src/components/Guarantee';
import Footer from '@/src/components/layout/Footer.tsx';
import ResultsGallery from '@/src/components/ResultsGallery';
import SkillsSection from "@/src/components/SkillsSection.tsx";
import StudentsWorks from "@/src/components/StudentWorks.tsx";

const App: React.FC = () => {
    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <Header/>

            <main>
                <Hero/>

                <Audience/>

                <ResultsGallery/>

                <Team/>

                <Program/>

                <Pricing badge={true} text="ЩОБ СТАТИ РАННЬОЮ ПТАШКОЮ І НЕ ЛИТИ СЛЬОЗИ ПІЗНІШЕ" title={"спеціальна пропозиція"}/>

                <SkillsSection/>

                <Guarantee/>

                <StudentsWorks/>


                <section className="pt-12 pb-16 px-4 bg-black border-t-2 border-purple-600">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <div
                            className="bg-black text-white py-8 px-6 border-2 border-white">
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl md:text-4xl font-black font-brutal leading-none uppercase tracking-tighter">
                                    РАННІ ПТАШКИ РОСУ П’ЮТЬ, А ПІЗНІ - СЛЬОЗИ ЛЛЮТЬ*
                                </h2>
                                <p className="text-xs md:text-sm font-bold border-l-4 border-purple-500 pl-4 font-brutal opacity-80 uppercase max-w-2xl">
                                    *народна приказка підкреслює, що найкращі результати дістаються тим, хто не
                                    зволікає.
                                </p>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <Pricing badge={true} title={"спеціальна пропозиція"} text={"770 грн щоб забрати свою диню, а тим хто вагається лишимо тільки лушпиння"} id="bottom-pricing" isEmbedded={true}/>
                        </div>
                    </div>
                </section>

                <FAQ/>

            </main>
            <Footer/>
        </div>
    );
};

export default App;