'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const origPrice = product.originalPrice || product.original_price;
  const discount = origPrice
    ? Math.round(((origPrice - product.price) / origPrice) * 100)
    : 0;

  const hasImage = product.images && product.images.length > 0;
  const shortName = product.shortName || product.short_name || product.name;
  const description = product.description || '';

  return (
    <Link href={`/product/${product.id}`} className="product-card glass-card" id={`product-card-${product.id}`}>
      {/* Image */}
      <div className="product-card-image">
        {hasImage ? (
          <img src={product.images[0]} alt={product.name} className="product-card-img" />
        ) : (
          <div className="product-image-placeholder">
            <CircuitIcon />
          </div>
        )}
        {product.badge && (
          <span className={`product-badge badge ${
            product.badge === 'New' ? 'badge-accent' :
            product.badge === 'Best Seller' ? 'badge-success' :
            'badge-warning'
          }`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="discount-badge">-{discount}%</span>
        )}
      </div>

      {/* Info */}
      <div className="product-card-info">
        <span className="product-card-category">{getCategoryLabel(product.category)}</span>
        <h3 className="product-card-name">{shortName}</h3>
        <p className="product-card-desc">{description.substring(0, 80)}{description.length > 80 ? '...' : ''}</p>

        <div className="product-card-bottom">
          <div className="product-card-pricing">
            <span className="product-card-price">₹{product.price}</span>
            {origPrice && (
              <span className="product-card-original">₹{origPrice}</span>
            )}
          </div>
          <button
            className="product-card-add-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <PlusCartIcon />
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
          cursor: pointer;
        }
        .product-card-image {
          position: relative;
          padding: 16px;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .product-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }
        .product-card:hover .product-card-img {
          transform: scale(1.05);
        }
        .product-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 2;
        }
        .discount-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          background: var(--color-danger);
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .product-card-info {
          padding: 0 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .product-card-category {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-accent);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .product-card-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 8px;
          color: var(--color-text-main);
        }
        .product-card-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin-bottom: 16px;
          flex: 1;
        }
        .product-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .product-card-pricing {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .product-card-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .product-card-original {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          text-decoration: line-through;
        }
        .product-card-add-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--color-border-light);
          background: var(--color-bg-tertiary);
          color: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .product-card-add-btn:hover {
          background: var(--color-accent);
          color: var(--color-bg-primary);
          border-color: var(--color-accent);
          transform: scale(1.1);
        }
      `}</style>
    </Link>
  );
}

function getCategoryLabel(category) {
  const labels = {
    'buck-converters': 'Buck Converter',
    'iot-boards': 'IoT Board',
    'modules': 'Module',
    'accessories': 'Accessory',
  };
  return labels[category] || category;
}

function CircuitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, color: 'var(--color-text-muted)' }}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" />
      <path d="M20 9h3" /><path d="M20 14h3" /><path d="M1 9h3" /><path d="M1 14h3" />
    </svg>
  );
}

function PlusCartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" /><path d="M5 12h14" />
    </svg>
  );
}
