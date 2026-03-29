import React, { useEffect, useMemo, useState } from 'react';

type VideoEmbedProps = {
    videoId: string;
    title: string;
    isVertical?: boolean;
};

const VideoEmbed: React.FC<VideoEmbedProps> = ({
                                                   videoId,
                                                   title,
                                                   isVertical = false,
                                               }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [thumbnailSrc, setThumbnailSrc] = useState(
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    );

    useEffect(() => {
        setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
        setIsOpen(false);
    }, [videoId]);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleThumbnailError = () => {
        if (thumbnailSrc.includes('maxresdefault')) {
            setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/sddefault.jpg`);
            return;
        }

        if (thumbnailSrc.includes('sddefault')) {
            setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        }
    };

    const embedUrl = useMemo(() => {
        const params = new URLSearchParams({
            autoplay: '1',
            controls: '1',
            rel: '0',
            playsinline: '1',
            modestbranding: '1',
            iv_load_policy: '3',
            fs: '1',
            hd: '1',
            enablejsapi: '1',
        });

        return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
    }, [videoId]);

    return (
        <>
            <div className="relative h-full w-full overflow-hidden bg-black">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label={`Відкрити відео ${title}`}
                    className="absolute inset-0 z-10 block h-full w-full"
                >
                    <img
                        src={thumbnailSrc}
                        alt={title}
                        onError={handleThumbnailError}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                    />

                    <div className="absolute inset-0 bg-black/20 transition duration-300 hover:bg-black/35" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-xl transition-transform duration-300 hover:scale-105 md:h-20 md:w-20">
                            <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white md:border-y-[12px] md:border-l-[20px]" />
                        </div>
                    </div>
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 px-4 py-6 md:px-8"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={`relative w-full ${
                            isVertical ? 'max-w-[520px]' : 'max-w-[1400px]'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Закрити відео"
                            className="absolute -top-12 right-0 z-20 flex h-10 w-10 items-center justify-center border border-white/20 bg-black text-white transition hover:border-white hover:bg-white hover:text-black"
                        >
                            ✕
                        </button>

                        <div className="relative w-full overflow-hidden border border-white/15 bg-black shadow-2xl">
                            <div
                                className={`w-full ${
                                    isVertical
                                        ? 'aspect-[9/16] max-h-[88vh]'
                                        : 'aspect-video'
                                }`}
                            >
                                <iframe
                                    key={`${videoId}-modal`}
                                    className="h-full w-full"
                                    src={embedUrl}
                                    title={title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-black uppercase tracking-wide text-white md:text-base">
                                {title}
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="shrink-0 border-4 border-white bg-transparent px-4 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
                            >
                                Закрити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoEmbed;