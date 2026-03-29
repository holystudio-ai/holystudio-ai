import React, { useEffect, useMemo, useState } from "react";

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
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleThumbnailError = () => {
    if (thumbnailSrc.includes("maxresdefault")) {
      setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/sddefault.jpg`);
      return;
    }

    if (thumbnailSrc.includes("sddefault")) {
      setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }
  };

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      controls: "1",
      rel: "0",
      playsinline: "1",
      modestbranding: "1",
      iv_load_policy: "3",
      fs: "1",
      hd: "1",
      enablejsapi: "1",
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
                  className="relative w-full max-w-[1400px]"
                  onClick={(e) => e.stopPropagation()}
              >
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Закрити відео"
                    className="absolute -top-12 right-0 z-20 flex h-10 w-10 items-center justify-center border-4 border-black bg-white text-black transition hover:bg-black hover:text-white"
                >
                  ✕
                </button>

                <div className="relative w-full overflow-hidden border-4 border-black bg-black shadow-2xl">
                  <div className="aspect-video w-full">
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
      <section className="bg-white px-4 py-24 text-black">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-brutal text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
            РЕЗУЛЬТАТ ЯКИЙ ТИ СТВОРИШ ПІД ЧАС НАВЧАННЯ
          </h2>

          <div className="relative mx-auto mb-2 aspect-[9/16] w-full max-w-[360px] overflow-hidden border-4 border-black bg-black md:max-w-[420px]">
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
                        className="relative aspect-[3/4] w-full overflow-hidden border-4 border-black bg-zinc-100"
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
                          className={`h-full w-full object-cover transition-opacity duration-300 ${
                              isLoaded ? "opacity-100" : "opacity-0"
                          }`}
                      />
                    </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-center gap-4">
              <button
                  onClick={prev}
                  className="w-[180px] border-4 border-black bg-white px-6 py-3 font-black uppercase transition hover:bg-black hover:text-white"
              >
                Назад
              </button>

              <button
                  onClick={next}
                  className="w-[180px] border-4 border-black bg-black px-6 py-3 font-black uppercase text-white transition hover:bg-white hover:text-black"
              >
                Далі
              </button>
            </div>
          </div>

          <div className="mt-8 border-4 border-purple-500 bg-black p-6 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-brutal text-xl font-bold">
              Це не просто картинки — це результат покрокового алгоритму, який ми передамо тобі.
            </p>
          </div>
        </div>
      </section>
  );
};

export default ResultsGallery;