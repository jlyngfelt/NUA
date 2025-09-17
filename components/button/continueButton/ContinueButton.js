import Image from "next/image";
import styles from "./ContinueButton.module.css";
import {useState} from 'react';

export const ContinueButton = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <>
<button className={styles.button}>Continue</button>
        </>
    )
}