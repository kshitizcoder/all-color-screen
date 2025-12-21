import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import brokenScreenImg from '../assets/broken_screen_hd.png';
import Seo from "../commonUi/Seo";

const BrokenScreen = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (containerRef.current) {
                containerRef.current.requestFullscreen().catch(err => console.log(err));
            }
        } else {
            document.exitFullscreen();
        }
    };

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 sm:py-20">
            <Seo title={t('broken-screen')} description={t('broken-screen-desc')} />
            <div className="flex flex-col items-center mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight text-center">
                    {t('broken-screen')}
                </h1>
                <div className="w-12 h-1.5 bg-red-500 rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto">
                <div
                    ref={containerRef}
                    className={`bg-black relative overflow-hidden group shadow-2xl transition-all duration-700 w-full select-none
                        ${isFullscreen ? 'fixed inset-0 w-screen h-screen z-[100] rounded-none cursor-none' : 'aspect-video rounded-3xl cursor-pointer border border-white/50 shadow-slate-200'}
                    `}
                    onClick={() => !isFullscreen && toggleFullscreen()}
                >
                    <img
                        src={brokenScreenImg}
                        alt="Broken Screen"
                        className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none transition-transform duration-700 group-hover:scale-[1.02]"
                    />

                    {!isFullscreen && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-50 pointer-events-none scale-95 group-hover:scale-100">
                            <div className="px-6 py-3 rounded-2xl glass font-black text-white text-lg tracking-tight bg-black/60 shadow-2xl">
                                {t('click-to-fullscreen-prank')}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 p-8 sm:p-10 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                    <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{t('prank_instructions')}</h2>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
                        {t('broken-screen-desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};


export default BrokenScreen;
