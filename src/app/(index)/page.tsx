import { DashboardPreview } from "./_components/dashboardPreview";
import { Features } from "./_components/features";
import  Footer  from "./_components/footer";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";
import { Reviews } from "./_components/reviews";

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
