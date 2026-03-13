'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal, clearCart } = useCart();
  const isDirect = searchParams.get('direct') === 'true';

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    // Inject Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isDirect) {
      const directData = sessionStorage.getItem('direct_checkout');
      if (directData) {
        try {
          const item = JSON.parse(directData);
          setCheckoutItems([item]);
          setTotal(item.product.price * item.quantity);
        } catch (e) {
          router.push('/products');
        }
      } else {
        router.push('/products');
      }
    } else {
      if (cartItems.length === 0) {
        router.push('/products');
      } else {
        setCheckoutItems(cartItems.map(item => ({ product: item, quantity: item.quantity })));
        setTotal(cartTotal);
      }
    }
  }, [cartItems, cartTotal, isDirect, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create order on server
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          items: checkoutItems.map(i => ({
            id: i.product.id,
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price
          }))
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Kosen Systems',
        description: 'Electronic Hardware Purchase',
        image: '/logo.png', // Update with actual logo path
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify payment on server
          const verifyRes = await fetch('/api/checkout/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shipping_info: shippingInfo,
              items: checkoutItems.map(i => ({
                id: i.product.id,
                name: i.product.name,
                quantity: i.quantity,
                price: i.product.price
              })),
              total: total
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            if (!isDirect) clearCart();
            sessionStorage.removeItem('direct_checkout');
            router.push(`/checkout/success?order_id=${verifyData.order_id}`);
          } else {
            setError(verifyData.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: {
          color: '#00d4ff',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page section-container">
      <h1 className="page-title">Checkout</h1>
      
      <div className="checkout-layout">
        {/* Shipping Form */}
        <div className="checkout-main">
          <form className="glass-card shipping-form" onSubmit={handlePayment}>
            <h2 className="section-title">Shipping Information</h2>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={shippingInfo.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={shippingInfo.email} 
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={shippingInfo.phone} 
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Shipping Address</label>
                <textarea 
                  name="address" 
                  required 
                  rows={3} 
                  value={shippingInfo.address} 
                  onChange={handleInputChange}
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>
              
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  required 
                  value={shippingInfo.city} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>State</label>
                <input 
                  type="text" 
                  name="state" 
                  required 
                  value={shippingInfo.state} 
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Pincode</label>
                <input 
                  type="text" 
                  name="pincode" 
                  required 
                  pattern="[0-9]{6}" 
                  value={shippingInfo.pincode} 
                  onChange={handleInputChange}
                  placeholder="XXXXXX"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary pay-btn" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${total}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="checkout-sidebar">
          <div className="glass-card summary-card">
            <h2 className="section-title">Order Summary</h2>
            <div className="items-list">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <div className="item-img-container">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <div className="item-placeholder">📦</div>
                    )}
                    <span className="item-qty">{item.quantity}</span>
                  </div>
                  <div className="item-info">
                    <span className="item-name">{item.product.short_name || item.product.name}</span>
                    <span className="item-price">₹{item.product.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-footer">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="trust-badges">
              <span>🔒 Secure Payment</span>
              <span>💳 via Razorpay</span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .checkout-page {
          padding-top: 40px;
          padding-bottom: 80px;
        }
        .page-title {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 32px;
          text-align: center;
        }
        .checkout-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 32px;
          align-items: start;
        }
        .section-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .shipping-form {
          padding: 32px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .form-group label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .form-group input, .form-group textarea {
          padding: 12px 14px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-main);
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--color-accent);
        }
        .pay-btn {
          width: 100%;
          margin-top: 32px;
          padding: 14px;
          font-size: 1.1rem;
        }
        .error-message {
          margin-top: 16px;
          padding: 12px;
          background: rgba(255, 82, 82, 0.1);
          border: 1px solid var(--color-danger);
          color: var(--color-danger);
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .summary-card {
          padding: 24px;
          position: sticky;
          top: 100px;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .summary-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .item-img-container {
          position: relative;
          width: 56px;
          height: 56px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }
        .item-placeholder {
          font-size: 1.2rem;
        }
        .item-qty {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-accent);
          color: var(--color-bg-primary);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .item-name {
          font-size: 0.9rem;
          font-weight: 500;
        }
        .item-price {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .summary-footer {
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--color-text-secondary);
        }
        .free {
          color: var(--color-success);
          font-weight: 600;
        }
        .summary-row.total {
          margin-top: 8px;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .trust-badges {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 992px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .checkout-sidebar {
            order: -1;
          }
          .summary-card {
            position: static;
          }
        }
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .page-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="section-container" style={{padding: '100px 0', textAlign: 'center'}}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
