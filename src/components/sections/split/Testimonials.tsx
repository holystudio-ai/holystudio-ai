import React from 'react';

/**
 * "300+ students already finished this course — here are some reviews" block
 * (split-test variant).
 *
 * TODO: replace the placeholder reviews below with real student testimonials
 * (name + text, optionally a screenshot). Structure/markup can stay as-is.
 */

interface Review {
    name: string;
    role: string;
    text: string;
}

// ⚠️ PLACEHOLDER CONTENT — swap for real reviews when available.
const reviews: Review[] = [
    {
        name: 'Імʼя студента',
        role: 'Випускник інтенсиву',
        text: 'Плейсхолдер відгуку. Тут буде реальний текст відгуку студента про результати після проходження інтенсиву.',
    },
    {
        name: 'Імʼя студента',
        role: 'Випускниця інтенсиву',
        text: 'Плейсхолдер відгуку. Замініть на справжній відгук — що вдалося створити та які результати отримали після курсу.',
    },
    {
        name: 'Імʼя студента',
        role: 'Випускник інтенсиву',
        text: 'Плейсхолдер відгуку. Сюди можна вставити цитату або скріншот повідомлення від студента.',
    },
    {
        name: 'Імʼя студента',
        role: 'Випускниця інтенсиву',
        text: 'Плейсхолдер відгуку. Реальні відгуки підвищують довіру — додайте 4–8 найкращих.',
    },
];

const Testimonials: React.FC = () => {
    return (
        <section className="bg-zinc-900 px-4 py-12 md:py-20 overflow-hidden">
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 text-center md:mb-14">
                    <h2 className="font-brutal text-2xl font-black uppercase leading-[1.05] tracking-tighter text-white md:text-5xl">
                        Цей курс вже пройшло{' '}
                        <span className="text-purple-500">300+ студентів</span>
                        <br className="hidden md:block" /> і ось відгуки частини з них
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-4 border-2 border-zinc-700 bg-black p-5 md:p-7 brutalist-border transition-all hover:border-purple-500"
                        >
                            <div className="flex text-purple-500" aria-hidden="true">
                                {'★★★★★'}
                            </div>

                            <p className="text-[15px] font-medium leading-snug text-zinc-300 md:text-[17px]">
                                “{review.text}”
                            </p>

                            <div className="mt-auto flex items-center gap-3 pt-2">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-600 font-brutal text-lg font-black text-white">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-brutal text-sm font-black uppercase leading-tight text-white">
                                        {review.name}
                                    </p>
                                    <p className="text-[12px] font-bold uppercase text-purple-500">
                                        {review.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
