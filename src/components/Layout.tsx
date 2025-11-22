import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FloatingCart } from "./FloatingCart";
import { HighlightsBar } from "./HighlightsBar";

export function Layout() {
  return (
    <div className="site-shell">
      <Header />
      <HighlightsBar />
      <main className="page">
        <Outlet />
      </main>
      <FloatingCart />
      <Footer />
    </div>
  );
}
