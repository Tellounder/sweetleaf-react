type Product = {
  id: string;
  name: string;
  price: string;
  suggested: string;
  description: string;
  image: string;
};

export function ProductCard({
  id,
  name,
  price,
  suggested,
  description,
  image,
  onAdd,
}: Product & { onAdd?: (id: string, name: string, price: string) => void }) {
  return (
    <div className="card product-card">
      <div className="product-image">
        <img src={image} alt={name} loading="lazy" />
      </div>
      <div className="stack">
        <h3>{name}</h3>
        <p className="muted">{description}</p>
        <div className="product-meta">
          <span className="price">Precio: {price}</span>
          <span className="pvp">PVP sugerido: {suggested}</span>
        </div>
        <div>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => onAdd?.(id, name, price)}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
