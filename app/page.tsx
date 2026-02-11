import  Hero from "@/components/landing/hero"
import Navbar from "@/components/landing/Navbar"
import Features from "@/components/landing/features"
import Footer from "@/components/landing/footer";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/FAQ";


export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen display-block relative">
      <Navbar />
      <Hero />
      <Features/>
      <Testimonials />
      <FAQ />
      <Footer />

    </div>
  );
}
