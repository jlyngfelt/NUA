import Image from "next/image";
import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.buttonLogoGroup}>
        <Image src="/icons/LogoLarge.png" alt="Logo" width={193} height={80} />

        <div className={styles.menuContainer}>
          <div className={styles.buttonGroup}>
            <button className={styles.button}>Q&A</button>
            <button className={styles.button}>Contact</button>
            <button className={styles.button}>Support</button>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.buttonGroup}>
            <button className={styles.button}>Delivery</button>
            <button className={styles.button}>About us</button>
            <button className={styles.button}>Return Policy</button>
          </div>
        </div>
      </div>
      <div className={styles.socialMedia}>
        <h2>Follow us</h2>
        <div className={styles.iconContainer}>
        <Image src="/icons/IconFb.png" alt="Logo" width={48} height={48} className={styles.icon} />
        <Image src="/icons/IconInsta.png" alt="Logo" width={48} height={48} className={styles.icon}/>
        <Image src="/icons/IconLinkedIn.png" alt="Logo" width={48} height={48} className={styles.icon} />
        <Image src="/icons/IconTikTok.png" alt="Logo" width={48} height={48} className={styles.icon}/>
        </div>
      </div>
    </footer>
  );
};
