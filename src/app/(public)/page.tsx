import { Hero } from "./(index)/_components/hero";
import { DashboardPreview } from "./(index)/_components/dashboardPreview";
import { Features } from "./(index)/_components/features";
import { Reviews } from "./(index)/_components/reviews";
import { Pricing } from "./(index)/_components/pricing";
import Footer from "./(index)/_components/footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <div className="container mx-auto max-w-screen px-4 md:px-6 lg:px-8 space-y-24 sm:space-y-16  ">
        <Hero />
        <DashboardPreview />
        <Features />
        <Reviews />
        <Pricing />
        <Footer />
      </div>
    </main>
  );
}
