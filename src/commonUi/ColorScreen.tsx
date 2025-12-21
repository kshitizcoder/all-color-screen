
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import DownloadPanel from "./DownloadPanel";

type ColorScreenProps = {
  colorId: string;
  hex: string;
  textColor: string;
};
import { COLORS } from "../data/config";
import { Link } from "react-router-dom";
import i18n from "../i18n";
import Seo from "../commonUi/Seo";
const ColorScreen: React.FC<ColorScreenProps> = ({ colorId, hex, textColor }) => {
  const { t, } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [showTranslations, setShowTranslations] = useState(false);

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const rootElement = document.documentElement;
    if (!document.fullscreenElement) {
      rootElement.requestFullscreen().catch((err) => {
        console.error(`Error requesting fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // const toggleTranslations = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setShowTranslations(!showTranslations);
  // };

  if (isFullscreen) {
    return (
      <div
        style={{ backgroundColor: hex }}
        className={`fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center cursor-pointer ${textColor}`}
        onClick={toggleFullscreen}
      >

      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
      <Seo
        title={t(colorId)}
        description={t('description', { color: t(colorId) })}
      />

      <div className="flex flex-col items-center mb-10 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          {t(colorId)}
        </h1>
        <div className="w-16 h-1.5 bg-blue-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Color Screen & Details */}

        <div className="lg:col-span-8 flex flex-col">
          <div
            style={{ backgroundColor: hex }}
            className={`w-full aspect-video relative shadow-2xl rounded-2xl sm:rounded-3xl
                               transition-all duration-500 hover:shadow-blue-500/10 cursor-pointer flex items-center justify-center group border border-slate-200/50 overflow-hidden select-none`}
            onClick={toggleFullscreen}
          >
            {/* Interactive Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

            {/* Text UI inside the box */}
            <div className={`px-6 py-3 rounded-2xl glass font-black text-xl sm:text-3xl tracking-tight opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ${textColor} font-display`}>
              {t('click-to-fullscreen')}
            </div>

            {/* Corner Accent (Professional touch) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

            {/* Fullscreen Button */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="absolute bottom-6 right-6 p-3 text-slate-900 bg-white/90 rounded-2xl hover:bg-white hover:scale-110 transition-all shadow-xl backdrop-blur-xl border border-white/50 ring-1 ring-slate-900/5"
              title={t('fullscreen')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l-5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          <div className="mt-10 p-8 sm:p-10 glass-card rounded-3xl">
            <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight font-display">{t('about_this_color')}</h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {t('description', { color: t(colorId) })}
            </p>
          </div>
        </div>

        {/* Right Column: Download Panel */}
        <div className="lg:col-span-4 w-full">
          <div className="sticky top-24 lg:top-32 anim-fade-in">
            <DownloadPanel hex={hex} colorName={t(colorId)} />
          </div>
        </div>
      </div>
      <div className="mb-24 sm:mb-32 mt-10">
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
    </div>

  );
};

export default ColorScreen;
