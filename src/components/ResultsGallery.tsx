
import React from 'react';

const ResultsGallery: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-black font-brutal mb-5 tracking-tighter uppercase leading-none">
          Приклад фото і відео який ти зможеш повторити
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] border-4 border-black bg-zinc-200 overflow-hidden group relative">
              <img 
                src={`https://picsum.photos/seed/${i + 40}/600/800`} 
                alt="AI Result Example" 
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <span className="bg-purple-600 text-white font-black px-4 py-2 brutalist-border border-black font-brutal">AI CINEMATIC</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-black text-white brutalist-border border-purple-500 brutalist-shadow">
          <p className="text-xl font-bold font-brutal">Це не просто картинки — це результат покрокового алгоритму, який ми передамо тобі.</p>
        </div>
      </div>
    </section>
  );
};

export default ResultsGallery;
