import React, {useRef, useState} from 'react';
import Seo from "@/src/components/features/Seo.tsx";
import {newEventId, trackApplyLead} from '@/src/lib/analytics.ts';
import heroImage from "@/src/assets/images/new-aplpic.png";

const ROLE_OPTIONS = [
    'підприємець',
    'маркетолог',
    'SMM',
    'креатор контенту',
    'власник продакшену',
    'фотограф',
    'відеограф',
];

const INCOME_OPTIONS = [
    'До $500',
    '$500 – $1000',
    '$1000 – $2000',
    '$2000+',
];

const READINESS_OPTIONS = [
    'Готовий/а бронювати участь',
    'Мені потрібна консультація',
];

const inputClass =
    'w-full bg-black text-white border-2 border-white px-4 py-3 text-sm md:text-base ' +
    'placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors';

const labelClass = 'block font-brutal font-black text-xs md:text-sm uppercase tracking-tighter mb-2';

interface FieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
    type?: string;
    textarea?: boolean;
    inputRef?: React.Ref<HTMLInputElement>;
}

const Field: React.FC<FieldProps> = ({
    label, name, value, onChange, placeholder, type = 'text', textarea, inputRef,
}) => (
    <div>
        <label htmlFor={name} className={labelClass}>
            {label} <span className="text-purple-500">*</span>
        </label>
        {textarea ? (
            <textarea
                id={name}
                name={name}
                required
                rows={3}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(name, e.target.value)}
                className={`${inputClass} resize-y`}
            />
        ) : (
            <input
                ref={inputRef}
                id={name}
                name={name}
                required
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(name, e.target.value)}
                className={inputClass}
            />
        )}
    </div>
);

interface ChoiceProps {
    label: string;
    name: string;
    options: string[];
    value: string;
    onChange: (name: string, value: string) => void;
    allowOther?: boolean;
}

const choiceButtonClass = (active: boolean) =>
    `px-4 py-2 border-2 text-xs md:text-sm font-bold uppercase transition-colors ${
        active
            ? 'bg-purple-600 border-white text-white'
            : 'bg-black border-white text-white hover:bg-white hover:text-black'
    }`;

const ChoiceField: React.FC<ChoiceProps> = ({label, name, options, value, onChange, allowOther}) => {
    // "Інше" is a mode, not a value: once picked, the field's value becomes whatever
    // the user types. Seeded from `value` so a filled-in custom answer stays open.
    const [otherMode, setOtherMode] = useState(() => !!value && !options.includes(value));

    return (
        <div>
            <span className={labelClass}>
                {label} <span className="text-purple-500">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => {
                            setOtherMode(false);
                            onChange(name, option);
                        }}
                        className={choiceButtonClass(!otherMode && value === option)}
                    >
                        {option}
                    </button>
                ))}

                {allowOther && (
                    <button
                        type="button"
                        onClick={() => {
                            setOtherMode(true);
                            onChange(name, '');
                        }}
                        className={choiceButtonClass(otherMode)}
                    >
                        інше
                    </button>
                )}
            </div>

            {allowOther && otherMode && (
                <input
                    type="text"
                    name={`${name}Other`}
                    value={value}
                    autoFocus
                    placeholder="Вкажіть свій варіант"
                    onChange={(e) => onChange(name, e.target.value)}
                    className={`${inputClass} mt-3`}
                />
            )}
        </div>
    );
};

const EMPTY_FORM = {
    name: '',
    phone: '',
    telegram: '',
    source: '',
    role: '',
    income: '',
    interest: '',
    motivation: '',
    readiness: '',
};

