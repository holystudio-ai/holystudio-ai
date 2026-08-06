import heroSplitDesktop from "@/src/assets/images/hero-split-desktop.webp";
import heroSplitMobile from "@/src/assets/images/hero-split-mobile.webp";
import heroSplitV2Desktop from "@/src/assets/images/hero-splitv2-desktop.webp";
import heroSplitV2Mobile from "@/src/assets/images/hero-splitv2-mobile.webp";

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
    // TODO: swap in the new offer banners (desktop + mobile per variant) once the
    // client sends them — until then 3/4/5 reuse splitv2's artwork and are only
    // useful for checking that the routes resolve.
    {
        slug: 'split3',
        imageDesktop: heroSplitV2Desktop,
        imageMobile: heroSplitV2Mobile,
    },
    {
        slug: 'split4',
        imageDesktop: heroSplitV2Desktop,
        imageMobile: heroSplitV2Mobile,
    },
    {
        slug: 'split5',
        imageDesktop: heroSplitV2Desktop,
        imageMobile: heroSplitV2Mobile,
    },
];
