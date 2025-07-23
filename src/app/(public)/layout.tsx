import Navbar from "./(index)/_components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto">
      <Navbar />
      <div className="mt-6 mx-4">
        {children}
      </div>
    </section>
  );
}
