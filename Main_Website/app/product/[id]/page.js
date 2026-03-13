'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProduct(data);
        // Fetch related products from same category
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);
        setRelatedProducts(related || []);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="section-container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)' }}>Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Product Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const origPrice = product.original_price;
  const discount = origPrice
    ? Math.round(((origPrice - product.price) / origPrice) * 100)
    : 0;

  const hasImages = product.images && product.images.length > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    // Save current product to session for single-item checkout
    const checkoutItem = {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        short_name: product.short_name
      },
      quantity: quantity
    };
    sessionStorage.setItem('direct_checkout', JSON.stringify(checkoutItem));
    router.push('/checkout?direct=true');
  };

  return (
    <div className="product-detail-page">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{product.short_name || product.name}</span>
        </nav>

        {/* Product Main Content */}
        <div className="product-main">
          {/* Image Section */}
          <div className="product-gallery">
            <div className="product-image-main">
              {hasImages ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="product-main-img"
                />
              ) : (
                <div className="product-image-placeholder product-image-large">
                  <CircuitIcon />
                </div>
              )}
            </div>
            {/* Thumbnail Strip */}
            {hasImages && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb-btn ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="thumb-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="product-info">
            {product.badge && (
              <span className={`badge ${
                product.badge === 'New' ? 'badge-accent' :
                product.badge === 'Best Seller' ? 'badge-success' :
                product.badge === 'Featured' ? 'badge-accent' :
                'badge-warning'
              }`}>
                {product.badge}
              </span>
            )}

            <h1 className="product-name">{product.name}</h1>
            <p className="product-desc">{product.description}</p>

            {/* Pricing */}
            <div className="product-pricing">
              <span className="product-price">₹{product.price}</span>
              {origPrice && (
                <>
                  <span className="product-original-price">₹{origPrice}</span>
                  <span className="product-discount">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.in_stock ? (
                <span className="in-stock">
                  <CheckIcon /> In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="product-actions">
              <div className="quantity-control">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="action-buttons-group">
                <button className="btn-secondary add-to-cart-btn" onClick={handleAddToCart} id="add-to-cart-btn">
                  <CartIcon /> Add to Cart
                </button>
                <button className="btn-primary buy-now-btn" onClick={handleBuyNow} id="buy-now-btn">
                  <ZapIcon /> Buy Now
                </button>
              </div>
            </div>

            {/* Quick Features */}
            <div className="quick-features">
              {product.features && product.features.slice(0, 4).map((feat, i) => (
                <div key={i} className="feature-item">
                  <CheckIcon /> <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            <button
              className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              Documentation
            </button>
          </div>

          <div className="tab-content glass-card">
            {activeTab === 'specs' && product.specs && (
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-key">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'features' && product.features && (
              <ul className="features-list">
                {product.features.map((feat, i) => (
                  <li key={i} className="feature-list-item">
                    <CheckIcon /> {feat}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'docs' && (
              <div className="docs-tab-content">
                <div className="doc-item">
                  <DatasheetIcon />
                  <div>
                    <h4>Datasheet</h4>
                    <p>{product.datasheet ? 'Available for download' : 'Coming soon'}</p>
                  </div>
                  {product.datasheet && (
                    <button className="btn-ghost">Download</button>
                  )}
                </div>
                <div className="doc-item">
                  <SchematicIcon />
                  <div>
                    <h4>Schematic</h4>
                    <p>Circuit diagram and reference design</p>
                  </div>
                  <button className="btn-ghost">Coming Soon</button>
                </div>
                <div className="doc-item">
                  <CodeFileIcon />
                  <div>
                    <h4>Firmware Examples</h4>
                    <p>Arduino &amp; MicroPython code samples</p>
                  </div>
                  <button className="btn-ghost">Coming Soon</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-section">
            <h2 className="section-heading">Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/product/${p.id}`} className="related-card glass-card">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} className="related-img-real" />
                  ) : (
                    <div className="product-image-placeholder related-img">
                      <CircuitIcon />
                    </div>
                  )}
                  <div className="related-info">
                    <h3>{p.short_name || p.name}</h3>
                    <span className="related-price">₹{p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .product-detail-page {
          padding: 24px 0 80px;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
          font-size: 0.85rem;
        }
        .breadcrumb-link {
          color: var(--color-text-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb-link:hover {
          color: var(--color-text-main);
        }
        .breadcrumb-sep {
          color: var(--color-text-muted);
          opacity: 0.5;
        }
        .breadcrumb-current {
          color: var(--color-text-secondary);
        }

        /* Main Layout */
        .product-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 60px;
        }

        .product-gallery {
          position: sticky;
          top: 80px;
          align-self: start;
        }
        .product-image-main {
          border-radius: 12px;
          overflow: hidden;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          max-height: 500px;
        }
        .product-image-large {
          border-radius: 12px;
          min-height: 400px;
        }
        .product-thumbnails {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .thumb-btn {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid var(--color-border);
          background: var(--color-bg-tertiary);
          cursor: pointer;
          padding: 0;
          transition: border-color 0.2s;
        }
        .thumb-btn.active {
          border-color: var(--color-accent);
        }
        .thumb-btn:hover {
          border-color: var(--color-accent);
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .product-name {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 8px;
        }
        .product-desc {
          color: var(--color-text-secondary);
          font-size: 1rem;
          line-height: 1.6;
        }

        .product-pricing {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-top: 8px;
        }
        .product-price {
          font-size: 2rem;
          font-weight: 700;
        }
        .product-original-price {
          font-size: 1.1rem;
          color: var(--color-text-muted);
          text-decoration: line-through;
        }
        .product-discount {
          font-size: 0.85rem;
          color: var(--color-success);
          font-weight: 600;
        }

        .stock-status {
          font-size: 0.9rem;
        }
        .in-stock {
          color: var(--color-success);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .out-of-stock {
          color: var(--color-danger);
        }

        /* Actions */
        .product-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }
        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border-light);
          border-radius: 8px;
          overflow: hidden;
        }
        .qty-btn {
          width: 40px;
          height: 40px;
          background: var(--color-bg-tertiary);
          border: none;
          color: var(--color-text-main);
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .qty-btn:hover:not(:disabled) {
          background: var(--color-bg-card-hover);
        }
        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .qty-value {
          width: 48px;
          text-align: center;
          font-weight: 600;
          background: var(--color-bg-secondary);
        }
        .action-buttons-group {
          flex: 1;
          display: flex;
          gap: 12px;
        }
        .add-to-cart-btn {
          flex: 1;
          padding: 12px 16px;
          font-size: 0.95rem;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          color: var(--color-text-main);
        }
        .add-to-cart-btn:hover {
          background: var(--color-bg-card-hover);
          border-color: var(--color-accent);
        }
        .buy-now-btn {
          flex: 1.2;
          padding: 12px 16px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Features */
        .quick-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--color-border);
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        /* Tabs */
        .product-tabs {
          margin-bottom: 60px;
        }
        .tabs-header {
          display: flex;
          gap: 0;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 0;
        }
        .tab-btn {
          padding: 14px 24px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--color-text-muted);
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: var(--color-text-main);
        }
        .tab-btn.active {
          color: var(--color-accent);
          border-bottom-color: var(--color-accent);
        }

        .tab-content {
          padding: 32px;
          border-top: none;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
        }
        .specs-table tr {
          border-bottom: 1px solid var(--color-border);
        }
        .specs-table tr:last-child {
          border-bottom: none;
        }
        .spec-key {
          padding: 14px 16px 14px 0;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          width: 40%;
          font-weight: 500;
        }
        .spec-value {
          padding: 14px 0;
          color: var(--color-text-main);
          font-size: 0.9rem;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .feature-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-text-secondary);
          font-size: 0.95rem;
        }

        .docs-tab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .doc-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
        }
        .doc-item h4 {
          font-size: 0.95rem;
          margin-bottom: 2px;
        }
        .doc-item p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .doc-item .btn-ghost {
          margin-left: auto;
          white-space: nowrap;
        }

        /* Related */
        .related-section {
          margin-top: 20px;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }
        .related-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }
        .related-img {
          height: 180px;
          border-radius: 12px 12px 0 0;
        }
        .related-img-real {
          height: 180px;
          width: 100%;
          object-fit: cover;
          border-radius: 12px 12px 0 0;
        }
        .related-info {
          padding: 16px;
        }
        .related-info h3 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .related-price {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-accent);
        }

        @media (max-width: 768px) {
          .product-main {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .product-gallery {
            position: static;
          }
          .product-image-main {
            min-height: 280px;
          }
          .product-actions {
            flex-direction: column;
          }
          .add-to-cart-btn {
            width: 100%;
          }
          .tabs-header {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

/* Icon Components */
function CircuitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2, color: 'var(--color-text-muted)' }}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" />
      <path d="M20 9h3" /><path d="M20 14h3" /><path d="M1 9h3" /><path d="M1 14h3" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DatasheetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function SchematicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" />
    </svg>
  );
}

function CodeFileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
