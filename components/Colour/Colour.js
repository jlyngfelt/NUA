import Image from "next/image";
import styles from "./Colour.module.css";
import { useState } from "react";
import { ContinueButton } from "../button/continueButton/ContinueButton";
import { ColorCustomization } from "../Hoodie/components/ColorCustomization";




export const Colour = ({ customColors, onColorChange, handleOnClick }) => {
  const [activeTab, setActiveTab] = useState(0);


  return (
    <div>

      <ColorCustomization
        customColors={customColors}
        onColorChange={onColorChange}
      />

      <ContinueButton onClick={handleOnClick}>Add to cart</ContinueButton>
    </div>
  );
};
