import React from 'react';

interface GraduateBadgeProps {
    /** Extra classes to position the badge within its (relative) container. */
    className?: string;
}

/**
 * Round "graduates get hired" sticker overlaid on the hero offer image
 * (split-test variant).
 */
const GraduateBadge: React.FC<GraduateBadgeProps> = ({className = ''}) => {
    return (
        <div
            className={`pointer-events-none absolute -right-2 -top-4 z-20 flex h-[112px] w-[112px] rotate-[-8deg] items-center justify-center rounded-full border-4 border-black bg-purple-600 p-2 text-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:-right-4 md:-top-6 md:h-[150px] md:w-[150px] ${className}`}
        >
            <span className="font-brutal text-[9px] font-black uppercase leading-[1.1] tracking-tight text-white md:text-[12px]">
                Найкращі випускники отримують роботу та оплачувані замовлення у HOLYSTUDIO
            </span>
        </div>
    );
};

export default GraduateBadge;
