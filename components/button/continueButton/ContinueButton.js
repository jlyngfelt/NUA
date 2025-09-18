
import styles from "./ContinueButton.module.css";


export const ContinueButton = ({children, onClick}) => {
   

    return (
        <>
<button className={styles.button} onClick={onClick}>{children}</button>
        </>
    )
}