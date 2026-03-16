import React, { useEffect, useMemo, useRef, useState } from "react";
import studyVideo from "../../assets/videos/study-video.mp4";

import studyPhoto1 from "../../assets/images/study1.jpg";
import studyPhoto2 from "../../assets/images/study2.jpg";
import studyPhoto3 from "../../assets/images/study3.jpg";
import studyPhoto4 from "../../assets/images/study4.jpg";
import studyPhoto5 from "../../assets/images/study5.jpg";
import studyPhoto6 from "../../assets/images/study6.jpg";
import studyPhoto7 from "../../assets/images/study7.jpg";
import studyPhoto8 from "../../assets/images/study8.jpg";
import studyPhoto9 from "../../assets/images/study9.jpg";
import studyPhoto10 from "../../assets/images/study10.jpg";

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

const ResultsGallery: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoPreview = studyPhoto6;

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
    setIndex((prev) => (prev - 2 < 0 ? Math.max(photos.length - 2, 0) : prev - 2));
  };

  const visiblePhotos = useMemo(() => photos.slice(index, index + 2), [index]);

  const handlePlayVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setIsVideoLoading(true);

      video.load();
      video.currentTime = 0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      setIsVideoReady(true);
      setIsVideoPlaying(true);
    } catch (error) {
      console.error("Study video play failed:", error);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const openFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
        return;
      }

      const safariVideo = video as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
      };

      if (safariVideo.webkitEnterFullscreen) {
        safariVideo.webkitEnterFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  return (
      <section className="py-24 px-4 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black font-brutal mb-8 tracking-tighter uppercase leading-none">
            РЕЗУЛЬТАТ ЯКИЙ ТИ СТВОРИШ ПІД ЧАС НАВЧАННЯ
          </h2>

          <div className="relative w-full max-w-[360px] md:max-w-[420px] mx-auto aspect-[9/16] border-4 border-black bg-black overflow-hidden mb-2">
            {!isVideoPlaying && (
                <div className="absolute inset-0 z-20">
                  <img
                      src={videoPreview}
                      alt="Video preview"
                      className="w-full h-full object-contain bg-black"
                  />

                  <div className="absolute inset-0 bg-black/30" />

                  <div className="absolute inset-x-0 top-4 flex justify-center">
                    <div className="border-2 border-white bg-black/80 px-4 py-2 text-[11px] md:text-sm font-black uppercase text-white font-brutal tracking-tight text-center">
                      {isVideoLoading
                          ? "Завантажуємо відео..."
                          : isVideoReady
                              ? "Натисни щоб подивитися відео"
                              : "Натисни щоб завантажити і подивитися відео"}
                    </div>
                  </div>

                  <button
                      type="button"
                      onClick={handlePlayVideo}
                      className="absolute inset-0 flex items-center justify-center transition cursor-pointer"
                      aria-label="Play study video"
                  >
                    <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full border-4 border-white bg-black/70">
                      {isVideoLoading ? (
                          <div className="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                      ) : (
                          <svg
                              className="ml-1 h-10 w-10 md:h-12 md:w-12 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                      )}
                    </div>
                  </button>
                </div>
            )}

            <video
                ref={videoRef}
                src={studyVideo}
                muted
                loop
                playsInline
                preload="metadata"
                poster={videoPreview}
                onLoadedData={() => setIsVideoReady(true)}
                onCanPlay={() => setIsVideoReady(true)}
                onPlay={() => {
                  setIsVideoReady(true);
                  setIsVideoPlaying(true);
                  setIsVideoLoading(false);
                }}
                onPause={() => setIsVideoPlaying(false)}
                onWaiting={() => setIsVideoLoading(true)}
                onPlaying={() => {
                  setIsVideoReady(true);
                  setIsVideoPlaying(true);
                  setIsVideoLoading(false);
                }}
                onError={(e) => {
                  console.error("Video failed to load", e);
                  setIsVideoLoading(false);
                  setIsVideoPlaying(false);
                }}
                controls={isVideoPlaying}
                controlsList="nodownload noplaybackrate noremoteplayback"
                disablePictureInPicture
                className="w-full h-full object-contain bg-black"
            />

            {isVideoPlaying && (
                <button
                    type="button"
                    onClick={openFullscreen}
                    className="absolute top-3 left-3 z-30 bg-black/70 text-white border border-white/20 px-3 py-1 text-[10px] md:text-xs font-black uppercase hover:bg-purple-500 hover:text-white transition-all"
                    aria-label="Fullscreen study video"
                >
                  Full
                </button>
            )}
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