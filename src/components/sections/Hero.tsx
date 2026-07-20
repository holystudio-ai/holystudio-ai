import React from 'react';
import Pricing from "@/src/components/sections/Pricing.tsx";
import heroImage from "../../assets/images/hero-image.webp";
import heroImageMobile from "../../assets/images/hero-image-mobile.webp";
import DemandSection from "@/src/components/sections/DemandSection.tsx";

import companyLogo1 from '../../assets/company-logos/1.png';
import companyLogo2 from '../../assets/company-logos/2.png';
import companyLogo3 from '../../assets/company-logos/3.png';
import companyLogo4 from '../../assets/company-logos/4.png';
import companyLogo5 from '../../assets/company-logos/5.png';
import companyLogo6 from '../../assets/company-logos/6.png';
import companyLogo7 from '../../assets/company-logos/7.png';
import companyLogo8 from '../../assets/company-logos/8.png';
import companyLogo9 from '../../assets/company-logos/9.png';
import companyLogo10 from '../../assets/company-logos/10.png';
import companyLogo11 from '../../assets/company-logos/11.png';

const heroCompanyLogos = [
    companyLogo1, companyLogo2, companyLogo3, companyLogo4, companyLogo5, companyLogo6,
    companyLogo7, companyLogo8, companyLogo9, companyLogo10, companyLogo11,
];

/** New split-test hero offer (point 1 of the edits brief). */
export interface HeroOffer {
    heading: string;
    offer: string;
    text: string;
    plashka: string;
}

const heroBlock = {
    titleStart:
        "В НОВІЙ РЕАЛЬНОСТІ НЕЙРОМЕРЕЖІ ДАЮТЬ ОДНІЙ ЛЮДИНІ МОЖЛИВІСТЬ СТВОРЮВАТИ КОНТЕНТ, З ЯКИМ ",
    titleLight: "ЗАРОБЛЯЮТЬ ВІД 2000$",
    titleEnd: "",
};

interface HeroProps {
    offersRef?: React.Ref<HTMLDivElement>;
    /** Override the demand-block offer plate title (only when Hero renders DemandSection inline). */
    offerTitle?: string;
    /** Override the demand-block offer plate body text (only when Hero renders DemandSection inline). */
    offerDetails?: string;
    /** Show the round "graduates get hired" sticker over the offers image. */
    showGraduateBadge?: boolean;
    /** Timer mode forwarded to the hero Pricing card. */
    timerMode?: 'daily' | 'countdown';
    /** Discounted price forwarded to the hero Pricing card. */
    price?: number;
    /** Full/old price label forwarded to the hero Pricing card. */
    oldPrice?: string;
    /** New split-test offer copy — replaces the default headline plate. */
    heroOffer?: HeroOffer;
    /** Small pill shown in the offer plate (e.g. "300+ учнів"). */
    studentsBadge?: string;
    /** Show the "companies we collaborated with" logos strip (placeholder). */
    showCompanyLogos?: boolean;
    /** Render the "Спрос на продукт" (DemandSection) inline inside Hero. Defaults to true (original `/` layout). Set false when DemandSection is placed as its own section. */
    renderDemand?: boolean;
    /** CTA label forwarded to the hero Pricing card. */
    ctaText?: string;
    /** Render the hero Pricing countdown in the brutalist "program block" style. */
    timerBlocks?: boolean;
}

