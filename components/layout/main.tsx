import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen max-w-screen-xl mx-auto">{children}</main>
      <Footer />
    </>
  );
}
