
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { COLORS, LANGUAGES } from "../data/config";

export default function Navbar() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine current language from URL or default to 'en'
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentLangCode = LANGUAGES.find(l => l.code === pathSegments[0])?.code || "en";

  // Update i18n if URL differs
  if (i18n.language !== currentLangCode) {
    i18n.changeLanguage(currentLangCode);
  }

  const changeLang = (lng: string) => {
    // Find if we are on a color page
    let colorId = null;
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment) {
      for (const col of COLORS) {
        const slug = i18n.getResource(currentLangCode, 'translation', `slug_${col.id}`);
        if (slug === lastSegment) {
          colorId = col.id;
          break;
        }
      }
    }

    let newPath = "/";
    if (lng !== "en") {
      newPath = `/${lng}`;
    }

    if (colorId) {
      const newSlug = i18n.getResource(lng, 'translation', `slug_${colorId}`);
      newPath = lng === "en" ? `/${newSlug}` : `/${lng}/${newSlug}`;
    }

    i18n.changeLanguage(lng);
    navigate(newPath);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen
        ? "bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-slate-200/5"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link
              to={currentLangCode === 'en' ? '/' : `/${currentLangCode}`}
              className="group flex items-center gap-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-violet-400 to-violet-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ease-out">
                <span className="font-display font-black text-xl">C</span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-slate-900  transition-colors">
                Color<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-violet-700"> Screen Test</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center p-1.5 bg-white/50 rounded-full border border-white/50 shadow-sm backdrop-blur-md">
              {COLORS.slice(0, 8).map((color) => {
                const slug = t(`slug_${color.id}`);
                const path = currentLangCode === 'en' ? `/${slug}` : `/${currentLangCode}/${slug}`;
                return (
                  <Link
                    key={color.id}
                    to={path}
                    className="w-6 h-6 rounded-full mx-1 hover:scale-125 hover:z-10 transition-all duration-300 border border-black/5 shadow-sm hover:shadow-md"
                    style={{ backgroundColor: color.hex }}
                    title={t(color.id)}
                  />
                );
              })}
              <div className="w-px h-4 bg-slate-300 mx-2" />
              <Link
                to={currentLangCode === 'en' ? '/' : `/${currentLangCode}`}
                className="text-[10px] font-black text-slate-500 hover:text-blue-600 transition-colors px-2 uppercase tracking-widest font-display"
              >
                {t('all')}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block relative group">
              <select
                value={currentLangCode}
                onChange={(e) => changeLang(e.target.value)}
                className="appearance-none bg-white/50 border border-white/50 hover:bg-white hover:border-slate-200 text-slate-700 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full py-2.5 px-4 pr-10 cursor-pointer transition-all shadow-sm backdrop-blur-sm"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-3 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all focus:outline-none active:scale-95"
            >
              <span className="sr-only">Open menu</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${isMobileMenuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-8 space-y-8 overflow-y-auto">
          {/* Language Selection */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1 font-display">{t('language_selector_label')}</p>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLang(lang.code)}
                  className={`py-3 px-4 rounded-xl text-xs font-black transition-all border ${currentLangCode === lang.code
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300'
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Grid Quick Access */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1 font-display">{t('quick_colors')}</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {COLORS.map((color) => {
                const slug = t(`slug_${color.id}`);
                const path = currentLangCode === 'en' ? `/${slug}` : `/${currentLangCode}/${slug}`;
                return (
                  <Link
                    key={color.id}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="aspect-square rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-transform active:scale-95"
                    style={{ backgroundColor: color.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Tools Quick Link */}
          <div className="pt-4 border-t border-slate-100">
            <Link
              to={currentLangCode === 'en' ? '/' : `/${currentLangCode}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 font-display text-sm tracking-wide"
            >
              {t('explore_all_tools')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
