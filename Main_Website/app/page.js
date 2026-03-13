'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowserClient();
      const [prodRes, catRes, tutRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('tutorials').select('*').eq('published', true).limit(3),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setTutorials(tutRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.badge).slice(0, 4);
  const newArrivals = products.slice(0, 3);

  return (
    <div className="homepage">
      {/* ===== Hero Section ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid-pattern"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="section-container hero-content">
          <div className="hero-badge badge badge-accent">Precision Engineering</div>
          <h1 className="hero-title">
            Power Electronics
            <br />
            <span className="hero-highlight">Engineered Right</span>
          </h1>
          <p className="hero-subtitle">
            High-efficiency DC-DC converters, IoT development boards, and embedded
            modules — built for engineers, by engineers.
          </p>
          <div className="hero-actions">
            <Link href="/products" className="btn-primary hero-cta">
              Shop All Products
              <ArrowRightIcon />
            </Link>
            <Link href="/tutorials" className="btn-secondary">
              Browse Tutorials
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">96%</span>
              <span className="hero-stat-label">Efficiency</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">{products.length}+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-num">-40°C</span>
              <span className="hero-stat-label">Op. Temp</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="section featured-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-heading">Featured Products</h2>
              <p className="section-subheading">Our most popular modules and boards</p>
            </div>
            <Link href="/products" className="btn-ghost">
              View All
              <ArrowRightIcon />
            </Link>
          </div>
          <div className="product-grid">
            {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4)).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="section categories-section">
        <div className="section-container">
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subheading">Find the right module for your project</p>
          <div className="category-grid">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="category-card glass-card"
                id={`category-${cat.id}`}
              >
                <span className="category-icon">{cat.icon}</span>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.description}</p>
                <span className="category-count">{cat.product_count} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== New Arrivals ===== */}
      <section className="section arrivals-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-heading">New Arrivals</h2>
              <p className="section-subheading">Latest additions to our catalog</p>
            </div>
          </div>
          <div className="product-grid">
            {products.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Tutorials Preview ===== */}
      <section className="section tutorials-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-heading">Tutorials & Guides</h2>
              <p className="section-subheading">Learn to build with Kosen modules</p>
            </div>
            <Link href="/tutorials" className="btn-ghost">
              All Tutorials
              <ArrowRightIcon />
            </Link>
          </div>
          <div className="tutorial-grid">
            {tutorials.slice(0, 3).map(tut => (
              <article key={tut.id} className="tutorial-card glass-card" id={`tutorial-${tut.id}`}>
                <div className="tutorial-meta">
                  <span className="badge badge-accent">{tut.category}</span>
                  <span className="tutorial-difficulty">{tut.difficulty}</span>
                </div>
                <h3 className="tutorial-title">{tut.title}</h3>
                <p className="tutorial-excerpt">{tut.excerpt}</p>
                <div className="tutorial-footer">
                  <span className="tutorial-read-time">
                    <ClockIcon /> {tut.read_time}
                  </span>
                  <span className="tutorial-read-link">
                    Read Guide <ArrowRightIcon />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Documentation CTA ===== */}
      <section className="section docs-cta-section">
        <div className="section-container">
          <div className="docs-cta glass-card">
            <div className="docs-cta-content">
              <h2 className="docs-cta-title">Developer Resources</h2>
              <p className="docs-cta-desc">
                Access datasheets, schematics, firmware examples, and pinout diagrams for all
                Kosen Systems modules.
              </p>
              <div className="docs-cta-actions">
                <Link href="/docs" className="btn-primary">
                  Browse Documentation
                </Link>
                <Link href="/datasheets" className="btn-secondary">
                  Datasheets
                </Link>
              </div>
            </div>
            <div className="docs-cta-visual">
              <div className="docs-cta-icon-grid">
                <div className="docs-icon-item">
                  <SchematicIcon />
                  <span>Schematics</span>
                </div>
                <div className="docs-icon-item">
                  <PcbIcon />
                  <span>PCB Files</span>
                </div>
                <div className="docs-icon-item">
                  <CodeIcon />
                  <span>Firmware</span>
                </div>
                <div className="docs-icon-item">
                  <DatasheetIcon />
                  <span>Datasheets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage {
          min-height: 100vh;
        }

        /* ===== Hero ===== */
        .hero {
          position: relative;
          padding: 100px 0 80px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-grid-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
        }
        .hero-glow {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 600px;
          background: radial-gradient(ellipse, var(--color-accent-glow) 0%, transparent 70%);
          opacity: 0.4;
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .hero-badge {
          margin-bottom: 24px;
        }
        .hero-title {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }
        .hero-highlight {
          background: linear-gradient(135deg, var(--color-accent) 0%, #00ff88 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 60px;
        }
        .hero-cta {
          padding: 14px 28px;
          font-size: 1rem;
          text-decoration: none;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .hero-stat-num {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent);
        }
        .hero-stat-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: var(--color-border-light);
        }

        /* ===== Sections ===== */
        .section {
          padding: 80px 0;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .section-header .section-subheading {
          margin-bottom: 0;
        }

        /* ===== Product Grid ===== */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* ===== Category Grid ===== */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .category-card {
          display: flex;
          flex-direction: column;
          padding: 28px;
          text-decoration: none;
          color: inherit;
        }
        .category-icon {
          font-size: 2rem;
          margin-bottom: 16px;
        }
        .category-name {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-text-main);
        }
        .category-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin-bottom: 16px;
          flex: 1;
        }
        .category-count {
          font-size: 0.8rem;
          color: var(--color-accent);
          font-weight: 600;
        }

        /* ===== Tutorials ===== */
        .tutorial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .tutorial-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
        }
        .tutorial-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .tutorial-difficulty {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .tutorial-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 10px;
          color: var(--color-text-main);
        }
        .tutorial-excerpt {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          flex: 1;
          margin-bottom: 20px;
        }
        .tutorial-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tutorial-read-time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .tutorial-read-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: var(--color-accent);
          font-weight: 600;
        }

        /* ===== Docs CTA ===== */
        .docs-cta {
          padding: 48px;
          display: flex;
          align-items: center;
          gap: 48px;
        }
        .docs-cta-content {
          flex: 1;
        }
        .docs-cta-title {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .docs-cta-desc {
          color: var(--color-text-secondary);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 28px;
          max-width: 440px;
        }
        .docs-cta-actions {
          display: flex;
          gap: 12px;
        }
        .docs-cta-actions a {
          text-decoration: none;
        }
        .docs-cta-visual {
          flex-shrink: 0;
        }
        .docs-cta-icon-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .docs-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px 24px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        .docs-icon-item:hover {
          border-color: var(--color-accent);
          background: var(--color-accent-glow);
        }
        .docs-icon-item span {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 60px 0 50px;
          }
          .hero-title {
            font-size: 2.2rem;
          }
          .hero-actions {
            flex-direction: column;
            margin-bottom: 40px;
          }
          .hero-stats {
            gap: 20px;
          }
          .hero-stat-num {
            font-size: 1.2rem;
          }
          .section {
            padding: 50px 0;
          }
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
          .docs-cta {
            flex-direction: column;
            padding: 32px;
            text-align: center;
          }
          .docs-cta-desc {
            margin-left: auto;
            margin-right: auto;
          }
          .docs-cta-actions {
            justify-content: center;
          }
          .tutorial-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* ===== Inline Icon Components ===== */

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SchematicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" /><path d="M20 9h3" /><path d="M20 14h3" /><path d="M1 9h3" /><path d="M1 14h3" />
    </svg>
  );
}

function PcbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" /><circle cx="8" cy="8" r="1.5" /><circle cx="16" cy="8" r="1.5" /><circle cx="8" cy="16" r="1.5" /><circle cx="16" cy="16" r="1.5" /><path d="M8 9.5v5" /><path d="M16 9.5v5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function DatasheetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 13H8" /><path d="M16 17H8" /><path d="M16 13h-2" />
    </svg>
  );
}
