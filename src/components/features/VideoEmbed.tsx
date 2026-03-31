import React, { useEffect, useMemo, useState } from 'react';

type VideoEmbedProps = {
    videoId: string;
    title: string;
    isVertical?: boolean;
    thumbnail?: string;
};

const VideoEmbed: React.FC<VideoEmbedProps> = ({
                                                   videoId,
                                                   title,
                                                   isVertical = false,
                                                   thumbnail,
                                               }) => {
    const [isOpen, setIsOpen] = useState(false);

    const youtubeThumbnails = useMemo(
        () => [
            `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        ],
        [videoId]
    );

    const [thumbnailIndex, setThumbnailIndex] = useState(0);

    const thumbnailSrc = thumbnail || youtubeThumbnails[thumbnailIndex];

    useEffect(() => {
        setThumbnailIndex(0);
        setIsOpen(false);
    }, [videoId, thumbnail]);

    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';

        document.documentElement.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';

            document.documentElement.style.overflow = '';

            window.scrollTo(0, scrollY);

            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleThumbnailError = () => {
        if (thumbnail) return;

        setThumbnailIndex((prev) => {
            if (prev < youtubeThumbnails.length - 1) {
                return prev + 1;
            }
            return prev;
        });
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