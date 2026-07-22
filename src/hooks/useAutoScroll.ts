import {useEffect} from 'react';

/**
 * Slowly auto-scrolls a horizontal slider sideways, looping back to the start
 * when it reaches the end. Pauses while the user hovers, touches or drags the
 * slider, and resumes shortly after.
 */
export const useAutoScroll = (
    ref: React.RefObject<HTMLElement | null>,
    {enabled = true, speed = 0.35, resumeDelay = 2500}: {
        /** Pixels per animation frame (~60fps). */
        enabled?: boolean;
        speed?: number;
        /** Ms of idle time before auto-scroll resumes after user interaction. */
        resumeDelay?: number;
    } = {}
) => {
    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frameId = 0;
        let pausedUntil = 0;
        let hovered = false;
        let lastScrollLeft = el.scrollLeft;

        const pause = () => {
            pausedUntil = Date.now() + resumeDelay;
        };

        const onEnter = () => {
            hovered = true;
        };

        const onLeave = () => {
            hovered = false;
            pause();
        };

        const tick = () => {
            frameId = window.requestAnimationFrame(tick);

            if (hovered || Date.now() < pausedUntil) {
                lastScrollLeft = el.scrollLeft;
                return;
            }

            const maxScroll = el.scrollWidth - el.clientWidth;
            if (maxScroll <= 0) return;

            // The user grabbed the scrollbar / swiped — back off.
            if (Math.abs(el.scrollLeft - lastScrollLeft) > 2) {
                pause();
                lastScrollLeft = el.scrollLeft;
                return;
            }

            const next = el.scrollLeft + speed >= maxScroll ? 0 : el.scrollLeft + speed;
            el.scrollLeft = next;
            lastScrollLeft = el.scrollLeft;
        };

        frameId = window.requestAnimationFrame(tick);

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('touchstart', pause, {passive: true});
        el.addEventListener('touchmove', pause, {passive: true});
        el.addEventListener('wheel', pause, {passive: true});

        return () => {
            window.cancelAnimationFrame(frameId);
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('touchstart', pause);
            el.removeEventListener('touchmove', pause);
            el.removeEventListener('wheel', pause);
        };
    }, [ref, enabled, speed, resumeDelay]);
};

export default useAutoScroll;
