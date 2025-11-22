import { useState } from "react";
import { useCart } from "../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";
import { useEffect } from "react";

export function FloatingCart() {
  const { items, total, count, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    const openHandler = () => setOpen(true);
    window.addEventListener("toggleCart", handler as EventListener);
    window.addEventListener("openCart", openHandler as EventListener);
    return () => {
      window.removeEventListener("toggleCart", handler as EventListener);
      window.removeEventListener("openCart", openHandler as EventListener);
    };
  }, []);

  return (
    <div className="cart-shell">
      <button className="cart-fab" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-cart-shopping cart-fab-icon" aria-hidden />
        <span>Carrito</span>
        <span className="cart-count">{count}</span>
      </button>
      {open && (
        <div className="cart-panel">
          <div className="cart-header">
            <div>
              <strong>Tu carrito</strong>
              <p className="muted">{count} items</p>
            </div>
            <button className="btn btn-secondary" onClick={clear}>
              Vaciar
            </button>
          </div>
          <div className="cart-list">
            {items.length === 0 ? (
              <p className="muted">Sin productos aún</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">x{item.qty}</p>
                  </div>
                  <span className="price">
                    ${new Intl.NumberFormat("es-AR").format(item.price * item.qty)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="cart-footer">
            <span>Total</span>
            <strong>${new Intl.NumberFormat("es-AR").format(total)}</strong>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            disabled={items.length === 0}
            onClick={() => setCheckoutOpen(true)}
          >
            Comprar ahora
          </button>
        </div>
      )}
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
