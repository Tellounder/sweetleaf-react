import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FloatingCart } from "./FloatingCart";
import { HighlightsBar } from "./HighlightsBar";

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="admin-site-shell">
        <main className="admin-page">
          <Outlet />
        </main>
      </div>
    );
  }

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
