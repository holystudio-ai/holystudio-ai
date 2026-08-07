import heroSplitDesktop from "@/src/assets/images/hero-split-desktop.webp";
import heroSplitMobile from "@/src/assets/images/hero-split-mobile.webp";
import heroSplitV2Desktop from "@/src/assets/images/hero-splitv2-desktop.webp";
import heroSplitV2Mobile from "@/src/assets/images/hero-splitv2-mobile.webp";
import offer01 from "@/src/assets/images/offer01.png";
import offer02 from "@/src/assets/images/offer02.png";
import offer03 from "@/src/assets/images/offer03.png";

export interface SplitVariant {
    /** Route path without the leading slash — this is the link media buyers get. */
    slug: string;
    imageDesktop: string;
    imageMobile: string;
    /** Own SmartSender deep link; without it every variant's leads land in one bucket. */
    ctaHref?: string;
    noindex?: boolean;
}

/**
 * Every split-test landing is the same page with different hero artwork — the
 * offer copy is baked into the image. Adding a variant means adding a line here.
 *
 * split3/4/5 only got vertical creatives from the client; the same file is used
 * for both breakpoints so every device shows the tested offer.
 */
export const SPLIT_VARIANTS: SplitVariant[] = [
    {
        slug: 'split',
        imageDesktop: heroSplitDesktop,
        imageMobile: heroSplitMobile,
    },
    {
        slug: 'splitv2',
        imageDesktop: heroSplitV2Desktop,
        imageMobile: heroSplitV2Mobile,
    },
    {
        slug: 'split3',
        imageDesktop: offer01,
        imageMobile: offer01,
    },
    {
        slug: 'split4',
        imageDesktop: offer02,
        imageMobile: offer02,
    },
    {
        slug: 'split5',
        imageDesktop: offer03,
        imageMobile: offer03,
    },
];
