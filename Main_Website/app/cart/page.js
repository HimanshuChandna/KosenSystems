'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="section-container" style={{ textAlign: 'center', padding: '100px 24px' }}>
          <div className="empty-cart-icon">
            <CartIcon />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Your Cart is Empty</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Add some modules and start building!
          </p>
          <Link href="/products" className="btn-primary" style={{ textDecoration: 'none' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 999 ? 0 : 60;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="cart-page">
      <div className="section-container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item glass-card" id={`cart-item-${item.id}`}>
                <div className="cart-item-image product-image-placeholder">
                  <CircuitIcon />
                </div>
                <div className="cart-item-info">
                  <Link href={`/product/${item.id}`} className="cart-item-name">
                    {item.shortName || item.name}
                  </Link>
                  <span className="cart-item-category">{item.category}</span>
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-price">
                  ₹{item.price * item.quantity}
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="cart-actions-row">
              <Link href="/products" className="btn-ghost">
                ← Continue Shopping
              </Link>
              <button className="btn-ghost" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary glass-card">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <div className="shipping-hint">
                Free shipping on orders over ₹999
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
            <Link href="/checkout" className="btn-primary checkout-btn" id="checkout-btn">
              Proceed to Checkout
            </Link>
            <div className="payment-methods">
              <span>We accept</span>
              <div className="payment-icons">
                <span className="payment-badge">UPI</span>
                <span className="payment-badge">Cards</span>
                <span className="payment-badge">Net Banking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          padding: 40px 0 80px;
        }
        .cart-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 32px;
        }
        .cart-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
        }
        .cart-count {
          color: var(--color-text-muted);
          font-size: 1rem;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }

        /* Cart Items */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }
        .cart-item-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          flex-shrink: 0;
          aspect-ratio: 1;
        }
        .cart-item-info {
          flex: 1;
          min-width: 0;
        }
        .cart-item-name {
          display: block;
          font-weight: 600;
          color: var(--color-text-main);
          text-decoration: none;
          font-size: 0.95rem;
          margin-bottom: 4px;
          transition: color 0.2s;
        }
        .cart-item-name:hover {
          color: var(--color-accent);
        }
        .cart-item-category {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-transform: capitalize;
        }
        .cart-item-qty {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border-light);
          border-radius: 6px;
          overflow: hidden;
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          background: var(--color-bg-tertiary);
          border: none;
          color: var(--color-text-main);
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.2s;
        }
        .qty-btn:hover {
          background: var(--color-bg-card-hover);
        }
        .qty-value {
          width: 36px;
          text-align: center;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .cart-item-price {
          font-weight: 700;
          font-size: 1rem;
          min-width: 70px;
          text-align: right;
        }
        .cart-item-remove {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.9rem;
          padding: 4px 8px;
          transition: color 0.2s;
        }
        .cart-item-remove:hover {
          color: var(--color-danger);
        }

        .cart-actions-row {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }

        /* Summary */
        .cart-summary {
          padding: 28px;
          position: sticky;
          top: 80px;
        }
        .summary-title {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 0.95rem;
          color: var(--color-text-secondary);
        }
        .summary-total {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .summary-divider {
          height: 1px;
          background: var(--color-border);
          margin: 8px 0;
        }
        .shipping-hint {
          font-size: 0.8rem;
          color: var(--color-accent);
          margin-bottom: 4px;
        }
        .checkout-btn {
          width: 100%;
          margin-top: 20px;
          text-decoration: none;
          text-align: center;
          padding: 14px;
          font-size: 1rem;
        }
        .payment-methods {
          margin-top: 20px;
          text-align: center;
        }
        .payment-methods > span {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          display: block;
          margin-bottom: 8px;
        }
        .payment-icons {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .payment-badge {
          padding: 4px 10px;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }

        .empty-cart-icon {
          margin-bottom: 20px;
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          .cart-item {
            flex-wrap: wrap;
          }
          .cart-item-info {
            flex: none;
            width: calc(100% - 96px);
          }
          .cart-item-qty {
            margin-left: 96px;
          }
          .cart-summary {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function CircuitIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2, color: 'var(--color-text-muted)' }}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 1v3" /><path d="M15 1v3" />
    </svg>
  );
}
