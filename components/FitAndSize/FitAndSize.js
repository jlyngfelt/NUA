import Image from "next/image";
import styles from "./FitAndSize.module.css";
import { useState } from "react";
import { ContinueButton } from "../button/continueButton/ContinueButton";

export const FitAndSize = ({ handleOnClick }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeFit, setActiveFit] = useState(0);


  return (
    <div className={styles.fitAndSize}>
      <div className={styles.sizeContainer}>
        <h3>Size:</h3>

        <div className={styles.sizes}>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 0 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(0)}
          >
            xs
          </button>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 1 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            s
          </button>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 2 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            m
          </button>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 3 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(3)}
          >
            l
          </button>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 4 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(4)}
          >
            xl
          </button>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 5 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(5)}
          >
            xxl
          </button>
          <button
            className={`${styles.tabMenuButton} ${
              activeTab === 6 ? styles.active : ""
            }`}
            onClick={() => setActiveTab(6)}
          >
            3xl
          </button>
        </div>
        <div className={styles.sizeGuide}>
        <p>Size guide</p>
        </div>
      </div>

        <h3>Fit:</h3>
      <div className={styles.imageContainer}>
  <div 
    className={`${styles.fitWrapper} ${activeFit === 1 ? styles.activeFit : ''}`}
    onClick={() => setActiveFit(1)}
  >
    <Image
      src="/images/TightFit1.png"
      alt="Tight Fit Hoodie"
      width={0}
      height={0}
      sizes="50vw"
      className={styles.fit}
    />
  </div>

  <div 
    className={`${styles.fitWrapper} ${activeFit === 2 ? styles.activeFit : ''}`}
    onClick={() => setActiveFit(2)}
  >
    <Image
      src="/images/LooseFit1.png"
      alt="Loose Fit Hoodie"
      width={0}
      height={0}
      sizes="50vw"
      className={styles.fit}
    />
  </div>
</div>
    </div>
  );
};
