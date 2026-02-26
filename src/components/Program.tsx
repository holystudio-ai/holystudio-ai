import React from 'react';

const Program: React.FC = () => {
  const steps = [
    { num: "01", title: "Від ідеї до плану", details: "Огляд інструментів. Reference Board. Покроковий план." },
    { num: "02", title: "Генерація зображень", details: "Nano Banana. Промпт-структура: пози, ракурси." },
    { num: "03", title: "Пост-робота та Upscale", details: "Відбір та сортування. Покращення до 4K." },
    { num: "04", title: "Техніка розкадровки", details: "Сцена, кадр, склейка. Story Board." },
    { num: "05", title: "Анімування в Kling", details: "Промпти для анімації. Upscale відео." },
    { num: "06", title: "Монтаж та збірка", details: "Базовий монтаж в Edits. Звуки та ефекти." },
    { num: "07", title: "Прокачка креативу", details: "Як покращувати генерації. Рекомендації." },
    { num: "BONUS", title: "Просування", details: "Упаковка профілю. Фріланс. 20 промптів.", accent: true }
  ];

  return (
      <section id="program" className="pt-12 pb-8 px-4 md:px-6 bg-white text-black">
        <div className="w-full mx-auto">
          <h2 className="text-4xl md:text-4xl font-black font-brutal mb-8 tracking-tighter uppercase leading-none text-center md:text-left">
            ПРОГРАМА КУРСУ
          </h2>

          {/* Адаптивна сітка: 1 колонка на мобільних, 2 на планшетах, 4 на десктопі */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-2">
            {steps.map((step, idx) => (
                <div key={idx} className={`flex flex-col gap-2 p-4 md:p-3 brutalist-border border-black ${step.accent ? 'bg-purple-600 text-white' : 'bg-white'} brutalist-shadow transition-transform hover:-translate-y-1 mb-2`}>
                  <div className="text-2xl md:text-lg font-black font-brutal opacity-40">{step.num}</div>
                  <div>
                    <h3 className="text-lg md:text-sm font-black uppercase mb-1 font-brutal leading-tight">{step.title}</h3>
                    <p className="text-sm md:text-xs font-bold leading-tight opacity-80">{step.details}</p>
                  </div>
                </div>
            ))}
          </div>

          <div className="mt-8 p-6 md:p-4 border-2 border-dashed border-black text-center bg-zinc-50">
            <h4 className="text-base md:text-sm font-black uppercase mb-1 font-brutal">Зум-сесія з розбором робіт</h4>
            <p className="text-sm md:text-xs font-bold">Живий фідбек від викладачів по твоїм роботам і відповіді на запитання.</p>
          </div>

          {/* Compact Limited Offer Block */}
          <div className="mt-6 mb-8 brutalist-border border-purple-500 bg-white p-6 md:p-4 relative overflow-hidden brutalist-shadow mr-2">
            <div className="absolute top-0 left-0 bg-purple-600 text-white px-3 py-1 font-black uppercase text-[10px] font-brutal">
              LIMITED TIME OFFER
            </div>
            <div className="pt-4">
              <h4 className="text-lg md:text-sm font-black uppercase mb-3 font-brutal leading-tight">
                Додаткові матеріали до навчання:
              </h4>
              <div className="flex items-center gap-3">
                <div className="bg-black text-white p-2 md:p-1 shrink-0">
                  <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <p className="text-sm md:text-xs font-bold leading-tight">
                  20 шаблонів промптів для створення ультра-реалістичного контенту
                </p>
              </div>
            </div>
          </div>

          {/* Compact Proverb Quote */}
          <div className="bg-black text-white py-8 px-6 md:py-6 md:px-4 border-2 border-black">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
              <h2 className="text-2xl md:text-xl font-black font-brutal leading-[0.9] uppercase text-center md:text-left">
                Ранні пташки росу п’ють, а пізні - сльози ллють*
              </h2>
              <p className="text-sm md:text-[14px] font-bold border-l-0 md:border-l-2 border-purple-500 pl-0 md:pl-3 font-brutal opacity-70 text-center md:text-left">
                *народна приказка підкреслює, що найкращі результати дістаються тим, хто не зволікає.
              </p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Program;