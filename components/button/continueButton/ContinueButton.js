import Image from "next/image";
import styles from "./ContinueButton.module.css";
import {useState} from 'react';

export const ContinueButton = ({children}) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <>
<button className={styles.button}>{children}</button>
        </>
    )
}