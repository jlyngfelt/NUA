import Link from "next/link";
import Hoodie from "../components/Hoodie";
import Image from "next/image";
import { Footer } from "../components/Footer/Footer";
import { Menu } from "../components/Menu/Menu";
import { Landingpage } from "../components/Landingpage/Landingpage";

export default function Home() {
  return (
    <div>
      <Menu />

<Landingpage/>

      <Footer />
    </div>
  );
}
