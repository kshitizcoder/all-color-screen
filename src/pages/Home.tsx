
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { COLORS, TOOLS } from "../data/config";
import Seo from "../commonUi/Seo";

const Home = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen relative overflow-hidden pt-24 sm:pt-32 pb-20">
      <Seo
        title={t('home_title')}
        description={t('description', { color: t('white') }).replace(t('white'), 'Screen')}
      />
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-400/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-purple-400/20 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-20 sm:mb-28 lg:mb-32 animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md mb-8 animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600 font-display">
              {t('professional_screen_utilities')}
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl capitalize lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none px-4 drop-shadow-sm">
            {t('home_title')}
          </h1>

          <p className="text-lg sm:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4 font-medium opacity-90">
            {t('description', { color: t('white') }).replace(t('white'), 'Screen')}
          </p>
        </div>

        {/* Colors Section */}
        <div className="mb-24 sm:mb-32">
          <div className="flex items-end justify-between mb-8 sm:mb-12 px-2">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                {t('pure_colors')}
              </h2>
              <p className="text-slate-500 font-medium">{t('pure_colors_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {COLORS.map(color => {
              const slug = t(`slug_${color.id}`);
              const langPrefix = i18n.language === 'en' ? '' : `/${i18n.language}`;
              const path = `${langPrefix}/${slug}`.replace('//', '/');

              return (
                <Link
                  key={color.id}
                  to={path}
                  className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ring-1 ring-black/5"
                >
                  <div
                    style={{ backgroundColor: color.hex }}
                    className="aspect-square w-full relative flex items-center justify-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </div>

                  <div className="p-4 flex items-center justify-between bg-white border-t border-slate-50">
                    <span className="font-bold text-sm text-slate-700 font-display capitalize">
                      {t(color.id)}
                    </span>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 transform rotate-45 group-hover:rotate-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
              {t('tools-utilities')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {TOOLS.map((tool) => {
              const langPrefix = i18n.language === 'en' ? '' : `/${i18n.language}`;
              const path = `${langPrefix}/${tool.path}`.replace('//', '/');

              return (
                <Link
                  key={tool.id}
                  to={path}
                  className="group relative p-8 glass-card rounded-[2rem] hover:bg-white transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500 text-blue-600">
                      {tool.icon}
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-2 font-display group-hover:text-blue-600 transition-colors">
                      {t(tool.id) || tool.id}
                    </h3>

                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                      {t('professional_utility_desc')}
                    </p>

                    <div className="mt-auto flex items-center text-sm font-bold text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity">
                      {t('open_tool')}
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
