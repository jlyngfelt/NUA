import styles from "./ConfiguratorCard.module.css";
import {useState} from 'react';
import { FitAndSize } from "../FitAndSize/FitAndSize";
import { Material } from "../Material/Material";
import { Colour } from "../Colour/Colour";
import { calculateMaterialCost } from "../Hoodie/config/materialConfig";
import { ContinueButton } from "../button/continueButton/ContinueButton";

export const ConfiguratorCard = ({ customColors, onColorChange, materialSelections, onMaterialChange, onReset }) => {
  const [activeTab, setActiveTab] = useState(0);
  const materialCost = calculateMaterialCost(materialSelections);
  const basePrice = 450;
  const totalPrice = basePrice + materialCost;

  function handleOnClick() {
    setActiveTab(activeTab+1)
    }
  

  return (
    <div className={styles.configuratorCard}>
      <div className={styles.mainInfo}>
        <h1>Nua hoodie</h1>
        <h1>{totalPrice} kr</h1>
      </div>
      <h2>Estimated delivery time: 23 Sep 2025</h2>

      <div className={styles.tabMenu}>
        <button
          className={`${styles.tabMenuButton} ${
            activeTab === 0 ? styles.active : ""
          }`}
          onClick={() => setActiveTab(0)}
        >
          1.Fit & Size
        </button>
        <button
          className={`${styles.tabMenuButton} ${
            activeTab === 1 ? styles.active : ""
          }`}
          onClick={() => setActiveTab(1)}
        >
          2.Material
        </button>
        <button
          className={`${styles.tabMenuButton} ${
            activeTab === 2 ? styles.active : ""
          }`}
          onClick={() => setActiveTab(2)}
        >
          3.Colour
        </button>
      </div>
      
{
  {
    0: <FitAndSize handleOnClick={handleOnClick}/>,
    1: <Material handleOnClick={handleOnClick} materialSelections={materialSelections} onMaterialChange={onMaterialChange}/>,
    2: <Colour customColors={customColors} onColorChange={onColorChange} handleOnClick={handleOnClick}/>
  }[activeTab]
}


<div className={styles.configuratorButtons}>
  <ContinueButton onClick={handleOnClick}>{activeTab === 0 || activeTab === 1 ?  "Continue" : "Add to cart"}</ContinueButton>
    <div className={styles.smallButtons}>
    <button onClick={onReset}>Reset</button>
    <button>Share link</button>
    <button>Save design</button>
    </div>
</div>

    </div>
  );
};
