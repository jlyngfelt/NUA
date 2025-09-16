import Link from 'next/link'
import Hoodie from '../components/Hoodie'

export default function Home() {
  return (
    <div>
        <nav>
        {/* Din navbar här */}
      </nav>
         <div>
        {/* Första bilden med knapp som ska vara död */}
        <div>
          <img src="/bild1.jpg" alt="Bild 1" />
          <button disabled>Kommer snart</button>
        </div>
        
        {/* Andra bilden med knapp som leder vidare */}
        <div>
          <img src="/bild2.jpg" alt="Bild 2" />
          <Link href="/product-selection">
            <button>Gå vidare</button>
          </Link>
        </div>
      </div>
       <footer>
        {/* Din footer här */}
      </footer>
      
    </div>
  )
}