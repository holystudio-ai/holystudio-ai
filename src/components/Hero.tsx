import React from 'react';
import Pricing from "@/src/components/Pricing.tsx";
import heroImage from "../assets/images/hero-image.jpeg";

const Hero: React.FC = () => {
    const mainTitle = "НАВЧИСЬ СТВОРЮВАТИ АІ КРЕАТИВИ КІНОШНОЇ ЯКОСТІ З НУЛЯ ЗА 5 ДНІВ.";

    return (
        <section className="pt-32 pb-5 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex w-full">
                    <div
                        className="ml-auto inline-block bg-white text-black px-4 py-1 font-black text-sm md:text-lg uppercase mb-6 brutalist-border border-black font-brutal">
                        ІНТЕНСИВ ВІД РЕКЛАМНОГО ВІДЕОПРОДАКШЕНУ
                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%), url(${heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top center',
                        backgroundRepeat: 'no-repeat'
                    }}
                    className="min-h-[100dvh] flex flex-col justify-end p-4 md:p-8 w-full border-black brutalist-border"
                >
                    <div className="relative group max-w-full">
                        <h1
                            className="text-[11vw] sm:text-5xl md:text-7xl lg:text-[100px] font-black font-brutal leading-[0.9] md:leading-[0.95] mb-4 md:mb-8 tracking-tighter glitch select-none text-white break-words"
                            data-text={mainTitle}
                        >
                            {mainTitle.split('АІ КРЕАТИВИ').map((part, index) => (
                                <React.Fragment key={index}>
                                    {part}
                                    {index === 0 && <span className="text-purple-500">АІ КРЕАТИВИ</span>}
                                </React.Fragment>
                            ))}
                        </h1>
                    </div>
                </div>

                <div className="flex-box gap-10 items-start mt-12">
                    <div>
                        <p className="text-l md:text-2xl leading-tight">
                            Отримай навички зі створення <span className="font-bold">фото і відео топової якості</span>,
                            навіть якщо ти повний нуль по нашій <span
                            className="font-bold">унікальний промпт-структурі.</span> Ми покажемо як отримувати якість з
                            перших генерацій, не витрачаючи купу місяців на вивчення технічки…. <span
                            className="font-bold">або повернемо кошти!</span>
                        </p>
                        <p className="text-l md:text-2xl font-bold leading-tight mb-6">
                            Ми покажемо як отримувати якість з перших генерацій... або повернемо кошти!
                        </p>
                    </div>
                    <div>
                        <p className="text-l md:text-2xl leading-tight">
                            Поки всі говорили про майбутнє генеративного AI, воно вже стало реальністю: нейромережі
                            замінюють цілі знімальні групи, дозволяючи <span className="font-bold">одній людині</span>,
                            творювати кінематографічні ролики <span
                            className="font-bold">без космічних бюджетів і великих команд</span> Не проспи можливість
                            опанувати генеративний AI зараз, щоб перетворити свої ідеї на професійний контент і <span
                            className="font-bold">зірвати куш $$$</span> нової цифрової ери, <span
                            className="font-bold">поки інші зволікають.</span>
                        </p>
                        <p className="text-l md:text-2xl font-bold leading-tight mb-6">
                            Ми покажемо як отримувати якість з перших генерацій... або повернемо кошти!
                        </p>
                    </div>

                    <Pricing text={"ЦІНА ДІЄ ТІЛЬКИ СЬОГОДНІ"}/>
                </div>
            </div>
        </section>
    );
};

export default Hero;