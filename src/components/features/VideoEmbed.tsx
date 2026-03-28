import React, { useEffect, useRef, useState } from 'react';

type VideoEmbedProps = {
    videoId: string;
    title: string;
};

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoId, title }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isStarted, setIsStarted] = useState(false);

    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&rel=0&playsinline=1&iv_load_policy=3&modestbranding=1`;

    const handleStart = () => {
        setIsStarted(true);

        const iframeWindow = iframeRef.current?.contentWindow;
        if (!iframeWindow) return;

        iframeWindow.postMessage(
            JSON.stringify({
                event: 'command',
                func: 'playVideo',
                args: [],
            }),
            '*'
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const iframeWindow = iframeRef.current?.contentWindow;
            if (!iframeWindow) return;

            iframeWindow.postMessage(
                JSON.stringify({
                    event: 'listening',
                    id: videoId,
                }),
                '*'
            );
        }, 400);

        return () => clearTimeout(timer);
    }, [videoId]);

    return (
        <div className="relative aspect-video w-full bg-black overflow-hidden">
            <iframe
                ref={iframeRef}
                className="absolute inset-0 h-full w-full"
                src={embedUrl}
                title={title}
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />

            {!isStarted && (
                <button
                    type="button"
                    onClick={handleStart}
                    aria-label={`Запустити відео ${title}`}
                    className="absolute inset-0 z-10 block h-full w-full"
                >
                    <img
                        src={thumbnail}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/20 transition hover:bg-black/30" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-xl md:h-20 md:w-20">
                            <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white md:border-y-[12px] md:border-l-[20px]" />
                        </div>
                    </div>
                </button>
            )}
        </div>
    );
};

export default VideoEmbed;