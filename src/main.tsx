import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { Layout } from "./components/Layout.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { CBDPage } from "./pages/CBD.tsx";
import { Home } from "./pages/Home.tsx";
import { ProductosPage } from "./pages/Productos.tsx";
import { PetPage } from "./pages/Pet.tsx";
import { IacaPage } from "./pages/Iaca.tsx";
import { DesignContentProvider } from "./context/DesignContentContext.tsx";
import { AdminPage } from "./pages/Admin.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "cbd", element: <CBDPage /> },
      { path: "productos", element: <ProductosPage /> },
      { path: "pet", element: <PetPage /> },
      { path: "iaca", element: <IacaPage /> },
      { path: "admin", element: <AdminPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DesignContentProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </DesignContentProvider>
  </StrictMode>
);
