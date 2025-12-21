
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type DownloadPanelProps = {
    hex: string;
    colorName: string;
};

const PRESETS = [
    { name: "SD (854 x 480)", width: 854, height: 480, id: "480p" },
    { name: "HD (1280 x 720)", width: 1280, height: 720, id: "720p" },
    { name: "Full HD (1920 x 1080)", width: 1920, height: 1080, id: "fhd" },
    { name: "2K Quad HD (2560 x 1440)", width: 2560, height: 1440, id: "2k" },
    { name: "4K UHD (3840 x 2160)", width: 3840, height: 2160, id: "4k" },
    { name: "8K UHD (7680 x 4320)", width: 7680, height: 4320, id: "8k" },
    { name: "Custom", width: 0, height: 0, id: "custom" },
];

const DownloadPanel: React.FC<DownloadPanelProps> = ({ hex, colorName }) => {
    const { t } = useTranslation();
    const [selectedPreset, setSelectedPreset] = useState("fhd");
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);
    const [selectedHex, setSelectedHex] = useState(hex);
    const [isDownloading, setIsDownloading] = useState(false);

    React.useEffect(() => {
        setSelectedHex(hex);
    }, [hex]);

    const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presetId = e.target.value;
        setSelectedPreset(presetId);

        if (presetId !== "custom") {
            const preset = PRESETS.find(p => p.id === presetId);
            if (preset) {
                setWidth(preset.width);
                setHeight(preset.height);
            }
        }
    };

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => { // Subtle delay for feel
            try {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                if (ctx) {
                    ctx.fillStyle = selectedHex;
                    ctx.fillRect(0, 0, width, height);

                    const link = document.createElement("a");
                    let finalName = colorName;
                    if (selectedHex !== hex) {
                        finalName = `custom-${selectedHex.replace('#', '')}`;
                    }

                    const safeName = finalName.toLowerCase().replace(/[^a-z0-9]/g, "-");
                    link.download = `${safeName}-${width}x${height}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                }
            } catch (error) {
                console.error("Download failed:", error);
            } finally {
                setIsDownloading(false);
            }
        }, 600);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 w-full transition-all">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {t("download_wallpaper")}
                </h3>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                    {t('custom_color')}
                </label>
                <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl ring-4 ring-slate-50 shadow-sm cursor-pointer hover:scale-105 transition-transform overflow-hidden group">
                        <input
                            type="color"
                            value={selectedHex}
                            onChange={(e) => setSelectedHex(e.target.value)}
                            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 p-0 m-0 border-0 cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            value={selectedHex}
                            onChange={(e) => setSelectedHex(e.target.value)}
                            className="block w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm font-bold text-slate-700 uppercase"
                        />
                    </div>
                </div>
            </div>

            {/* Resolution Selection */}
            <div className="mb-6">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                    {t('select_resolution')}
                </label>
                <div className="relative group">
                    <select
                        value={selectedPreset}
                        onChange={handlePresetChange}
                        className="block w-full pl-4 pr-12 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700 rounded-2xl appearance-none cursor-pointer transition-all"
                    >
                        {PRESETS.map((preset) => (
                            <option key={preset.id} value={preset.id}>{preset.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* Custom Inputs */}
            {selectedPreset === "custom" && (
                <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in-down">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('width')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="block w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700"
                                placeholder="1920"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">PX</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('height')}</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="block w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700"
                                placeholder="1080"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">PX</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Download Button */}
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="group relative w-full overflow-hidden px-4 py-4.5 bg-blue-600 rounded-2xl text-white font-black tracking-tight shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {isDownloading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>{t('generating')}</span>
                        </>
                    ) : (
                        <>
                            <span>{t('download_high_res')}</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </div>
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-full block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {t('ready_for_processing')}
                </p>
            </div>
        </div>
    );
};

export default DownloadPanel;
