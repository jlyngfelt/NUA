import Image from "next/image";
import styles from "./ConfiguratorCard.module.css";
import {useState} from 'react';

export const ConfiguratorCard = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.configuratorCard}>
      <div className={styles.mainInfo}>
        <h1>Nua Hoodie</h1>
        <h1>450kr</h1>
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
          

    </div>
  );
};
