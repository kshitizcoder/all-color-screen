
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Seo from "../commonUi/Seo";

const DVDScreensaver = () => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [color, setColor] = useState('#ff0000');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [speed, setSpeed] = useState(2); // Lowered speed default from 3 to 2

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    // Physics state ref-based
    const positionRef = useRef({ x: 50, y: 50 });
    const velocityRef = useRef({ x: 3, y: 3 });
    const logoRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);

    // Update velocity ref when speed changes, maintaining direction
    useEffect(() => {
        const currentVel = velocityRef.current;
        const speedMultiplier = speed;
        // Normalize and apply new speed
        const dirX = currentVel.x > 0 ? 1 : -1;
        const dirY = currentVel.y > 0 ? 1 : -1;
        velocityRef.current = { x: dirX * speedMultiplier, y: dirY * speedMultiplier };
    }, [speed]);

    useEffect(() => {
        const update = () => {
            if (!containerRef.current || !logoRef.current) return;

            const container = containerRef.current;
            const logo = logoRef.current;
            const { clientWidth: cw, clientHeight: ch } = container;
            const { clientWidth: lw, clientHeight: lh } = logo;

            let { x, y } = positionRef.current;
            let { x: vx, y: vy } = velocityRef.current;

            x += vx;
            y += vy;

            let hit = false;

            // Check boundaries
            if (x <= 0) {
                x = 0;
                vx = Math.abs(vx);
                hit = true;
            } else if (x + lw >= cw) {
                x = cw - lw;
                vx = -Math.abs(vx);
                hit = true;
            }

            if (y <= 0) {
                y = 0;
                vy = Math.abs(vy);
                hit = true;
            } else if (y + lh >= ch) {
                y = ch - lh;
                vy = -Math.abs(vy);
                hit = true;
            }

            positionRef.current = { x, y };
            velocityRef.current = { x: vx, y: vy };

            logo.style.transform = `translate(${x}px, ${y}px)`;

            if (hit) {
                const nextColor = colors[Math.floor(Math.random() * colors.length)];
                setColor(nextColor);
            }

            animationRef.current = requestAnimationFrame(update);
        };

        animationRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationRef.current);
    }, []); // Empty dependency array as we use refs for mutable state

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            if (containerRef.current) {
                containerRef.current.requestFullscreen().catch(err => {
                    console.log(err);
                });
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

    // "Remove border ... and all tool screen muti screen"
    // I am interpreting "muti screen" here as responsive/filling the container, 
    // similar to how ColorScreen does, removing 'border-4' and 'max-w-4xl'.
    // Adjusted container styling: 
    // - Removed 'border-4 border-gray-800'
    // - Removed 'max-w-4xl'
    // - Changed 'h-[500px]' to 'h-[calc(100vh-200px)] min-h-[400px]' for a better "screen" feel

    return (
        <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="flex flex-col items-center mb-12 sm:mb-16">
                <Seo title={t('dvd-screensaver')} description={t('dvd-screensaver-desc')} />
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight text-center">
                    {t('dvd-screensaver')}
                </h1>
                <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start max-w-7xl mx-auto">
                <div className="lg:col-span-8 flex flex-col">
                    <div
                        ref={containerRef}
                        className={`bg-black relative overflow-hidden group shadow-2xl transition-all duration-700 w-full select-none
                            ${isFullscreen ? 'fixed inset-0 w-screen h-screen z-[100] rounded-none' : 'aspect-video rounded-[2.5rem] cursor-pointer border border-slate-200/50'}
                        `}
                        onClick={() => !isFullscreen && toggleFullscreen()}
                    >
                        {!isFullscreen && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none scale-95 group-hover:scale-100">
                                <div className="px-6 py-3 rounded-2xl glass font-black text-white text-lg tracking-tight bg-black/40 shadow-2xl uppercase">
                                    {t('click-to-fullscreen')}
                                </div>
                            </div>
                        )}

                        <div
                            ref={logoRef}
                            className="absolute top-0 left-0 px-8 py-5 rounded-2xl font-black text-3xl sm:text-4xl border-4 shadow-2xl transition-colors duration-200 select-none uppercase tracking-tighter"
                            style={{
                                color: color,
                                borderColor: color,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                boxShadow: `0 0 40px ${color}33`
                            }}
                        >
                            {t('dvd')}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 w-full">
                    <div className="sticky top-24 lg:top-32 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{t('simulator_settings')}</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                                    <span>{t('logo_speed')}</span>
                                    <span className="text-indigo-600">{speed}x</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={speed}
                                    onChange={(e) => setSpeed(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {t('dvd-screensaver-desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DVDScreensaver;
