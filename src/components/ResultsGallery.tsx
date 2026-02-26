import React from 'react';

const ResultsGallery: React.FC = () => {
  return (
      <section className="py-24 px-4 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black font-brutal mb-5 tracking-tighter uppercase leading-none">
            Приклад фото і відео який ти зможеш повторити
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* PHOTO PLACEHOLDER */}
            <div className="aspect-video border-4 border-black bg-zinc-200 overflow-hidden group relative">
              <img
                  src="https://picsum.photos/seed/photo-example/1200/675"
                  alt="AI Photo Example"
                  className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-purple-600 text-white font-black px-6 py-3 border-4 border-black font-brutal">
                AI PHOTO
              </span>
              </div>
            </div>

            {/* VIDEO PLACEHOLDER */}
            <div className="aspect-video border-4 border-black bg-zinc-300 overflow-hidden group relative flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-black">▶</div>
                <p className="mt-4 font-black uppercase font-brutal">
                  AI VIDEO
                </p>
              </div>

              <div className="absolute inset-0 border-4 border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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