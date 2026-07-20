import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import Hero from "@/src/components/sections/Hero.tsx";
import DemandSection from "@/src/components/sections/DemandSection.tsx";
import Audience from "@/src/components/sections/Audience.tsx";
import Pricing from "@/src/components/sections/Pricing.tsx";
import {coursePriceUah} from '@/src/lib/pricing.ts';
import Seo from "@/src/components/features/Seo.tsx";
import {buildCourseSchema} from "@/src/lib/seo.ts";

const ResultsGallery = lazy(() => import("@/src/components/sections/ResultsGallery.tsx"));
const Team = lazy(() => import("@/src/components/sections/Team.tsx"));
const Program = lazy(() => import("@/src/components/sections/Program.tsx"));
const SkillsSection = lazy(() => import("@/src/components/sections/SkillsSection.tsx"));
const Guarantee = lazy(() => import("@/src/components/sections/Guarantee.tsx"));
const StudentsWorks = lazy(() => import("@/src/components/sections/StudentWorks.tsx"));
const StudentVideos = lazy(() => import("@/src/components/sections/StudentVideos.tsx"));
const FAQ = lazy(() => import("@/src/components/sections/FAQ.tsx"));
const SplitCourseBlock = lazy(() => import("@/src/components/sections/split/SplitCourseBlock.tsx"));
const Testimonials = lazy(() => import("@/src/components/sections/split/Testimonials.tsx"));

const priceValue = String(coursePriceUah);

// Countdown timer resets 10 minutes from the visitor's first visit to /split.
const SPLIT_TIMER_MODE = 'countdown' as const;

// Split-test pricing (independent of the live `/` price env): full ~1000 → 390 грн.
const SPLIT_PRICE = 390;
const SPLIT_OLD_PRICE = '1 000';

const OFFER_TITLE = 'ДОСИТЬ ДИВИТИСЯ НА ВАКАНСІЇ — СТАВАЙ ТИМ, КОГО ШУКАЮТЬ';
const OFFER_DETAILS =
    'ПОКИ ІНШІ ЗВОЛІКАЮТЬ, НАШІ ВИПУСКНИКИ ВЖЕ ЗАРОБЛЯЮТЬ. МИ ЗАБИРАЄМО ТОПОВИХ СТУДЕНТІВ У КОМАНДУ HOLYSTUDIO НА ОПЛАЧУВАНІ ЗАМОВЛЕННЯ ВЖЕ ПІД ЧАС НАВЧАННЯ. ОПАНУЙ AI ЗАРАЗ І ОТРИМАЙ РОБОТУ В КРАЩОМУ AI ВІДЕО-ПРОДАКШНІ КРАЇНИ ШВИДШЕ, НІЖ ВСТИГНЕШ ДОДИВИТИСЯ ЦЕЙ КУРС.';

// New split-test hero offer (point 1 of the edits brief).
const HERO_OFFER = {
    heading: '5-денний інтенсив від АІ-продакшена',
    offer: 'Навчись з нуля генерувати АІ фото та відео за 5 днів.',
    text: 'Отримай систему створення кіношного контенту, яку ми використовуємо у своєму продакшені. Від першого промпта до готового ролика.',
    plashka: 'Твій перший професійний АІ-кейс у портфоліо за один робочий тиждень.',
} as const;

const STUDENTS_BADGE = '300+ учнів';

// CTA label used on all split-test timer/pricing cards.
const SPLIT_CTA = 'ЗРОБИТИ ПРОРИВ В AI!';

const HomeSplit = () => {
    const offersRef = useRef<HTMLDivElement>(null);
    const [showFloatingCta, setShowFloatingCta] = useState(false);

    useEffect(() => {
        const el = offersRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloatingCta(entry.isIntersecting || entry.boundingClientRect.top < 0);
            },
            {threshold: 0.15, rootMargin: '0px 0px -10% 0px'}
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen selection:bg-purple-500 selection:text-white">
            <Seo
                title="AI Creative Intensive"
                description="Онлайн-інтенсив від HOLYSTUDIO: навчись створювати AI фото та відео кінематографічної якості з нуля за 5 днів. Програма, кейси, гарантія та спеціальна ціна."
                structuredData={buildCourseSchema(priceValue)}
            />
            <main>
                {/* 01. Головний екран — новий офер + бейдж «300+ учнів» + лого */}
                <Hero
                    timerMode={SPLIT_TIMER_MODE}
                    price={SPLIT_PRICE}
                    oldPrice={SPLIT_OLD_PRICE}
                    heroOffer={HERO_OFFER}
                    studentsBadge={STUDENTS_BADGE}
                    showCompanyLogos
                    renderDemand={false}
                    ctaText={SPLIT_CTA}
                    timerBlocks
                />

                {/* 02. Кейси випускників / галерея робіт — фото + відео */}
                <Suspense fallback={null}>
                    <StudentsWorks/>
                    <StudentVideos/>
                </Suspense>

                {/* 03. Спрос на продукт — окрема секція (винесена з Hero) */}
                <DemandSection
                    standalone
                    offersRef={offersRef}
                    offerTitle={OFFER_TITLE}
                    offerDetails={OFFER_DETAILS}
                    showGraduateBadge
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
                    <Team productionVariant="split"/>
                </Suspense>

                {/* 08. 300+ студентів — відгуки (новий блок) */}
                <Suspense fallback={null}>
                    <Testimonials/>
                </Suspense>

                {/* 09. Блок з тарифом і офером */}
                <Pricing badge={true} text="Не проґав можливість бути першим і зірвати куш $$$"
                         title={"спеціальна пропозиція"} showTimer timerMode={SPLIT_TIMER_MODE}
                         price={SPLIT_PRICE} oldPrice={SPLIT_OLD_PRICE}
                         ctaText={SPLIT_CTA} timerBlocks/>

                {/* 09. Перероблена друга плашка — контент курсу в стилі Program */}
                <Suspense fallback={null}>
                    <SplitCourseBlock/>
                </Suspense>

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
                    href="https://telegram.me/HOLYSTUDIO_AI_bot?start=ZGw6MzI3OTcz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button bg-purple-600 text-white px-6 py-4 font-black text-sm sm:text-base uppercase brutalist-border border-white transition-all font-brutal inline-block text-center"
                >
                    Залетіти в навчання
                </a>
            </div>
        </div>
    );
};

export default HomeSplit;
