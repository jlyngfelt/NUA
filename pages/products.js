import Link from "next/link";
import { useState } from 'react';
import { Footer } from "../components/Footer/Footer";
import { Menu } from "../components/Menu/Menu";
import { Hoodie } from "../components/Hoodie";
import { ConfiguratorCard } from "../components/ComfiguratorCard/ConfiguratorCard";
import { Description } from "../components/Description/Description";
import { NavigationBanner } from "../components/NavigationBanner/NavigationBanner";

export default function ProductSelection() {
    const [customColors, setCustomColors] = useState({});

    const handleColorChange = (part, color) => {
      setCustomColors(prev => ({
        ...prev,
        [part]: color
      }));
    };

    const handleReset = () => {
      setCustomColors({});
    };


  return (
    <div>
      <Menu />

      <NavigationBanner/>
        <main >
      <Hoodie customColors={customColors} onColorChange={handleColorChange}/>
      <ConfiguratorCard customColors={customColors} onColorChange={handleColorChange} onReset={handleReset} />
        </main>
        <Description/>
      <Footer />
    </div>
  );
}