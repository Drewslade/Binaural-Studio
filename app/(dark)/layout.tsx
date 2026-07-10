import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DarkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <Header variant="dark" />
      <main className="flex-1">{children}</main>
      <Footer variant="dark" />
    </div>
  );
}
