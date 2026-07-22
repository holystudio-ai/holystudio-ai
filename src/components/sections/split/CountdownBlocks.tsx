import React, {useEffect, useRef, useState} from 'react';

/**
 * Brutalist countdown cells (год / хв / сек) used under the split-test CTAs.
 * The deadline lives only in memory, so it starts fresh on every page load and
 * loops back to `minutes` when it hits zero — same behaviour as the Pricing card.
 */

interface CountdownBlocksProps {
    /** Countdown duration in minutes. */
    minutes?: number;
    className?: string;
}

const formatTimeLeft = (totalSeconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));

    return {
        hours: String(Math.floor(safeSeconds / 3600)).padStart(2, '0'),
        minutes: String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0'),
        seconds: String(safeSeconds % 60).padStart(2, '0'),
    };
};

const CountdownBlocks: React.FC<CountdownBlocksProps> = ({minutes = 10, className = ''}) => {
    const deadlineRef = useRef<number | null>(null);

    const getTimeLeft = React.useCallback(() => {
        const durationMs = minutes * 60 * 1000;

        if (deadlineRef.current === null || deadlineRef.current <= Date.now()) {
            deadlineRef.current = Date.now() + durationMs;
        }

        return formatTimeLeft((deadlineRef.current - Date.now()) / 1000);
    }, [minutes]);

    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        setTimeLeft(getTimeLeft());

        const intervalId = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => window.clearInterval(intervalId);
    }, [getTimeLeft]);

    const items = [
        {value: timeLeft.hours, label: 'год'},
        {value: timeLeft.minutes, label: 'хв'},
        {value: timeLeft.seconds, label: 'сек'},
    ];

    return (
        <div className={`grid w-full grid-cols-3 gap-2.5 md:gap-4 ${className}`}>
            {items.map((item) => (
                <div
                    key={item.label}
                    className="flex h-[76px] flex-col items-center justify-center border-4 border-black bg-white px-2 text-center shadow-[5px_5px_0px_0px_#a855f7] md:h-[94px]"
                >
                    <div className="font-brutal text-[34px] font-black leading-none tracking-tight text-black md:text-[46px]">
                        {item.value}
                    </div>
                    <div className="mt-1 font-brutal text-[9px] font-black uppercase leading-none tracking-widest text-purple-600 md:text-[11px]">
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CountdownBlocks;
