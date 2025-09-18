import Link from "next/link";
import { useState } from 'react';
import { Footer } from "../components/Footer/Footer";
import { Menu } from "../components/Menu/Menu";
import { Hoodie } from "../components/Hoodie";
import { ConfiguratorCard } from "../components/ComfiguratorCard/ConfiguratorCard";
import { Description } from "../components/Description/Description";
import { defaultColors } from "../components/Hoodie/config/colorConfig";
import { NavigationBanner } from "../components/NavigationBanner/NavigationBanner";

export default function ProductSelection() {
    const [customColors, setCustomColors] = useState(defaultColors);

    const handleColorChange = (part, color) => {
      setCustomColors(prev => ({
        ...prev,
        [part]: color
      }));
    };

  return (
    <div>
      <Menu />

      <NavigationBanner/>
        <main >
      <Hoodie customColors={customColors} onColorChange={handleColorChange}/>
      <ConfiguratorCard customColors={customColors} onColorChange={handleColorChange} />
        </main>
        <Description/>
      <Footer />
    </div>
  );
}