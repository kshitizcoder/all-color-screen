import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const DOMAIN = 'https://colorscreentest.online';
const CHANGE_FREQ = 'daily';
const PRIORITY_HOME = '1.0';
const PRIORITY_TOOL = '0.8';
const PRIORITY_COLOR = '0.8';

// --- DATA (Mirrors src/data/config.ts) ---
const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'de', name: 'Deutsch' },
    { code: 'nl', name: 'Nederlands' },
];

const COLORS = [
    { id: 'white' },
    { id: 'blue' },
    { id: 'red' },
    { id: 'orange' },
    { id: 'black' },
    { id: 'pink' },
    { id: 'green' },
    { id: 'yellow' },
];

const TOOLS = [
    { id: 'dvd-screensaver', path: 'dvd-screensaver' },
    { id: 'broken-screen', path: 'broken-screen' },
    { id: 'dead-pixel-test', path: 'dead-pixel-test' },
    { id: 'zoom-lighting', path: 'zoom-lighting' },
];

// --- SETUP ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname); // Script is in root
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const LOCALES_DIR = path.join(ROOT_DIR, 'src', 'locales');

// Ensure public dir exists
if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Function to get translation key if it exists
function getTranslationSlug(langCode, colorId) {
    try {
        const filePath = path.join(LOCALES_DIR, langCode, 'translation.json');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const json = JSON.parse(content);
            const key = `slug_${colorId}`;
            return json[key]; // Returns undefined if not found
        }
    } catch (e) {
        // ignore errors
    }
    return undefined;
}

// --- GENERATION ---
const urls = [];

// 1. Home Pages
LANGUAGES.forEach(lang => {
    const url = lang.code === 'en' ? DOMAIN : `${DOMAIN}/${lang.code}`;
    urls.push({ loc: url, priority: PRIORITY_HOME, changefreq: CHANGE_FREQ });
});

// 2. Color Pages
LANGUAGES.forEach(lang => {
    COLORS.forEach(color => {
        let slug = getTranslationSlug(lang.code, color.id);
        let pathSegment;

        if (lang.code === 'en') {
            pathSegment = slug || color.id;
            urls.push({
                loc: `${DOMAIN}/${pathSegment}`,
                priority: PRIORITY_COLOR,
                changefreq: CHANGE_FREQ
            });
        } else {
            // Logic from App.tsx: slug || `slug-${color.id}`
            pathSegment = slug || `slug-${color.id}`;
            urls.push({
                loc: `${DOMAIN}/${lang.code}/${pathSegment}`,
                priority: PRIORITY_COLOR,
                changefreq: CHANGE_FREQ
            });
        }
    });
});

// 3. Tool Pages
// App.tsx: "We use the same path for tools for now as we don't have translations"
LANGUAGES.forEach(lang => {
    TOOLS.forEach(tool => {
        if (lang.code === 'en') {
            urls.push({
                loc: `${DOMAIN}/${tool.path}`,
                priority: PRIORITY_TOOL,
                changefreq: CHANGE_FREQ
            });
        } else {
            urls.push({
                loc: `${DOMAIN}/${lang.code}/${tool.path}`,
                priority: PRIORITY_TOOL,
                changefreq: CHANGE_FREQ
            });
        }
    });
});

// 4. Construct XML
const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

urls.forEach(u => {
    xmlLines.push(`  <url>`);
    xmlLines.push(`    <loc>${u.loc}</loc>`);
    xmlLines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${u.priority}</priority>`);
    xmlLines.push(`  </url>`);
});

xmlLines.push('</urlset>');

const sitemapContent = xmlLines.join('\n');
const outputPath = path.join(PUBLIC_DIR, 'sitemap.xml');

fs.writeFileSync(outputPath, sitemapContent);
console.log(`Sitemap generated with ${urls.length} URLs at ${outputPath}`);
