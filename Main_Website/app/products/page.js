'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowserClient();
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="products-page">
      <div className="section-container">
        {/* Page Header */}
        <div className="products-header">
          <h1 className="products-title">All Products</h1>
          <p className="products-subtitle">
            Browse our complete catalog of hardware modules
          </p>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-categories">
            <button
              className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="filter-controls">
            <select
              className="filter-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <GridIcon />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </div>

        {/* Product Grid */}
        <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No products found in this category.</p>
            <button className="btn-secondary" onClick={() => setSelectedCategory('all')}>
              View All Products
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .products-page {
          padding: 40px 0 80px;
        }
        .products-header {
          margin-bottom: 32px;
        }
        .products-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .products-subtitle {
          color: var(--color-text-muted);
          font-size: 1rem;
        }

        /* Filters */
        .filters-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .filter-categories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .filter-chip {
          padding: 8px 16px;
          border: 1px solid var(--color-border);
          border-radius: 20px;
          background: transparent;
          color: var(--color-text-muted);
          font-family: var(--font-body);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .filter-chip:hover {
          border-color: var(--color-border-light);
          color: var(--color-text-main);
        }
        .filter-chip.active {
          background: var(--color-accent);
          color: var(--color-bg-primary);
          border-color: var(--color-accent);
          font-weight: 600;
        }
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .filter-sort {
          padding: 8px 12px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          color: var(--color-text-secondary);
          font-family: var(--font-body);
          font-size: 0.85rem;
          cursor: pointer;
          outline: none;
        }
        .filter-sort option {
          background: var(--color-bg-secondary);
        }
        .view-toggle {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          overflow: hidden;
        }
        .view-btn {
          padding: 8px 10px;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .view-btn.active {
          background: var(--color-bg-tertiary);
          color: var(--color-text-main);
        }
        .view-btn + .view-btn {
          border-left: 1px solid var(--color-border);
        }

        .results-count {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .product-grid.list-view {
          grid-template-columns: 1fr;
        }

        .no-results {
          text-align: center;
          padding: 80px 0;
          color: var(--color-text-muted);
        }
        .no-results p {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .filters-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
