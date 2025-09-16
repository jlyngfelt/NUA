import styles from './Menu.module.css'
import Image from 'next/image'

export const Menu = () => {

    return (
        <nav className={styles.nav}>

<div>

        <button className={styles.button}>Jackets</button>
        <button className={styles.button}>Trousers</button>
        <button className={styles.button}>Shoes</button>
</div>

<Image 
        src="/icons/LogoSmall.png" 
        alt="Logo"
        width={85}
        height={25}
      />

<div>

        <button className={styles.button}>Cart</button>
        <button className={styles.button}>Account</button>
</div>

        </nav>
)
}