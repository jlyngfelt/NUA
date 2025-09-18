import Image from "next/image";
import Link from "next/link";
import styles from "./Landingpage.module.css";
import { useState } from "react";

export const Landingpage = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.imageContainer}>
        <Image
          src="/images/Landing_page_Image__button_left.png"
          alt="Hoodie"
          width={0}
          height={0}
          sizes="50vw"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <button className={styles.button}>Browse collection</button>
      </div>

      <div className={styles.imageContainer}>
         <Image
          src="/images/Landing_page_Image__button_right.png"
          alt="Hoodie"
          width={0}
          height={0}
          sizes="50vw"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Link href="/products">
          <button className={styles.button}>Design your own</button>
        </Link>
      </div>
    </div>
  );
};
