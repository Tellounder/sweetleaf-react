import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FloatingCart } from "./FloatingCart";
import { HighlightsBar } from "./HighlightsBar";

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="site-shell">
      <Header />
      <HighlightsBar />
      <main className="page">
        <Outlet />
      </main>
      {!isAdmin && <FloatingCart />}
      <Footer />
    </div>
  );
}
