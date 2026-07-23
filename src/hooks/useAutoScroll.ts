import {useCallback, useEffect, useRef} from 'react';

/**
 * Slowly auto-scrolls a horizontal slider sideways, looping back to the start
 * when it reaches the end. Pauses while the user hovers, touches or drags the
 * slider, and resumes shortly after.
 *
 * Returns a `pause()` callback — call it from arrow buttons so the auto-scroll
 * doesn't fight the browser's smooth-scroll animation.
 */
export const useAutoScroll = (
    ref: React.RefObject<HTMLElement | null>,
    {enabled = true, speed = 24, resumeDelay = 2500}: {
        enabled?: boolean;
        /** Pixels per second. */
        speed?: number;
        /** Ms of idle time before auto-scroll resumes after user interaction. */
        resumeDelay?: number;
    } = {}
) => {
    const pauseRef = useRef<() => void>(() => {});

    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let frameId = 0;
        let pausedUntil = 0;
        let hovered = false;
        let lastTime = 0;
        // Sub-pixel position kept here: `scrollLeft` is rounded to whole pixels in
        // some browsers (notably iOS Safari), so writing tiny per-frame increments
        // straight to it would round away to zero and the slider would never move.
        let position = el.scrollLeft;
        let applied = el.scrollLeft;

        const pause = () => {
            pausedUntil = Date.now() + resumeDelay;
        };

        pauseRef.current = pause;

        const onEnter = () => {
            hovered = true;
        };

        const onLeave = () => {
            hovered = false;
            pause();
        };

        const tick = (time: number) => {
            frameId = window.requestAnimationFrame(tick);

            const delta = lastTime ? (time - lastTime) / 1000 : 0;
            lastTime = time;

            if (hovered || Date.now() < pausedUntil) {
                position = el.scrollLeft;
                applied = el.scrollLeft;
                return;
            }

            const maxScroll = el.scrollWidth - el.clientWidth;
            if (maxScroll <= 0) return;

            // Scrolled by someone else (swipe, scrollbar, arrow button) — back off.
            if (Math.abs(el.scrollLeft - applied) > 1.5) {
                pause();
                position = el.scrollLeft;
                applied = el.scrollLeft;
                return;
            }

            position += speed * delta;
            if (position >= maxScroll) position = 0;

            el.scrollLeft = position;
            applied = el.scrollLeft;
        };

        frameId = window.requestAnimationFrame(tick);

        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('touchstart', pause, {passive: true});
        el.addEventListener('touchmove', pause, {passive: true});
        el.addEventListener('wheel', pause, {passive: true});

        return () => {
            window.cancelAnimationFrame(frameId);
            pauseRef.current = () => {};
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('touchstart', pause);
            el.removeEventListener('touchmove', pause);
            el.removeEventListener('wheel', pause);
        };
    }, [ref, enabled, speed, resumeDelay]);

    return useCallback(() => pauseRef.current(), []);
};

export default useAutoScroll;
