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
import VideoEmbed from "@/src/components/features/VideoEmbed.tsx";

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
      <section className="bg-white px-4 py-14 text-black">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-brutal text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
            РЕЗУЛЬТАТ ЯКИЙ ТИ СТВОРИШ ПІД ЧАС НАВЧАННЯ
          </h2>

          <div className="relative mx-auto mb-2 aspect-[9/16] w-full max-w-[360px] overflow-hidden border-4 border-black bg-black md:max-w-[420px]">
            <VideoEmbed
                videoId="y5X1Kd0TPa8"
                title="Study shorts video"
                isVertical
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