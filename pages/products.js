import Link from "next/link";
import { Footer } from "../components/Footer/Footer";
import { Menu } from "../components/Menu/Menu";
import { Hoodie } from "../components/Hoodie";
import { ConfiguratorCard } from "../components/ComfiguratorCard/ConfiguratorCard";
import { Description } from "../components/Description/Description";

export default function ProductSelection() {
  return (
    <div>
      <Menu />

      <h1>produktsida</h1>
        <main >
      <Hoodie />
      <ConfiguratorCard/>
        </main>
        <Description/>
      <Footer />
    </div>
  );
}
