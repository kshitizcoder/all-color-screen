
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from "../commonUi/Seo";

const ZoomLighting = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [temperature, setTemperature] = useState(50); // 0 = warm, 100 = cool
    const [brightness, setBrightness] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Warm (Candle): 2000K (#ff9329) -> Neutral: 5000K (#ffffff) -> Cool: 9000K (#cafffb)
    const getBackgroundColor = () => {
        let r, g, b;

        if (temperature < 50) {
            // Warm to Neutral (White)
            const p = temperature / 50;
            r = 255;
            g = Math.round(147 + (255 - 147) * p);
            b = Math.round(41 + (255 - 41) * p);
        } else {
            // Neutral to Cool
            const p = (temperature - 50) / 50;
            r = Math.round(255 - (255 - 214) * p);
            g = Math.round(255 - (255 - 234) * p);
            b = 255;
        }

        return `rgb(${r}, ${g}, ${b})`;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            // We request fullscreen on the container
            if (containerRef.current) {
                containerRef.current.requestFullscreen().catch(e => console.error(e));
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

    const bgColor = getBackgroundColor();

    // Removed borders, full width container
    return (
        <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="flex flex-col items-center mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight text-center">
                    {t('zoom-lighting')}
                </h1>
                <Seo title={t('zoom-lighting')} description={t('zoom-lighting-desc')} />
                <div className="w-12 h-1.5 bg-amber-500 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start max-w-7xl mx-auto">
                {/* The Preview Box */}
                <div className="lg:col-span-8 flex flex-col">
                    <div
                        ref={containerRef}
                        className={`relative overflow-hidden group shadow-2xl transition-all duration-700 flex items-center justify-center w-full select-none
                            ${isFullscreen ? 'fixed inset-0 w-screen h-screen z-[100] rounded-none' : 'aspect-video rounded-[2.5rem] border border-slate-200/50 shadow-slate-200/50'}
                        `}
                        style={{
                            backgroundColor: bgColor,
                        }}
                    >
                        {/* Brightness Overlay (Darkness) */}
                        <div
                            className="absolute inset-0 pointer-events-none transition-opacity duration-100"
                            style={{
                                backgroundColor: 'black',
                                opacity: 1 - (brightness / 100)
                            }}
                        />

                        {/* Controls UI - Centered in Fullscreen */}
                        <div className={`z-10 bg-black/80 backdrop-blur-2xl p-10 rounded-[2.5rem] text-white w-full max-w-md shadow-2xl transition-all duration-500 border border-white/10 ${isFullscreen ? 'opacity-0 hover:opacity-100 translate-y-4 hover:translate-y-0' : 'opacity-100 hidden sm:block'}`}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">{t('video-call-lighting')}</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50 px-1">
                                        <span>{t('color-temperature')}</span>
                                        <span className="text-amber-400">{temperature < 50 ? t('warm') : t('cool')}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={temperature}
                                        onChange={(e) => setTemperature(Number(e.target.value))}
                                        className="w-full h-2 bg-gradient-to-r from-orange-400 via-white to-blue-200 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50 px-1">
                                        <span>{t('brightness')}</span>
                                        <span className="text-amber-400">{brightness}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="w-full h-2 bg-gradient-to-r from-gray-900 to-white rounded-lg appearance-none cursor-pointer accent-white border border-white/10"
                                    />
                                </div>

                                <button
                                    onClick={toggleFullscreen}
                                    className="w-full py-4.5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
                                >
                                    {isFullscreen ? t('exit-fullscreen') : t('enter-fullscreen')}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Action Hint */}
                        <div className="sm:hidden absolute inset-0 flex items-center justify-center p-6 text-center">
                            <button onClick={toggleFullscreen} className="px-8 py-4 bg-black/60 backdrop-blur-xl rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl border border-white/10">
                                {t('enter-fullscreen')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="lg:col-span-4 w-full">
                    <div className="sticky top-24 lg:top-32 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">{t('pro_tip')}</h2>
                        </div>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium">
                            {t('zoom-lighting-desc')}
                        </p>
                        <div className="mt-8 pt-8 border-t border-slate-100 hidden lg:block">
                            <div className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                        <span>{t('color-temperature')}</span>
                                        <span className="text-amber-600">{temperature < 50 ? t('warm') : t('cool')}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={temperature}
                                        onChange={(e) => setTemperature(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                        <span>{t('brightness')}</span>
                                        <span className="text-amber-600">{brightness}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ZoomLighting;
