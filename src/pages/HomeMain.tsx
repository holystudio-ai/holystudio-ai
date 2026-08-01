import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import Hero from "@/src/components/sections/Hero.tsx";
import DemandSection from "@/src/components/sections/DemandSection.tsx";
import Audience from "@/src/components/sections/Audience.tsx";
import Seo from "@/src/components/features/Seo.tsx";
import {buildCourseSchema} from "@/src/lib/seo.ts";
import heroSplitDesktop from "@/src/assets/images/hero-splitv2-desktop.webp";
import heroSplitMobile from "@/src/assets/images/hero-splitv2-mobile.webp";

const ResultsGallery = lazy(() => import("@/src/components/sections/ResultsGallery.tsx"));
const Team = lazy(() => import("@/src/components/sections/Team.tsx"));
const Program = lazy(() => import("@/src/components/sections/Program.tsx"));
const SkillsSection = lazy(() => import("@/src/components/sections/SkillsSection.tsx"));
const Guarantee = lazy(() => import("@/src/components/sections/Guarantee.tsx"));
const StudentGallery = lazy(() => import("@/src/components/sections/split/StudentGallery.tsx"));
const FAQ = lazy(() => import("@/src/components/sections/FAQ.tsx"));
const SplitCourseBlock = lazy(() => import("@/src/components/sections/split/SplitCourseBlock.tsx"));
const Testimonials = lazy(() => import("@/src/components/sections/split/Testimonials.tsx"));

// Countdown timer resets 10 minutes from the visitor's first visit.
const MAIN_TIMER_MODE = 'countdown' as const;

// Main-landing pricing: full ~1000 → 490 грн.
const MAIN_PRICE = 490;
const MAIN_OLD_PRICE = '1 000';

const OFFER_TITLE = 'ДОСИТЬ ДИВИТИСЯ НА ВАКАНСІЇ — СТАВАЙ ТИМ, КОГО ШУКАЮТЬ';

// Accented words are highlighted in purple (per the edits brief, point 5).
// Sentence case on purpose — the all-caps version was hard to read.
const OFFER_DETAILS = (
    <>
        Поки інші зволікають, наші випускники{' '}
        <span className="text-purple-500">вже заробляють.</span> Ми забираємо топових студентів{' '}
        <span className="text-purple-500">у команду HOLYSTUDIO</span> на оплачувані замовлення вже
        під час навчання. Опануй AI зараз і отримай роботу в кращому AI відео-продакшні країни
        швидше, ніж встигнеш додивитися цей курс.
    </>
);

// CTA label used on all timer/pricing cards.
const MAIN_CTA = 'ЗРОБИТИ ПРОРИВ В AI!';

// Main-landing Telegram deep link (same one the old `/` page and the header CTA use).
const MAIN_CTA_HREF = 'https://telegram.me/HOLYSTUDIO_AI_bot?start=ZGw6MzI3OTcz';

// The on-page offer block (HOLYSTUDIO AI CREATOR) — timer CTAs scroll here, and
// the floating CTA hides while it's on screen.
const OFFER_BLOCK_ID = 'main-offer-block';

const scrollToOfferBlock = (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById(OFFER_BLOCK_ID)?.scrollIntoView({behavior: 'smooth', block: 'start'});
};

const HomeMain = () => {
    const offersRef = useRef<HTMLDivElement>(null);
    const offerBlockRef = useRef<HTMLDivElement>(null);
    const [pastOffers, setPastOffers] = useState(false);
    const [offerBlockVisible, setOfferBlockVisible] = useState(false);

    useEffect(() => {
        const el = offersRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setPastOffers(entry.isIntersecting || entry.boundingClientRect.top < 0);
            },
            {threshold: 0.15, rootMargin: '0px 0px -10% 0px'}
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Hide the floating CTA while the offer block (its scroll target) is visible.
    useEffect(() => {
        const el = offerBlockRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setOfferBlockVisible(entry.isIntersecting),
            {threshold: 0.12}
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const showFloatingCta = pastOffers && !offerBlockVisible;

    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <Seo
                title="AI Creative Intensive"
                description="Онлайн-інтенсив від HOLYSTUDIO: навчись створювати AI фото та відео кінематографічної якості з нуля за 5 днів. Програма, кейси, гарантія та спеціальна ціна."
                structuredData={buildCourseSchema(String(MAIN_PRICE))}
            />
            <main>
                {/* 01. Головний екран — офер без заголовка, бейджа та лого */}
                <Hero
                    timerMode={MAIN_TIMER_MODE}
                    price={MAIN_PRICE}
                    oldPrice={MAIN_OLD_PRICE}
                    renderDemand={false}
                    showHeadlinePlate={false}
                    ctaText={MAIN_CTA}
                    ctaHref={MAIN_CTA_HREF}
                    ctaScrollToId={OFFER_BLOCK_ID}
                    wideMobile
                    showBadge={false}
                    imageDesktop={heroSplitDesktop}
                    imageMobile={heroSplitMobile}
                />

                {/* 02. Роботи студентів — один слайдер: спочатку відео, потім фото */}
                <Suspense fallback={null}>
                    <StudentGallery/>
                </Suspense>

                {/* 03. Спрос на продукт — окрема секція (винесена з Hero) */}
                <DemandSection
                    standalone
                    offersRef={offersRef}
                    offerTitle={OFFER_TITLE}
                    offerDetails={OFFER_DETAILS}
                    showGraduateBadge
                    titleGap
                />

                {/* 04. Кому підходить */}
                <Audience/>

                {/* 05. Програма курсу */}
                <Suspense fallback={null}>
                    <Program/>
                </Suspense>

                {/* 06. Результат після програми */}
                <Suspense fallback={null}>
                    <ResultsGallery/>
                </Suspense>

                {/* 07. Про відео продакшн + автори (об'єднано в Team) */}
                <Suspense fallback={null}>
                    <Team productionVariant="split" sliderAutoScroll/>
                </Suspense>

                {/* 08. 300+ студентів — відгуки (новий блок) */}
                <Suspense fallback={null}>
                    <Testimonials/>
                </Suspense>

                {/* 09. Контент курсу + офер (окремий блок з таймером після відгуків прибрано) */}
                <div id={OFFER_BLOCK_ID} ref={offerBlockRef} className="scroll-mt-20">
                    <Suspense fallback={null}>
                        <SplitCourseBlock
                            ctaHref={MAIN_CTA_HREF}
                            price={MAIN_PRICE}
                            oldPrice={MAIN_OLD_PRICE}
                        />
                    </Suspense>
                </div>

                {/* 10. Гарантія + «dont scroll the future» (після оферу, за брифом) */}
                <Suspense fallback={null}>
                    <Guarantee/>
                </Suspense>

                <Suspense fallback={null}>
                    <SkillsSection/>
                </Suspense>

                {/* 11. FAQ */}
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
                <a
                    href={`#${OFFER_BLOCK_ID}`}
                    onClick={scrollToOfferBlock}
                    className="button bg-purple-600 text-white px-6 py-4 font-black text-sm sm:text-base uppercase brutalist-border border-white transition-all font-brutal inline-block text-center"
                >
                    Залетіти в навчання
                </a>
            </div>
        </div>
    );
};

export default HomeMain;
