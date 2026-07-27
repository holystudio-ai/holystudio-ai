import React, { useEffect, useState } from "react";
import logo from "../../assets/logo/logo.webp";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const { body } = document;
        const previousOverflow = body.style.overflow;

        if (isOpen) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflow = previousOverflow || "";
        }

        return () => {
            body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    const navLinks = [
        { name: "Кому підходить", href: "#audience" },
        { name: "Програма", href: "#program" },
        { name: "Вартість", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <>
            {/* Desktop header */}
            <header className="hidden md:block fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 md:h-20 flex items-center justify-between gap-3">

                    {/* LEFT: Logo */}
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="flex items-center">
                            <img
                                src={logo}
                                alt="HOLYSTUDIO LOGO"
                                className="h-8 md:h-12 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="flex items-center ml-auto">
                        <nav className="flex gap-8 font-bold text-xs uppercase font-brutal text-white">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="hover:text-purple-500 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Mobile burger — always on screen */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-3 right-3 z-50 flex flex-col gap-1.5 p-2"
                aria-label="Toggle menu"
            >
                <span
                    className={`h-1 w-7 bg-white transition-all duration-300 ${
                        isOpen ? "rotate-45 translate-y-2.5" : ""
                    }`}
                />
                <span
                    className={`h-1 w-7 bg-white transition-all duration-300 ${
                        isOpen ? "opacity-0" : ""
                    }`}
                />
                <span
                    className={`h-1 w-7 bg-white transition-all duration-300 ${
                        isOpen ? "-rotate-45 -translate-y-2.5" : ""
                    }`}
                />
            </button>

            {/* Mobile menu */}
            <div
                className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-transform duration-500 md:hidden ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <nav className="flex flex-col gap-6 text-center items-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-black text-white uppercase font-brutal hover:text-purple-500 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="mt-4">
                        <a
                            href="https://telegram.me/HOLYSTUDIO_AI_bot?start=ZGw6MzI3OTcz"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="button bg-purple-600 text-white px-8 py-4 font-black text-lg uppercase brutalist-border border-white brutalist-shadow transition-all font-brutal inline-block"
                        >
                            Залетіти в навчання
                        </a>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Header;
