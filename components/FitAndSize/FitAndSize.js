import Image from "next/image";
import styles from "./FitAndSize.module.css";
import {useState} from 'react';
import {ContinueButton} from '../button/continueButton/ContinueButton';

export const FitAndSize = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
<div>
<div className={styles.sizeContainer}>
    <h3>Size:</h3>
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

<div className={styles.fitContainer}>

</div>
<ContinueButton>Continue</ContinueButton>

</div>
    )
}