import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {useSearchParams} from 'react-router-dom';
import {trackPurchase} from '@/src/lib/analytics.ts';
import {coursePriceUah} from '@/src/lib/pricing.ts';

const TELEGRAM_BOT = 'HOLYSTUDIO_AI_bot';
const MAX_POLLS = 10;
const POLL_INTERVAL = 3000; // 3 seconds
const API_URL = (process.env.VITE_API_URL || '').replace(/\/+$/, '');

type PaymentStatus = 'loading' | 'paid' | 'pending' | 'failed';

const ReturnPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const ref = searchParams.get('ref') || '';

    const [status, setStatus] = useState<PaymentStatus>(token && ref ? 'loading' : 'failed');
    const [pollCount, setPollCount] = useState(0);

    // Build unique Telegram deep-link
    const telegramLink = useMemo(() => {
        return ref
            ? `https://t.me/${TELEGRAM_BOT}?start=${encodeURIComponent(ref)}`
            : `https://t.me/${TELEGRAM_BOT}`;
    }, [ref]);

    const checkStatus = useCallback(async () => {
        try {
            const resp = await fetch(`${API_URL}/api/payment/status?token=${encodeURIComponent(token)}&ref=${encodeURIComponent(ref)}`);
            const data = await resp.json();

            if (data.status === 'paid') {
                setStatus('paid');
                return true; // stop polling
            } else if (data.status === 'pending') {
                setStatus('pending');
                return false; // keep polling
            } else {
                setStatus('failed');
                return true; // stop polling
            }
        } catch {
            return false;
        }
    }, [token, ref]);

    useEffect(() => {
        if (!token || !ref) return;

        let cancelled = false;
        let count = 0;

        const poll = async () => {
            if (cancelled) return;
            const done = await checkStatus();
            count++;
            setPollCount(count);
            if (!done && count < MAX_POLLS && !cancelled) {
                setTimeout(poll, POLL_INTERVAL);
            } else if (!done && count >= MAX_POLLS) {
                setStatus('failed');
            }
        };

        poll();

        return () => { cancelled = true; };
    }, [token, ref, checkStatus]);

    // Track purchase when paid
    useEffect(() => {
        if (status === 'paid') {
            trackPurchase({
                value: coursePriceUah,
                currency: 'UAH',
            });
        }
    }, [status]);

    // Loading state
    if (status === 'loading' || status === 'pending') {
        return (
            <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
                <div className="bg-black brutalist-border border-white p-6 md:p-10 text-center max-w-lg w-full">
                    <div className="text-5xl mb-4 animate-pulse">⏳</div>

                    <h1 className="text-2xl md:text-3xl font-black font-brutal uppercase tracking-tighter text-white mb-4 leading-tight">
                        Перевіряємо оплату...
                    </h1>

                    <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                        Зачекай кілька секунд, ми перевіряємо статус твого платежу.
                    </p>

                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                </div>
            </main>
        );
    }

    // Failed state
    if (status === 'failed') {
        return (
            <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
                <div className="bg-black brutalist-border border-white p-6 md:p-10 text-center max-w-lg w-full">
                    <div className="text-5xl mb-4">😔</div>

                    <h1 className="text-2xl md:text-3xl font-black font-brutal uppercase tracking-tighter text-white mb-4 leading-tight">
                        Оплата не пройшла
                    </h1>

                    <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                        Щось пішло не так з оплатою. Спробуй ще раз або використай іншу картку.
                    </p>

                    <a
                        href="/"
                        className="inline-block w-full bg-white text-black text-sm md:text-base font-black py-3 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal"
                    >
                        Спробувати ще раз
                    </a>

                    <p className="text-xs text-white/50 mt-6">
                        Якщо виникли питання — напиши нам в Instagram{' '}
                        <a
                            href="https://www.instagram.com/holystudio.ai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white/80 transition-colors"
                        >
                            @holystudio.ai
                        </a>
                    </p>
                </div>
            </main>
        );
    }

    // Paid state
    return (
        <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
            <div className="bg-black brutalist-border border-white p-6 md:p-10 text-center max-w-lg w-full">
                <div className="text-5xl mb-4">🎉</div>

                <h1 className="text-2xl md:text-3xl font-black font-brutal uppercase tracking-tighter text-white mb-4 leading-tight">
                    Оплата пройшла успішно!
                </h1>

                <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed">
                    Дякуємо за покупку! Натисни кнопку нижче, щоб отримати доступ до курсу через наш Telegram-бот.
                    Також ми надіслали посилання тобі на пошту.
                </p>

                <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full bg-[#2AABEE] text-white text-sm md:text-base font-black py-3.5 uppercase brutalist-border border-white/20 hover:brightness-110 transition-all font-brutal mb-3"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    Отримати доступ до курсу
                </a>

                <a
                    href="/"
                    className="inline-block w-full bg-white text-black text-sm md:text-base font-black py-3 uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal"
                >
                    На головну
                </a>

                <p className="text-xs text-white/50 mt-6">
                    Якщо виникли питання — напиши нам в Instagram{' '}
                    <a
                        href="https://www.instagram.com/holystudio.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white/80 transition-colors"
                    >
                        @holystudio.ai
                    </a>
                </p>
            </div>
        </main>
    );
};

export default ReturnPage;
