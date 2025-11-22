type OfferCardProps = {
  title: string;
  description: string;
  price: string;
  oldPrice?: string;
  tag?: string;
  bonus?: string;
};

export function OfferCard({
  title,
  description,
  price,
  oldPrice,
  tag,
  bonus,
  onAdd,
}: OfferCardProps & { onAdd?: (title: string, price: string) => void }) {
  return (
    <div className="card offer-card stack">
      <div className="offer-header">
        {tag && <span className="offer-tag">{tag}</span>}
        <h3>{title}</h3>
      </div>
      <p className="muted">{description}</p>
      <div className="offer-footer">
        <div className="stack" style={{ gap: 4 }}>
          <span className="price">Precio: {price}</span>
          {oldPrice && <span className="pvp">PVP sugerido: {oldPrice}</span>}
        </div>
        {bonus && <span className="chip">{bonus}</span>}
      </div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => onAdd?.(title, price)}
      >
        Añadir al carrito
      </button>
    </div>
  );
}
