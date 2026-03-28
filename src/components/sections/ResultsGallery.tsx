import React, { useEffect, useMemo, useRef, useState } from "react";

import studyPhoto1 from "../../assets/images/study1.webp";
import studyPhoto2 from "../../assets/images/study2.webp";
import studyPhoto3 from "../../assets/images/study3.webp";
import studyPhoto4 from "../../assets/images/study4.webp";
import studyPhoto5 from "../../assets/images/study5.webp";
import studyPhoto6 from "../../assets/images/study6.webp";
import studyPhoto7 from "../../assets/images/study7.webp";
import studyPhoto8 from "../../assets/images/study8.webp";
import studyPhoto9 from "../../assets/images/study9.webp";
import studyPhoto10 from "../../assets/images/study10.webp";

const photos = [
  studyPhoto1,
  studyPhoto2,
  studyPhoto3,
  studyPhoto4,
  studyPhoto5,
  studyPhoto6,
  studyPhoto7,
  studyPhoto8,
  studyPhoto9,
  studyPhoto10,
];

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
          event: "command",
          func: "playVideo",
          args: [],
        }),
        "*"
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow) return;

      iframeWindow.postMessage(
          JSON.stringify({
            event: "listening",
            id: videoId,
          }),
          "*"
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [videoId]);

  return (
      <div className="relative h-full w-full bg-black overflow-hidden">
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

const ResultsGallery: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const preloadImage = (src: string) => {
    if (loadedImages[src]) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoadedImages((prev) => ({ ...prev, [src]: true }));
    };
  };

  useEffect(() => {
    photos.slice(0, 4).forEach(preloadImage);
  }, []);

  useEffect(() => {
    const currentPhotos = photos.slice(index, index + 2);
    const nextIndex = index + 2 >= photos.length ? 0 : index + 2;
    const nextPhotos = photos.slice(nextIndex, nextIndex + 2);

    [...currentPhotos, ...nextPhotos].forEach(preloadImage);
  }, [index]);

  const next = () => {
    setIndex((prev) => (prev + 2 >= photos.length ? 0 : prev + 2));
  };

  const prev = () => {
    setIndex((prev) =>
        prev - 2 < 0 ? Math.max(photos.length - 2, 0) : prev - 2
    );
  };

  const visiblePhotos = useMemo(() => photos.slice(index, index + 2), [index]);

  return (
      <section className="py-24 px-4 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black font-brutal mb-8 tracking-tighter uppercase leading-none">
            РЕЗУЛЬТАТ ЯКИЙ ТИ СТВОРИШ ПІД ЧАС НАВЧАННЯ
          </h2>

          <div className="relative w-full max-w-[360px] md:max-w-[420px] mx-auto aspect-[9/16] border-4 border-black bg-black overflow-hidden mb-2">
            <VideoEmbed
                videoId="y5X1Kd0TPa8"
                title="Study shorts video"
            />
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-2">
              {visiblePhotos.map((photo, i) => {
                const isLoaded = loadedImages[photo];

                return (
                    <div
                        key={`${photo}-${i}`}
                        className="relative w-full aspect-[3/4] border-4 border-black overflow-hidden bg-zinc-100"
                    >
                      {!isLoaded && (
                          <div className="absolute inset-0 animate-pulse bg-zinc-200" />
                      )}

                      <img
                          src={photo}
                          alt={`Study example ${index + i + 1}`}
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding="async"
                          onLoad={() =>
                              setLoadedImages((prev) => ({ ...prev, [photo]: true }))
                          }
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                              isLoaded ? "opacity-100" : "opacity-0"
                          }`}
                      />
                    </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 mt-3">
              <button
                  onClick={prev}
                  className="w-[180px] border-4 border-black bg-white px-6 py-3 font-black uppercase hover:bg-black hover:text-white transition"
              >
                Назад
              </button>

              <button
                  onClick={next}
                  className="w-[180px] border-4 border-black bg-black text-white px-6 py-3 font-black uppercase hover:bg-white hover:text-black transition"
              >
                Далі
              </button>
            </div>
          </div>

          <div className="mt-8 p-6 bg-black text-white border-4 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold font-brutal">
              Це не просто картинки — це результат покрокового алгоритму, який ми передамо тобі.
            </p>
          </div>
        </div>
      </section>
  );
};

export default ResultsGallery;