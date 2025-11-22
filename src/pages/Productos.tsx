import { ProductCard } from "../components/ProductCard";
import { Section } from "../components/Section";
import { products } from "../content/products";
import { useCart } from "../context/CartContext";

export function ProductosPage() {
  const { addItem } = useCart();

  const handleAdd = (id: string, name: string, price: string) => {
    const numeric = Number(
      price.replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".")
    );
    addItem({ id, name, price: Number.isFinite(numeric) ? numeric : 0 });
  };

  return (
    <>
      <Section
        kicker="Catálogo"
        title="Productos 100% naturales"
        subtitle="CBD orgánico de máxima concentración, formulado para bienestar cotidiano."
        variant="catalogo"
        id="productos"
      >
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} onAdd={handleAdd} />
          ))}
        </div>
      </Section>

      <Section
        kicker="Logística"
        title="Envíos en 24 horas a todo el país"
        subtitle="Despachamos en 24 horas por correo o transporte, con embalaje cuidado para que llegue perfecto."
        id="envios"
      >
        <div className="card stack">
          <ul className="muted">
            <li>Envíos express en CABA y GBA en menos de 12 horas.</li>
            <li>Interior del país con tracking en tiempo real y seguro incluido.</li>
            <li>Pick-up concertado para profesionales o ventas mayoristas.</li>
          </ul>
          <div className="pill">Seguimiento automático • Embalaje discreto</div>
        </div>
      </Section>

      <Section
        kicker="Pagos"
        title="Cuotas y medios disponibles"
        subtitle="Elegí el medio que mejor se adapte: tarjetas, transferencias o links de pago."
        id="pagos"
      >
        <div className="grid">
          <div className="card stack">
            <h3>Tarjetas</h3>
            <p className="muted">Hasta 3 cuotas sin interés en bancos seleccionados.</p>
          </div>
          <div className="card stack">
            <h3>Transferencia</h3>
            <p className="muted">5% off abonando por transferencia o cuenta DNI.</p>
          </div>
          <div className="card stack">
            <h3>Links de pago</h3>
            <p className="muted">Enviamos link directo y factura digital.</p>
          </div>
        </div>
      </Section>

      <Section
        kicker="Profesionales"
        title="Programa mayorista"
        subtitle="Acompañamos a clínicas, terapeutas y distribuidores con stock asegurado."
        id="mayoristas"
      >
        <div className="card stack">
          <p>
            Packs desde 12 unidades, fichas técnicas personalizadas y soporte para onboarding de
            pacientes.
          </p>
          <ul className="muted">
            <li>Listados exclusivos con márgenes sugeridos.</li>
            <li>Entrega escalonada o almacenaje sin costo.</li>
            <li>Acompañamiento comercial y materiales de marca.</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
