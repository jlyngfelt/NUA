import Link from "next/link";
import Hoodie from "../components/Hoodie";
import {Footer} from '../components/Footer/Footer'
import {Menu} from '../components/Menu/Menu'


export default function Home() {
  return (
    <div>
      <Menu/>

      <div>
        <div>
          <img src="/bild1.jpg" alt="Bild 1" />
          <button disabled>Browse collection</button>
        </div>

        <div>
          <img src="/bild2.jpg" alt="Bild 2" />
          <Link href="/products">
            <button>Design your own</button>
          </Link>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}
