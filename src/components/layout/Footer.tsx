import React from 'react';
import logo from '../../assets/logo/logo.png';
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
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

            <div className="flex flex-col gap-3 font-bold text-xs md:text-sm uppercase font-brutal">
              <a href="#" className="inline-block w-fit hover:text-purple-500 transition-colors">Telegram</a>
              <a href="#" className="inline-block w-fit hover:text-purple-500 transition-colors">Instagram</a>
              <a href="#" className="inline-block w-fit hover:text-purple-500 transition-colors">YouTube</a>
            </div>

            <div className="flex flex-col gap-3 font-bold text-xs md:text-sm uppercase font-brutal">
              <Link to="/privacy-policy" className="inline-block w-fit hover:text-purple-500 transition-colors">
                Політика конфіденційності
              </Link>
              <Link to="/terms" className="inline-block w-fit hover:text-purple-500 transition-colors">
                Умови використання
              </Link>
              <Link to="/public-offer" className="inline-block w-fit hover:text-purple-500 transition-colors">
                Публічна оферта
              </Link>
            </div>

          </div>

          <div className="mt-12 text-[10px] font-bold opacity-50 uppercase text-center md:text-right font-brutal tracking-tight">
            © {new Date().getFullYear()} HOLYSTUDIO production. <br/>
            Усі права захищені. AI — це майбутнє, яке вже тут.
          </div>

        </div>
      </footer>
  );
};

export default Footer;