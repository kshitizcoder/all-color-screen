import { Routes, Route } from "react-router-dom";
import ColorScreen from "./commonUi/ColorScreen";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { COLORS, LANGUAGES, TOOLS } from "./data/config";
import i18n from "./i18n";
import DVDScreensaver from "./tools/DVDScreensaver";
import BrokenScreen from "./tools/BrokenScreen";
import DeadPixelTest from "./tools/DeadPixelTest";
import ZoomLighting from "./tools/ZoomLighting";

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "dvd-screensaver": DVDScreensaver,
  "broken-screen": BrokenScreen,
  "dead-pixel-test": DeadPixelTest,
  "zoom-lighting": ZoomLighting,
};

export default function App() {
  return (
    <Routes>
      {/* English Routes (Root) */}
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
        {COLORS.map((color) => {
          const slug = i18n.getResource(
            "en",
            "translation",
            `slug_${color.id}`
          );
          return (
            <Route
              key={color.id}
              path={slug || color.id}
              element={
                <ColorScreen
                  colorId={color.id}
                  hex={color.hex}
                  textColor={color.text}
                />
              }
            />
          );
        })}
        {TOOLS.map((tool) => {
          const Component = TOOL_COMPONENTS[tool.id];
          return (
            <Route key={tool.id} path={tool.path} element={<Component />} />
          );
        })}
      </Route>

      {/* Other Languages */}
      {LANGUAGES.filter((l) => l.code !== "en").map((lang) => (
        <Route key={lang.code} path={lang.code} element={<MainLayout />}>
          <Route index element={<Home />} />
          {COLORS.map((color) => {
            const slug = i18n.getResource(
              lang.code,
              "translation",
              `slug_${color.id}`
            );
            return (
              <Route
                key={color.id}
                path={slug || `slug-${color.id}`}
                element={
                  <ColorScreen
                    colorId={color.id}
                    hex={color.hex}
                    textColor={color.text}
                  />
                }
              />
            );
          })}
          {TOOLS.map((tool) => {
            const Component = TOOL_COMPONENTS[tool.id];
            // We use the same path for tools for now as we don't have translations
            return (
              <Route key={tool.id} path={tool.path} element={<Component />} />
            );
          })}
        </Route>
      ))}

      {/* 404 Not Found - Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
