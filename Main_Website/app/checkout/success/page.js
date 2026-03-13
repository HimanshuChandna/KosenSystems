'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="success-page section-container">
      <div className="glass-card success-card">
        <div className="success-icon">✔️</div>
        <h1>Payment Successful!</h1>
        <p className="order-msg">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        
        <div className="order-details">
          <p>Order ID: <span>#{orderId}</span></p>
          <p>Status: <span className="status-badge">Confirmed</span></p>
        </div>

        <div className="next-steps">
          <h3>What&apos;s next?</h3>
          <p>You will receive an email confirmation with your order details shortly. Our team will begin processing your order for shipment.</p>
        </div>

        <div className="action-btns">
          <Link href="/" className="btn-primary">Return to Home</Link>
          <Link href="/products" className="btn-ghost">Browse More</Link>
        </div>
      </div>

      <style jsx>{`
        .success-page {
          padding-top: 80px;
          padding-bottom: 100px;
          display: flex;
          justify-content: center;
        }
        .success-card {
          width: 100%;
          max-width: 600px;
          padding: 48px;
          text-align: center;
          animation: slideUp 0.5s ease;
        }
        .success-icon {
          width: 80px;
          height: 80px;
          background: var(--color-success);
          color: white;
          border-radius: 50%;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.4);
        }
        h1 {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .order-msg {
          color: var(--color-text-secondary);
          font-size: 1.1rem;
          margin-bottom: 32px;
        }
        .order-details {
          background: var(--color-bg-tertiary);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 32px;
          text-align: left;
        }
        .order-details p {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }
        .order-details p:last-child {
          margin-bottom: 0;
        }
        .order-details span {
          font-weight: 600;
          color: var(--color-text-main);
        }
        .status-badge {
          color: var(--color-success) !important;
        }
        .next-steps {
          text-align: left;
          margin-bottom: 40px;
        }
        .next-steps h3 {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .next-steps p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .action-btns {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .success-card { padding: 32px 24px; }
          .action-btns { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading result...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
