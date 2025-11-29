import { ProductCard } from "../components/ProductCard";
import { Section } from "../components/Section";
import { useCart } from "../context/CartContext";
import { parsePrice } from "../utils/price";
import { useDesignBlocks } from "../context/DesignContentContext";

export function ProductosPage() {
  const { addItem } = useCart();
  const { blocks } = useDesignBlocks();
  const catalogBlock = blocks["catalog.products"];
  const logisticsBlock = blocks["section.logistics"];
  const paymentsBlock = blocks["section.payments"];
  const wholesaleBlock = blocks["section.wholesale"];
  const showCatalog =
    (catalogBlock.display ?? true) && catalogBlock.__meta.isPublished;
  const showLogistics =
    (logisticsBlock.display ?? true) && logisticsBlock.__meta.isPublished;
  const showPayments =
    (paymentsBlock.display ?? true) && paymentsBlock.__meta.isPublished;
  const showWholesale =
    (wholesaleBlock.display ?? true) && wholesaleBlock.__meta.isPublished;

  const handleAdd = (id: string, name: string, price: string) => {
    addItem({ id, name, price: parsePrice(price) });
  };

  return (
    <>
      {showCatalog && (
        <Section
          kicker={catalogBlock.kicker}
          title={catalogBlock.title}
          subtitle={catalogBlock.subtitle}
          variant="catalogo"
          id="productos"
        >
          <div className="grid">
            {catalogBlock.products.map((product) => (
              <ProductCard key={product.id} {...product} onAdd={handleAdd} />
            ))}
          </div>
        </Section>
      )}

      {showLogistics && (
        <Section
          kicker={logisticsBlock.kicker}
          title={logisticsBlock.title}
          subtitle={logisticsBlock.subtitle}
          id="envios"
        >
          <div className="card stack">
            <ul className="muted">
              {logisticsBlock.bullets.map((item, idx) => (
                <li key={`logistic-${idx}`}>{item}</li>
              ))}
            </ul>
            <div className="pill">{logisticsBlock.pill}</div>
          </div>
        </Section>
      )}

      {showPayments && (
        <Section
          kicker={paymentsBlock.kicker}
          title={paymentsBlock.title}
          subtitle={paymentsBlock.subtitle}
          id="pagos"
        >
          <div className="grid">
            {paymentsBlock.options.map((option) => (
              <div key={option.title} className="card stack">
                <h3>{option.title}</h3>
                <p className="muted">{option.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {showWholesale && (
        <Section
          kicker={wholesaleBlock.kicker}
          title={wholesaleBlock.title}
          subtitle={wholesaleBlock.subtitle}
          id="mayoristas"
        >
          <div className="card stack">
            <p>{wholesaleBlock.paragraph}</p>
            <ul className="muted">
              {wholesaleBlock.bullets.map((item, idx) => (
                <li key={`wholesale-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </>
  );
}
