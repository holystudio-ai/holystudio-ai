import React, { useEffect, useMemo, useState } from "react";
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

  const preloadImage = (src: string) => {
    if (loadedImages[src]) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoadedImages((prev) => ({ ...prev, [src]: true }));
    };
  };

  useEffect(() => {
    // перші 4 фотки вантажимо одразу
    photos.slice(0, 4).forEach(preloadImage);
  }, []);

  useEffect(() => {
    // поточні 2 фото
    const currentPhotos = photos.slice(index, index + 2);

    // наступні 2 фото наперед
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

  return (
      <section className="py-24 px-4 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black font-brutal mb-8 tracking-tighter uppercase leading-none">
            Приклад фото і відео який ти зможеш повторити
          </h2>

          {/* VIDEO */}
          <div className="w-full aspect-video border-4 border-black bg-black overflow-hidden mb-2">
            <video
                src={studyVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            />
          </div>

          {/* PHOTOS */}
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