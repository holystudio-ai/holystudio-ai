import React from 'react';
import offers from "../../assets/images/offers.webp";
import GraduateBadge from "@/src/components/sections/split/GraduateBadge.tsx";

/**
 * "Спрос на продукт" — the market-demand block: the vacancies/offers image
 * plus the offer plate (and optional "graduates get hired" sticker).
 *
 * Extracted out of Hero so it can be placed as its own section anywhere on the
 * page. Renders inline (a fragment) when embedded inside Hero's column
 * (`standalone={false}`), or as a full self-contained `<section>` when placed
 * standalone (`standalone`).
 */

const DEFAULT_TITLE = 'НЕ ПРОСПИ...';
const DEFAULT_DETAILS =
    'МОЖЛИВІСТЬ ОПАНУВАТИ ГЕНЕРАТИВНИЙ AI ЗАРАЗ, ЩОБ ПЕРЕТВОРИТИ СВОЇ ІДЕЇ НА ПРОФЕСІЙНИЙ КОНТЕНТ І ЗІРВАТИ КУШ $$$ НОВОЇ ЦИФРОВОЇ ЕРИ, ПОКИ ІНШІ ЗВОЛІКАЮТЬ';

interface DemandSectionProps {
    /** Ref forwarded to the offers image wrapper (used by the floating CTA observer). */
    offersRef?: React.Ref<HTMLDivElement>;
    /** Offer plate title. */
    offerTitle?: string;
    /** Offer plate body text (a string, or rich content with accented words). */
    offerDetails?: React.ReactNode;
    /** Show the round "graduates get hired" sticker over the offers image. */
    showGraduateBadge?: boolean;
    /** true = own <section> with spacing; false = inline fragment inside Hero's column. */
    standalone?: boolean;
    /** Separate the title and the body text with a full paragraph gap. */
    titleGap?: boolean;
}

const DemandSection: React.FC<DemandSectionProps> = ({
    offersRef,
    offerTitle = DEFAULT_TITLE,
    offerDetails = DEFAULT_DETAILS,
    showGraduateBadge = false,
    standalone = false,
    titleGap = false,
}) => {
    const inner = (
        <>
            <div
                ref={offersRef}
                className="relative w-[110%] -ml-[5%] md:w-full md:ml-0 lg:w-[85%] lg:mx-auto"
            >
                <img
                    src={offers}
                    alt="Special offers"
                    loading="lazy"
                    decoding="async"
                    className="block w-full h-auto object-contain"
                />

                {showGraduateBadge && <GraduateBadge/>}
            </div>

            {(offerTitle || offerDetails) && (
                <div className="border-2 border-white bg-black px-4 py-5 md:px-5 md:py-6 text-white">
                    <h4 className={`text-[16px] sm:text-[18px] md:text-[28px] font-black uppercase leading-none ${titleGap ? 'mb-4 md:mb-6' : 'mb-1'}`}>
                        {offerTitle}
                    </h4>

                    <p className="text-[13px] sm:text-[14px] md:text-[22px] leading-tight opacity-90">
                        {offerDetails}
                    </p>
                </div>
            )}
        </>
    );

    if (!standalone) {
        return inner;
    }

    return (
        <section className="overflow-x-hidden bg-black px-4 py-10 md:py-16 font-brutal">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                {inner}
            </div>
        </section>
    );
};

export default DemandSection;