const ApplyPage = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
    const [channelUrl, setChannelUrl] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const firstFieldRef = useRef<HTMLInputElement>(null);

    const setField = (name: string, value: string) => {
        setForm((prev) => ({...prev, [name]: value}));
    };

    /** Banner CTA is painted into the image — whole hero is the hit target. */
    const jumpToForm = () => {
        const field = firstFieldRef.current ?? document.getElementById('name');
        field?.scrollIntoView({behavior: 'smooth', block: 'center'});
        // Focus after scroll starts so mobile keyboards don't fight the jump.
        window.setTimeout(() => {
            if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
                field.focus({preventScroll: true});
            }
        }, 300);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!form.role || !form.income || !form.readiness) {
            setStatus('error');
            return;
        }

        setStatus('sending');
        // Shared with the server so Meta counts one lead, not two.
        const eventId = newEventId();
        try {
            const resp = await fetch('/api/leads', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...form,
                    eventId,
                    // Full address of this page, query string included — that is
                    // how the sheet knows which ad the lead came from.
                    sourcePage: window.location.href,
                }),
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data.ok) {
                setStatus('error');
                return;
            }
            trackApplyLead(eventId);
            setChannelUrl(data.channelUrl || null);
            setSubmitted(true);
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white">
            <Seo
                title="Запис на навчання — HOLYSTUDIO"
                description="Анкета предзапису на навчання з ШІ генерацій від HOLYSTUDIO. Навчись створювати рекламні відео кінематографічної якості."
            />
            {/* No header on this page — top padding is just breathing room, not header clearance.
                Size like an opened image: as large as possible while the whole frame stays
                on screen (width or height hits the viewport, aspect ratio preserved).
                CTA hotspot is %-based on the image box — safe across devices while the
                creative keeps the same aspect ratio; recalibrate if the crop changes. */}
            <section className="overflow-x-hidden px-4 pt-4 md:pt-8 max-[480px]:px-0 max-[480px]:pt-0">
                <div className="flex justify-center">
                    <div className="relative max-w-full overflow-hidden border-4 border-black bg-black max-[480px]:border-0">
                        <img
                            src={heroImage}
                            width={1122}
                            height={1402}
                            alt="Анкета передзапису — AI Director School від HOLYSTUDIO"
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                            className="block h-auto w-auto max-w-full max-h-[100svh] object-contain"
                        />
                        {/* Transparent hit target over the painted «ЗАПОВНИТИ АНКЕТУ» pill. */}
                        <button
                            type="button"
                            onClick={jumpToForm}
                            aria-label="Заповнити анкету — перейти до першого поля"
                            className="absolute left-[10%] bottom-[4%] h-[12%] w-[80%] cursor-pointer rounded-full border-0 bg-transparent p-0"
                        />
                    </div>
                </div>
            </section>

            <main className="pt-8 md:pt-12 pb-16 md:pb-24 px-4">
                <div className="max-w-3xl mx-auto">
                    {submitted ? (
                        <div className="brutalist-border brutalist-shadow-accent bg-black p-6 md:p-12 text-center">
                            <h1 className="text-3xl md:text-5xl font-black font-brutal tracking-tighter leading-none mb-6">
                                Тебе записано! 🔥
                            </h1>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
                                Заявку отримано. Ми зв'яжемося з тобою і надішлемо всю інформацію
                                про навчання і старт потоку.
                            </p>
                            {channelUrl ? (
                                <a
                                    href={channelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full md:w-auto bg-purple-600 text-white px-10 py-4 font-black text-sm md:text-base uppercase brutalist-border border-white font-brutal"
                                >
                                    ✈️ Вступити в Telegram-канал
                                </a>
                            ) : null}
                        </div>
                    ) : (
                        <>
                            {/* No intro copy here — the hero banner already carries the headline. */}
                            <form
                                onSubmit={handleSubmit}
                                className="brutalist-border bg-black p-6 md:p-10 space-y-6"
                            >
                                <Field label="Ваше ім'я" name="name" value={form.name}
                                       onChange={setField} placeholder="Ім'я та прізвище"
                                       inputRef={firstFieldRef}/>
                                <Field label="Номер телефону" name="phone" type="tel" value={form.phone}
                                       onChange={setField} placeholder="+380..."/>
                                <Field label="Ваш Telegram" name="telegram" value={form.telegram}
                                       onChange={setField} placeholder="@nickname"/>
                                <Field label="Звідки дізналися про нас?" name="source" value={form.source}
                                       onChange={setField} placeholder="Instagram, друзі, реклама..."/>

                                <ChoiceField label="Ваша роль" name="role" options={ROLE_OPTIONS}
                                             value={form.role} onChange={setField} allowOther/>

                                <ChoiceField label="Який твій середній дохід на місяць зараз?" name="income"
                                             options={INCOME_OPTIONS}
                                             value={form.income} onChange={setField}/>

                                <Field label="Який напрямок вас найбільше цікавить в AI?" name="interest"
                                       value={form.interest} onChange={setField} textarea
                                       placeholder="Фото, відео, реклама, контент..."/>
                                <Field label="Чому вирішили, що вам потрібне менторство з AI?" name="motivation"
                                       value={form.motivation} onChange={setField} textarea
                                       placeholder="Розкажіть коротко про вашу ціль"/>

                                <ChoiceField label="Готовність до покупки" name="readiness"
                                             options={READINESS_OPTIONS}
                                             value={form.readiness} onChange={setField}/>

                                {status === 'error' && (
                                    <div className="border-2 border-red-500 text-red-400 px-4 py-3 text-sm font-bold uppercase">
                                        Не вдалося надіслати. Перевір, що всі поля заповнені (включно з роллю,
                                        доходом та готовністю), і спробуй ще раз.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full bg-purple-600 text-white px-6 py-4 font-black text-sm md:text-base uppercase brutalist-border border-white font-brutal disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? 'Надсилаємо...' : 'Записатися на навчання'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ApplyPage;
