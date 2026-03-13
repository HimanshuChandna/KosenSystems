'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Image
              src="/logos/Favicon_48x48_White_Transparent.svg"
              alt="Kosen Systems"
              width={120}
              height={35}
              className="footer-logo"
            />
            <p className="footer-tagline">
              Precision-engineered hardware modules for industrial and embedded applications.
            </p>
            <a href="mailto:himanshu@kosen.in" className="footer-email">
              himanshu@kosen.in
            </a>
          </div>

          {/* Products Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Products</h4>
            <Link href="/products?category=buck-converters" className="footer-link">DC-DC Buck Converters</Link>
            <Link href="/products?category=iot-boards" className="footer-link">IoT Development Boards</Link>
            <Link href="/products?category=modules" className="footer-link">Control Modules</Link>
            <Link href="/products?category=accessories" className="footer-link">Kits & Accessories</Link>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Resources</h4>
            <Link href="/tutorials" className="footer-link">Tutorials</Link>
            <Link href="/docs" className="footer-link">Documentation</Link>
            <Link href="/datasheets" className="footer-link">Datasheets</Link>
            <Link href="/firmware" className="footer-link">Firmware</Link>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <Link href="/contact" className="footer-link">Contact Us</Link>
            <Link href="/faq" className="footer-link">FAQ</Link>
            <Link href="/shipping" className="footer-link">Shipping Policy</Link>
            <Link href="/returns" className="footer-link">Returns & Refunds</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Kosen Systems. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link href="/terms" className="footer-bottom-link">Terms of Service</Link>
            <span className="footer-divider">·</span>
            <Link href="/privacy" className="footer-bottom-link">Privacy</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border);
          padding: 60px 0 0;
          margin-top: 80px;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .footer-logo {
          height: 28px;
          width: auto;
        }
        .footer-tagline {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          max-width: 280px;
        }
        .footer-email {
          color: var(--color-accent);
          text-decoration: none;
          font-size: 0.9rem;
          transition: opacity 0.2s;
        }
        .footer-email:hover {
          opacity: 0.8;
        }
        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-heading {
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-text-main);
          margin-bottom: 6px;
        }
        .footer-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--color-text-main);
        }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--color-border);
          padding: 20px 0;
        }
        .footer-copyright {
          color: var(--color-text-muted);
          font-size: 0.8rem;
          letter-spacing: 0.5px;
        }
        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-bottom-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.2s;
        }
        .footer-bottom-link:hover {
          color: var(--color-text-main);
        }
        .footer-divider {
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .footer {
            padding: 40px 0 0;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            padding: 16px 0;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
