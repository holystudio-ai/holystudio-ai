import React from 'react';
import logo from '../../assets/logo/logo.png';
import { Link } from "react-router-dom";
import { FaTiktok } from "react-icons/fa";
import { FaInstagram, FaThreads } from "react-icons/fa6";

const Footer: React.FC = () => {
    const socialLinks = [
        { href: "https://instagram.com/holystudio.ai", label: "Instagram", icon: FaInstagram },
        { href: "https://tiktok.com/@holystudio.ai", label: "TikTok", icon: FaTiktok },
        { href: "https://threads.com/@holystudio.ai?utm_source=hoobe&utm_medium=social", label: "Threads", icon: FaThreads },
    ];

    return (
        <footer className="py-12 px-4 border-t-4 border-purple-600 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <img
                            src={logo}
                            alt="HOLYSTUDIO"
                            className="h-16 w-auto"
                        />
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-3">
                        {socialLinks.map(({ href, label, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label={label}
                                className="flex h-12 w-12 items-center justify-center text-white transition-colors hover:text-purple-500"
                            >
                                <Icon className="h-5 w-5 md:h-6 md:w-6" />
                            </a>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 font-bold text-xs md:text-sm uppercase font-brutal">
                        <Link
                            to="/privacy-policy"
                            className="inline-block w-fit hover:text-purple-500 transition-colors"
                        >
                            Політика конфіденційності
                        </Link>
                        <Link
                            to="/terms"
                            className="inline-block w-fit hover:text-purple-500 transition-colors"
                        >
                            Умови використання
                        </Link>
                        <Link
                            to="/public-offer"
                            className="inline-block w-fit hover:text-purple-500 transition-colors"
                        >
                            Публічна оферта
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-[10px] font-bold opacity-50 uppercase text-center md:text-right font-brutal tracking-tight">
                    © {new Date().getFullYear()} HOLYSTUDIO production. <br />
                    Усі права захищені. AI — це майбутнє, яке вже тут.
                </div>
            </div>
        </footer>
    );
};

export default Footer;