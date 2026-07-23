import React from 'react';
import badgeImage from '../../../assets/images/cta-badge.webp';

interface GraduateBadgeProps {
    /** Extra classes to position the badge within its (relative) container. */
    className?: string;
}

/**
 * Round "graduates get hired" sticker overlaid on the hero offer image
 * (split-test variant). The sticker is a ready-made image — the copy lives in
 * the artwork itself and is duplicated in `alt` for screen readers.
 */
const GraduateBadge: React.FC<GraduateBadgeProps> = ({className = ''}) => {
    return (
        <img
            src={badgeImage}
            alt="Найкращі випускники отримують роботу та оплачувані замовлення у HOLYSTUDIO"
            loading="lazy"
            className={`pointer-events-none absolute -right-2 -top-4 z-20 h-[112px] w-[112px] rotate-[-8deg] object-contain md:-right-6 md:-top-8 md:h-[200px] md:w-[200px] lg:h-[230px] lg:w-[230px] ${className}`}
        />
    );
};

export default GraduateBadge;
