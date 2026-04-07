import React, {useState, useEffect, useCallback, useRef} from 'react';
import {proceedToPayment} from '@/src/lib/payment.ts';

const API_URL = (process.env.VITE_API_URL || 'https://holystudio-ai.onrender.com').replace(/\/+$/, '');

const REASON_MESSAGES: Record<string, string> = {
    format: 'Введіть коректний email',
    disposable: 'Тимчасові поштові скриньки не приймаються',
    no_mx: 'Ця пошта не може отримувати листи. Перевірте адресу.',
    server_error: 'Не вдалось перевірити пошту. Спробуйте ще раз.',
};

const EmailModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Open modal via custom event
    useEffect(() => {
        const handler = () => {
            setIsOpen(true);
            setError('');
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        };
        window.addEventListener('open-payment-modal', handler);
        return () => window.removeEventListener('open-payment-modal', handler);
    }, []);


    // Escape to close
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen]);

    // Block body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Step 1: Send verification code
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError('Введіть коректний email');
            return;
        }

        setLoading(true);

        try {
            // Validate email on server — with 3s timeout, skip if slow
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 3000);

                const resp = await fetch(`${API_URL}/api/validate-email`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email: trimmed}),
                    signal: controller.signal,
                });
                clearTimeout(timeout);

                if (resp.ok) {
                    const data = await resp.json();
                    if (!data.valid) {
                        setError(REASON_MESSAGES[data.reason] || 'Пошта не пройшла перевірку');
                        setLoading(false);
                        return;
                    }
                }
            } catch {
                // API unavailable or timeout — skip validation, proceed to payment
                console.warn('[EmailModal] Email validation skipped (timeout/unavailable)');
            }

            // Create WayForPay payment and redirect to payment page
            await proceedToPayment(trimmed);
            // Form submit navigates away — no need to close modal
        } catch (err) {
            console.error('[EmailModal] Payment error:', err);
            setError('Помилка створення платежу. Спробуйте ще раз.');
            setLoading(false);
        }
    }, [email]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
            onClick={() => setIsOpen(false)}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"/>

            {/* Modal */}
            <div
                className="relative bg-black brutalist-border border-white p-6 md:p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-4 text-white/60 hover:text-white text-2xl font-light leading-none transition-colors"
                    aria-label="Закрити"
                >
                    ×
                </button>

                <h2 className="text-lg md:text-xl font-black font-brutal uppercase tracking-tighter text-white mb-2 leading-tight">
                    Введіть вашу пошту
                </h2>

                <p className="text-xs md:text-sm text-white/60 mb-5 leading-relaxed">
                    На цей email прийде унікальне посилання з доступом до Telegram-бота курсу після оплати
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <input
                        ref={inputRef}
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError('');
                        }}
                        className={`w-full bg-black text-white text-sm md:text-base px-4 py-3 border-2 outline-none transition-colors placeholder:text-white/30 font-medium ${
                            error ? 'border-red-500' : 'border-white focus:border-purple-500'
                        }`}
                        disabled={loading}
                        autoComplete="email"
                    />

                    {error && (
                        <p className="text-red-400 text-xs mt-2 font-semibold">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-white text-black text-sm md:text-base font-black py-3 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Перевіряємо...' : 'Перейти до оплати'}
                    </button>
                </form>

                <p className="text-[10px] text-white/30 mt-4 leading-relaxed text-center">
                    Натискаючи «Перейти до оплати», ви погоджуєтесь з{' '}
                    <a href="/public-offer" className="underline hover:text-white/50 transition-colors">
                        публічною офертою
                    </a>
                </p>
            </div>
        </div>
    );
};

export default EmailModal;

