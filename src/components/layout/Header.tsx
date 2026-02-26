import React, { useState } from 'react';
import logo from '../../assets/logo/logo.png';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Кому підходить", href: "#audience" },
    { name: "Програма", href: "#program" },
    { name: "Вартість", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
      <header className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-white">
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">

          <div className="flex items-center shrink-0">
            <img
                src={logo}
                alt="HOLYSTUDIO LOGO"
                className="h-8 md:h-12 w-auto transition-all"
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-8 font-bold text-xs uppercase font-brutal text-white">
              {navLinks.map((link) => (
                  <a key={link.name} href={link.href} className="hover:text-purple-500 transition-colors">
                    {link.name}
                  </a>
              ))}
            </nav>
            <a
                href="#pricing"
                className="bg-purple-600 text-white px-6 py-3 font-black text-sm uppercase brutalist-border border-black brutalist-shadow-hover transition-all font-brutal whitespace-nowrap"
            >
              Залетіти в навчання
            </a>
          </div>

          <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex flex-col gap-1.5 z-50 p-2"
              aria-label="Toggle menu"
          >
            <span className={`h-1 w-8 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`h-1 w-8 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-1 w-8 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </button>
        </div>

        <div className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-transform duration-500 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                  href="#pricing"
                  onClick={() => setIsOpen(false)}
                  className="bg-purple-600 text-white px-8 py-4 font-black text-lg uppercase brutalist-border border-white brutalist-shadow transition-all font-brutal inline-block"
              >
                Залетіти в навчання
              </a>
            </div>
          </nav>
        </div>
      </header>
  );
};

export default Header;