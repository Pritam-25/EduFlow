import CelebrationCard from "@/components/celebration-card";
import WelcomeCard from "@/components/welcome-card";

export default function Home() {
  return (
    <div className="container mx-auto flex gap-4 flex-col px-4 md:px-6 lg:px-8 py-8">
      <h1>Welcome to the Home Page</h1>
      <CelebrationCard/>
      <WelcomeCard/>
    </div>
  );
}
