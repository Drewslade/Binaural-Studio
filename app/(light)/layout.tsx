import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LightLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Header variant="light" />
      <main className="flex-1">{children}</main>
      <Footer variant="light" />
    </div>
  );
}
