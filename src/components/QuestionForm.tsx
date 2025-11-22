import { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "541127975134";

export function QuestionForm() {
  const { items, total } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const cartSummary = useMemo(() => {
    if (items.length === 0) return "Sin productos en carrito";
    return items
      .map((item) => `${item.name} x${item.qty} ($${item.price * item.qty})`)
      .join(" | ");
  }, [items]);

  const sendToWhatsApp = () => {
    const text = `Hola Sweet Leaf, soy ${name || "cliente"}.
Email: ${email || "no informado"}
Consulta: ${message || "N/A"}
Carrito: ${cartSummary}
Total estimado: $${total}
Más info: https://sweetleaf-riodelaplata.web.app`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="card stack contact-card">
      <h3>¿Dudas? Escribinos</h3>
      <p className="muted">Te respondemos por WhatsApp al instante.</p>
      <label className="form-label">
        Nombre
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
        />
      </label>
      <label className="form-label">
        Email (opcional)
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
      </label>
      <label className="form-label">
        Tu mensaje
        <textarea
          className="form-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Contanos qué necesitás"
        />
      </label>
      <button className="btn btn-primary" type="button" onClick={sendToWhatsApp}>
        <img src="/img/logo.jpeg" alt="Sweet Leaf" className="share-icon" />
        Enviar a WhatsApp
      </button>
    </div>
  );
}
