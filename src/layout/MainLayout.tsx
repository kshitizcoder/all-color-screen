
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../commonUi/Navbar";
import { LANGUAGES } from "../data/config";

const MainLayout = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // Determine language from URL path
    const pathSegments = location.pathname.split("/");
    // pathSegments[0] is empty string (before first /)
    // pathSegments[1] is the first segment
    const firstSegment = pathSegments[1];

    const langConfig = LANGUAGES.find(l => l.code === firstSegment);

    if (langConfig) {
      if (i18n.language !== langConfig.code) {
        i18n.changeLanguage(langConfig.code);
      }
      // Set direction if needed (for Arabic)
      document.dir = langConfig.dir || 'ltr';
      document.documentElement.lang = langConfig.code;
    } else {
      if (i18n.language !== 'en') {
        i18n.changeLanguage("en");
      }
      document.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [location.pathname, i18n]);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};
export default MainLayout;
