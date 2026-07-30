import React, {useState} from 'react';
import Seo from "@/src/components/features/Seo.tsx";

const ROLE_OPTIONS = [
    'підприємець',
    'маркетолог',
    'SMM',
    'креатор контенту',
    'власник продакшену',
    'фотограф',
    'відеограф',
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
}

const Field: React.FC<FieldProps> = ({label, name, value, onChange, placeholder, type = 'text', textarea}) => (
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
}

const ChoiceField: React.FC<ChoiceProps> = ({label, name, options, value, onChange}) => (
    <div>
        <span className={labelClass}>
            {label} <span className="text-purple-500">*</span>
        </span>
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const active = value === option;
                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(name, option)}
                        className={`px-4 py-2 border-2 text-xs md:text-sm font-bold uppercase transition-colors ${
                            active
                                ? 'bg-purple-600 border-white text-white'
                                : 'bg-black border-white text-white hover:bg-white hover:text-black'
                        }`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    </div>
);

const EMPTY_FORM = {
    name: '',
    email: '',
    country: '',
    phone: '',
    telegram: '',
    source: '',
    role: '',
    interest: '',
    motivation: '',
    readiness: '',
};

const ApplyPage = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
    const [channelUrl, setChannelUrl] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const setField = (name: string, value: string) => {
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!form.role || !form.readiness) {
            setStatus('error');
            return;
        }

        setStatus('sending');
        try {
            const resp = await fetch('/api/leads', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form),
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data.ok) {
                setStatus('error');
                return;
            }
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
            <main className="pt-24 md:pt-36 pb-16 md:pb-24 px-4">
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
                            <div className="mb-10">
                                <span className="inline-block bg-purple-600 border-2 border-white px-3 py-1.5 font-brutal font-black text-[10px] md:text-xs uppercase tracking-tighter mb-5">
                                    Анкета предзапису
                                </span>
                                <h1 className="text-2xl md:text-4xl font-black font-brutal tracking-tighter leading-tight mb-5">
                                    Навчання з <span className="text-purple-500">ШІ генерацій</span> від
                                    HOLYSTUDIO
                                </h1>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed border-l-4 border-purple-500 pl-4">
                                    Навчись створювати рекламні відео кінематографічної якості — з тими
                                    інструментами, з якими ми знімаємо для клієнтів продакшену.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="brutalist-border bg-black p-6 md:p-10 space-y-6"
                            >
                                <Field label="Ваше ім'я" name="name" value={form.name}
                                       onChange={setField} placeholder="Ім'я та прізвище"/>
                                <Field label="Ваш email" name="email" type="email" value={form.email}
                                       onChange={setField} placeholder="you@example.com"/>
                                <Field label="Країна" name="country" value={form.country}
                                       onChange={setField} placeholder="Україна"/>
                                <Field label="Номер телефону" name="phone" type="tel" value={form.phone}
                                       onChange={setField} placeholder="+380..."/>
                                <Field label="Ваш Telegram" name="telegram" value={form.telegram}
                                       onChange={setField} placeholder="@nickname"/>
                                <Field label="Звідки дізналися про нас?" name="source" value={form.source}
                                       onChange={setField} placeholder="Instagram, друзі, реклама..."/>

                                <ChoiceField label="Ваша роль" name="role" options={ROLE_OPTIONS}
                                             value={form.role} onChange={setField}/>

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
                                        Не вдалося надіслати. Перевір, що всі поля заповнені (включно з роллю та
                                        готовністю), і спробуй ще раз.
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
