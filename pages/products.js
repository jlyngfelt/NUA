import Link from "next/link";
import { useState } from 'react';
import { Footer } from "../components/Footer/Footer";
import { Menu } from "../components/Menu/Menu";
import { Hoodie } from "../components/Hoodie";
import { ConfiguratorCard } from "../components/ComfiguratorCard/ConfiguratorCard";
import { Description } from "../components/Description/Description";
import { NavigationBanner } from "../components/NavigationBanner/NavigationBanner";
import { defaultMaterialSelections, calculateMaterialCost } from "../components/Hoodie/config/materialConfig";

export default function ProductSelection() {
    const [customColors, setCustomColors] = useState({});
    const [materialSelections, setMaterialSelections] = useState(defaultMaterialSelections);

    const handleColorChange = (part, color) => {
      setCustomColors(prev => ({
        ...prev,
        [part]: color
      }));
    };

    const handleMaterialChange = (partId, materialId) => {
      setMaterialSelections(prev => ({
        ...prev,
        [partId]: materialId
      }));
    };

    const handleReset = () => {
      setCustomColors({});
      setMaterialSelections(defaultMaterialSelections);
    };

    const materialCost = calculateMaterialCost(materialSelections);


  return (
    <div>
      <Menu />

      <NavigationBanner/>
        <main >
      <Hoodie
        customColors={customColors}
        onColorChange={handleColorChange}
        materialSelections={materialSelections}
      />
      <ConfiguratorCard
        customColors={customColors}
        onColorChange={handleColorChange}
        materialSelections={materialSelections}
        onMaterialChange={handleMaterialChange}
        onReset={handleReset}
      />
        </main>
        <Description/>
      <Footer />
    </div>
  );
}