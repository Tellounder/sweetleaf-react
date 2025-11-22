import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "541127975134";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CheckoutModal({ open, onClose }: Props) {
  const { items, total } = useCart();
  const [countdown, setCountdown] = useState(10);
  const [purchased, setPurchased] = useState(false);
  const hasItems = items.length > 0;

  useEffect(() => {
    if (!open) {
      setCountdown(10);
      setPurchased(false);
      return;
    }
    const interval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (purchased && countdown === 0) {
      window.location.href = "/";
    }
  }, [countdown, purchased]);

  const handleBuy = () => {
    if (!items.length) return;
    const summary = items
      .map(
        (i) =>
          `${i.name} x${i.qty} ($${new Intl.NumberFormat("es-AR").format(
            i.price * i.qty
          )})`
      )
      .join(" | ");
    const text = `Nuevo pedido Sweet Leaf:%0A${summary}%0ATotal estimado: $${new Intl.NumberFormat(
      "es-AR"
    ).format(total)}%0APor favor confirmame disponibilidad y envío.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, "_blank");
    setPurchased(true);
  };

  if (!open) return null;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h3>Resumen de compra</h3>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div className="checkout-body">
          {hasItems ? (
            items.map((item) => (
              <div key={item.id} className="checkout-item">
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">x{item.qty}</p>
                </div>
                <span className="price">
                  ${new Intl.NumberFormat("es-AR").format(item.price * item.qty)}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">Agregá productos para finalizar.</p>
          )}
        </div>
        <div className="checkout-footer">
          <div>
            <span>Total</span>
            <strong>
              ${new Intl.NumberFormat("es-AR").format(total)}
            </strong>
          </div>
          <button
            className="btn btn-primary"
            disabled={!hasItems}
            onClick={handleBuy}
          >
            Comprar ahora
          </button>
        </div>
        {purchased && (
          <div className="checkout-countdown">
            Gracias por tu compra. Volviendo al inicio en {countdown}s
          </div>
        )}
      </div>
    </div>
  );
}
