'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#ff9800' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🧾', color: '#00d4ff' },
    { label: 'Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', color: '#4caf50' },
    { label: 'Stock Units', value: stats.totalStock, icon: '📊', color: '#ff5252' },
    { label: 'Categories', value: stats.totalCategories, icon: '🏷️', color: '#e040fb' },
    { label: 'Tutorials', value: stats.totalTutorials, icon: '📖', color: '#29b6f6' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#ffa726' },
  ] : [];

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back! Here&apos;s an overview of your store.</p>

      {loading ? (
        <div className="stats-grid">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="stat-card glass-card shimmer"></div>
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          {statCards.map((stat, i) => (
            <div key={i} className="stat-card glass-card" style={{ borderLeftColor: stat.color }}>
              <span className="stat-icon">{stat.icon}</span>
              <div>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions">
        <Link href="/admin/products" className="action-card glass-card">
          <span className="action-icon">➕</span>
          <span>Manage Products</span>
        </Link>
        <Link href="/admin/orders" className="action-card glass-card">
          <span className="action-icon">📋</span>
          <span>View Orders</span>
        </Link>
        <Link href="/admin/tutorials" className="action-card glass-card">
          <span className="action-icon">✏️</span>
          <span>Manage Tutorials</span>
        </Link>
        <Link href="/" className="action-card glass-card">
          <span className="action-icon">🌐</span>
          <span>View Store</span>
        </Link>
      </div>

      <style jsx>{`
        .admin-dashboard { animation: fadeIn 0.4s ease; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
        .page-subtitle { color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 32px; }
        .section-title { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 600; margin: 36px 0 16px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .stat-card {
          display: flex; align-items: center; gap: 14px; padding: 20px; border-left: 3px solid;
          min-height: 80px;
        }
        .stat-card.shimmer { background: linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg-tertiary) 50%, var(--color-bg-secondary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .stat-icon { font-size: 1.6rem; }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 700; font-family: var(--font-heading); }
        .stat-label { display: block; font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px; }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        .action-card {
          display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px;
          text-decoration: none; color: var(--color-text-main); text-align: center;
          transition: all 0.2s; font-size: 0.9rem;
        }
        .action-card:hover { border-color: var(--color-accent); transform: translateY(-2px); }
        .action-icon { font-size: 1.5rem; }
      `}</style>
    </div>
  );
}