const Hero: React.FC<HeroProps> = ({
                                       offersRef,
                                       offerTitle,
                                       offerDetails,
                                       showGraduateBadge = false,
                                       timerMode = 'daily',
                                       price,
                                       oldPrice,
                                       heroOffer,
                                       studentsBadge,
                                       showCompanyLogos = false,
                                       renderDemand = true,
                                       ctaText,
                                       timerBlocks = false
                                   }) => {
    return (
        <section
            className="
                overflow-x-hidden px-4 pb-8 pt-20
                md:pb-10 md:pt-24

                max-[480px]:px-0
                max-[480px]:pt-[70px]
                max-[480px]:pb-8
            "
        >
            <div className="mx-auto max-w-7xl">
                <div
                    className="
                        overflow-visible border-4 border-black bg-black
                        max-[480px]:border-0
                    "
                >
                    <picture>
                        <source
                            media="(max-width: 480px)"
                            srcSet={heroImageMobile}
                        />

                        <img
                            src={heroImage}
                            alt="AI creative course hero"
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                            className="
                                block w-full object-cover object-center
                                h-auto max-h-[72svh]
                                md:max-h-[90svh]

                                max-[480px]:block
                                max-[480px]:h-auto
                                max-[480px]:max-h-none
                                max-[480px]:min-h-0
                                max-[480px]:w-full
                                max-[480px]:object-contain
                                max-[480px]:object-top
                            "
                        />
                    </picture>
                </div>

                <div
                    className="
                        relative z-10 mt-4 px-4

                        max-[480px]:mt-0
                        max-[480px]:px-4
                    "
                >
                    <Pricing
                        badge
                        showBonus
                        showTimer
                        timerMode={timerMode}
                        price={price}
                        oldPrice={oldPrice}
                        ctaText={ctaText}
                        timerBlocks={timerBlocks}
                    />
                </div>

                <div
                    className="
                        flex-box gap-10 items-start mt-12 font-brutal

                        max-[480px]:mt-8
                        max-[480px]:px-4
                    "
                >
                    <div
                        className="
                            flex flex-col gap-6 mt-12 w-full

                            max-[480px]:mt-6
                        "
                    >
                        {heroOffer ? (
                            <div className="border-2 border-white bg-black px-4 py-6 md:px-6 md:py-8 text-white text-center">
                                {studentsBadge && (
                                    <div className="mb-4 flex justify-center">
                                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-purple-500 bg-purple-600/15 px-4 py-1.5 font-brutal text-xs font-black uppercase tracking-widest text-white md:text-sm">
                                            <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
                                            {studentsBadge}
                                        </span>
                                    </div>
                                )}

                                <h2 className="text-[22px] sm:text-[28px] md:text-[42px] font-black uppercase leading-[1.02] tracking-tight">
                                    {heroOffer.heading}
                                </h2>

                                <p className="mt-3 text-[16px] sm:text-[18px] md:text-[24px] font-black uppercase leading-tight text-purple-400">
                                    {heroOffer.offer}
                                </p>

                                <p className="mt-3 text-[13px] sm:text-[15px] md:text-[18px] font-bold normal-case leading-snug text-white/80 max-w-2xl mx-auto">
                                    {heroOffer.text}
                                </p>

                                <div className="mt-5 inline-block border-2 border-dashed border-purple-500 bg-purple-600/10 px-4 py-3 md:px-5 md:py-4">
                                    <p className="text-[13px] sm:text-[15px] md:text-[18px] font-black uppercase leading-tight tracking-tight">
                                        {heroOffer.plashka}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            heroBlock && (
                                <div className="border-2 border-dashed border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white">
                                    <h3 className="text-[18px] sm:text-[22px] md:text-[34px] uppercase leading-[1.05] tracking-tight text-center font-black">
                                        {heroBlock.titleStart}
                                        <span className="font-normal">
                                            {heroBlock.titleLight}
                                        </span>
                                        {heroBlock.titleEnd}
                                    </h3>
                                </div>
                            )
                        )}

                        {showCompanyLogos && (
                            <div className="border-2 border-zinc-800 bg-black px-4 py-5 md:px-6 md:py-6">
                                <p className="mb-4 text-center font-brutal text-[11px] font-black uppercase tracking-[0.2em] text-white/50 md:text-xs">
                                    Компанії, з якими ми співпрацювали
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                                    {heroCompanyLogos.map((logo, index) => (
                                        <div
                                            key={`hero-logo-${index}`}
                                            className="flex h-[54px] w-[110px] shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] px-2 py-1.5 md:h-[64px] md:w-[140px] md:px-3 md:py-2"
                                        >
                                            <img
                                                src={logo}
                                                alt=""
                                                className="block max-h-full max-w-full object-contain object-center"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {renderDemand && (
                            <DemandSection
                                offersRef={offersRef}
                                offerTitle={offerTitle}
                                offerDetails={offerDetails}
                                showGraduateBadge={showGraduateBadge}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;