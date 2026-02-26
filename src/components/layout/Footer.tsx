import React from 'react';
import logo from '../../assets/logo/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 border-t-4 border-purple-600 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={logo}
            alt="HOLYSTUDIO" 
            className="h-16 w-auto"
          />
          <div className="text-xl font-black font-brutal tracking-tighter uppercase">
            HOLY<span className="text-purple-500">STUDIO</span>
          </div>
        </div>
        
        <div className="flex gap-6 font-bold text-xs md:text-sm uppercase font-brutal">
          <a href="#" className="hover:text-purple-500 transition-colors">Telegram</a>
          <a href="#" className="hover:text-purple-500 transition-colors">Instagram</a>
          <a href="#" className="hover:text-purple-500 transition-colors">YouTube</a>
        </div>
        
        <div className="text-[10px] font-bold opacity-50 uppercase text-center md:text-right font-brutal tracking-tight">
          © {new Date().getFullYear()} HOLYSTUDIO production. <br/> 
          Усі права захищені. AI - це майбутнє, яке вже тут.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
