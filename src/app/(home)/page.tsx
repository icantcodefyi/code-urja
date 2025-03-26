import Contact from "~/components/cards/contact";
import FeaturesCards from "~/components/cards/FeaturesCards";
import ProductPreview from "~/components/cards/ProductPreview";
import FAQSection from "~/components/faq";
import Features from "~/components/features";
import Grids from "~/components/grids";
import Header from "~/components/header";
import { Hero } from "~/components/hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <FeaturesCards />
      <ProductPreview />
      <Header
        badge="Products"
        title="Use and Transfer Your Interview Data with AI"
        subtitle="Experience seamless interview management with AI-powered transcription, analysis, and insights - helping you make better hiring decisions."
      />

      <Grids />
      <FAQSection />
      <Contact />
    </div>
  );
}
