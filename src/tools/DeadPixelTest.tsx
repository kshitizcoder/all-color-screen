
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from "../commonUi/Seo";

const DeadPixelTest = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [colorIndex, setColorIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Defaulting to show instructions initially if not fullscreen
    const [showInstructions, setShowInstructions] = useState(true);

    const colors = [
        { hex: '#FFFFFF', name: t('white') },
        { hex: '#000000', name: t('black') },
        { hex: '#FF0000', name: t('red') },
        { hex: '#00FF00', name: t('green') },
        { hex: '#0000FF', name: t('blue') },
        { hex: '#FFFF00', name: t('yellow') },
        { hex: '#00FFFF', name: t('cyan') },
        { hex: '#FF00FF', name: t('magenta') },
        { hex: '#808080', name: t('gray-50') },
    ];

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (containerRef.current) {
                containerRef.current.requestFullscreen().catch(err => console.log(err));
            }
        } else {
            // Usually people want to exit with Esc or specialized button, but allowing toggle here is fine.
            // For dead pixel test, click usually means "Next Color" in fullscreen.
            // We'll handle click logic carefully.
        }
    };

    const handleFullscreenChange = () => {
        const isFull = !!document.fullscreenElement;
        setIsFullscreen(isFull);
        if (isFull) {
            setShowInstructions(false); // Auto hide simple instructions on enter
        } else {
            setShowInstructions(true);
        }
    };

    useEffect(() => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const nextColor = () => {
        setColorIndex((prev) => (prev + 1) % colors.length);
    };

    const prevColor = (e: React.MouseEvent) => {
        e.stopPropagation();
        setColorIndex((prev) => (prev - 1 + colors.length) % colors.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') {
                setColorIndex((prev) => (prev + 1) % colors.length);
            } else if (e.key === 'ArrowLeft') {
                setColorIndex((prev) => (prev - 1 + colors.length) % colors.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const currentColor = colors[colorIndex];

    const handleBoxClick = () => {
        if (!isFullscreen) {
            toggleFullscreen();
        } else {
            nextColor();
        }
    };

    // Removed borders, full width
    return (
        <div className="container mx-auto px-4 py-12 sm:py-20">
            <Seo title={t('dead-pixel-test')} description={t('dead-pixel-test-desc')} />
            <div className="flex flex-col items-center mb-12 sm:mb-16">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight text-center">
                    {t('dead-pixel-test')}
                </h1>
                <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto">
                <div
                    ref={containerRef}
                    className={`relative group shadow-2xl transition-all duration-700 w-full select-none
                        ${isFullscreen ? 'fixed inset-0 w-screen h-screen z-[100] rounded-none cursor-none' : 'aspect-video rounded-[2.5rem] cursor-pointer border border-slate-200/50 shadow-slate-200/50'}
                    `}
                    style={{ backgroundColor: currentColor.hex }}
                    onClick={handleBoxClick}
                >
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 pointer-events-none ${isFullscreen ? (showInstructions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : 'opacity-100 translate-y-0'}`}>
                        <div className="bg-black/80 text-white p-8 rounded-3xl backdrop-blur-2xl text-center max-w-md pointer-events-auto border border-white/10 shadow-2xl">
                            {!isFullscreen ? (
                                <>
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-black mb-3 tracking-tight">{t('click-to-start')}</h2>
                                    <p className="text-white/60 font-medium px-4">{t('enters-fullscreen')}</p>
                                </>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">{t('currently_testing')}</p>
                                        <h2 className="text-3xl font-black tracking-tight">{currentColor.name}</h2>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={(e) => { e.stopPropagation(); prevColor(e); }} className="flex-1 py-4 bg-white/10 rounded-2xl font-black hover:bg-white/20 transition-all active:scale-95">{t('prev')}</button>
                                        <button onClick={(e) => { e.stopPropagation(); nextColor(); }} className="flex-1 py-4 bg-white text-black rounded-2xl font-black hover:bg-white/90 transition-all active:scale-95">{t('next')}</button>
                                    </div>
                                    <p className="mt-6 text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                                        {t('dead_pixel_instruction')}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-8 sm:p-10 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                    <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{t('how_to_use')}</h2>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
                        {t('dead-pixel-test-desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};


export default DeadPixelTest;
