import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>

      <Navbar />

      <Hero />

      <Features />

      <HowItWorks />

      <Testimonials />

      <Pricing />

      {/* Final CTA */}
      <section className="bg-[#050516] py-24 text-center text-white">

        <h2 className="text-4xl font-bold">
          Ready to ace your interview?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Join thousands of successful candidates who used
          MockInterview to prepare for their dream jobs.
        </p>

      </section>

      <Footer />

    </div>
  );
}

export default Home;