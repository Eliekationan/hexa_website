import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Services />
      <Stats />
      <Process />
      <Projects />
      <Testimonials />
      <Faq />
    </main>
  );
}
