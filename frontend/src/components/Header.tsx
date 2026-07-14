import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageLink {
  code: string;
  name: string;
  url: string;
}

interface HeaderProps {
  currentLang: string;
  languages: LanguageLink[];
}

export default function Header({ currentLang, languages }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const activeLanguage = languages.find(l => l.code === currentLang) || { code: currentLang, name: 'Español' };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled 
          ? 'py-3 bg-canvas-100/90 backdrop-blur-xl border-b border-stone-200/80 shadow-sm text-ink-900' 
          : 'py-6 bg-transparent text-white'
      }`}
    >
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 xl:px-16 flex items-center justify-between">
        
        {/* Logo Area */}
        <a href={`/${currentLang}`} className="flex items-center gap-1.5 group select-none whitespace-nowrap">
          <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight leading-none">
            GYE
          </span>
          <span 
            className={`font-sans text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase mt-0.5 transition-colors duration-700 ${
              isScrolled ? 'text-ink-600' : 'text-white/80 group-hover:text-white'
            }`}
          >
            GUAYAQUIL
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          <div className="relative group">
            <button className="flex items-center gap-1 text-[11px] xl:text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-85 py-1 whitespace-nowrap cursor-pointer">
              <span>Descubre Gye</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 text-[11px] xl:text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-85 py-1 whitespace-nowrap cursor-pointer">
              <span>¿Qué Hacer?</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </div>

          <a 
            href={`/${currentLang}/#eventos`} 
            className="text-[11px] xl:text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-85 py-1 whitespace-nowrap"
          >
            Eventos
          </a>

          <a 
            href={`/${currentLang}/#turismo-mice`} 
            className="text-[11px] xl:text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-85 py-1 whitespace-nowrap"
          >
            Turismo Mice
          </a>

          <a 
            href={`/${currentLang}/#blog`} 
            className="text-[11px] xl:text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-85 py-1 whitespace-nowrap"
          >
            Blog
          </a>

          <a 
            href={`/${currentLang}/#servicios`} 
            className="text-[11px] xl:text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-85 py-1 whitespace-nowrap"
          >
            Servicios
          </a>
        </nav>

        {/* Right Controls (Language & CTA) */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Language Selector */}
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase py-2 cursor-pointer transition-colors hover:opacity-85 whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{activeLanguage.code}</span>
              <ChevronDown className="w-3 h-3 opacity-60 transition-transform duration-300" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {/* Language Dropdown absolute wrapper to bridge the hover gap */}
            <div 
              className={`absolute right-0 top-full pt-3 transition-all duration-300 z-50 ${
                isDropdownOpen 
                  ? 'opacity-100 visible pointer-events-auto' 
                  : 'opacity-0 invisible pointer-events-none'
              }`}
            >
              {/* Styled Dropdown Box */}
              <div 
                className="w-44 sm:w-48 bg-canvas-50 rounded-2xl shadow-xl border border-canvas-200/50 p-1.5 transform transition-transform duration-300"
                style={{ 
                  transform: isDropdownOpen ? 'translateY(0)' : 'translateY(4px)'
                }}
              >
                {languages.map((lang) => {
                  const isActive = lang.code === currentLang;
                  return (
                    <a
                      key={lang.code}
                      href={lang.url}
                      className={`flex justify-between items-center px-4 py-2.5 text-[10px] tracking-widest font-semibold uppercase rounded-xl transition-all duration-200 whitespace-nowrap ${
                        isActive 
                          ? 'text-terra-600 bg-canvas-100/60' 
                          : 'text-ink-600 hover:text-ink-900 hover:bg-canvas-100/40'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className={`text-[9px] opacity-60 ${isActive ? 'text-terra-500' : ''}`}>
                        {lang.code}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAPA INTERACTIVO CTA Button */}
          <a
            href={`/${currentLang}/mapa`}
            className={`transition-all duration-700 text-[10px] sm:text-xs font-semibold tracking-wider font-sans uppercase rounded-full px-5 py-2.5 whitespace-nowrap ${
              isScrolled 
                ? 'bg-ink-900 text-white hover:bg-ink-800 shadow-sm' 
                : 'bg-transparent text-white border border-white/40 hover:bg-white/10'
            }`}
          >
            Mapa Interactivo
          </a>
        </div>

      </div>
    </header>
  );
}
