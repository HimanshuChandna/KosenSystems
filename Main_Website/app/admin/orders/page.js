'use client';

import { useState, useEffect } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
    setLoading(false);
  }

  async function handleStatusUpdate(orderId, newStatus) {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, order_status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(orders.map(o => o.id === data.id ? data : o));
        if (selectedOrder?.id === data.id) setSelectedOrder(data);
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  }

  const statuses = ['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.order_status === filter);
  const statusCounts = statuses.reduce((acc, s) => {
    acc[s] = s === 'all' ? orders.length : orders.filter(o => o.order_status === s).length;
    return acc;
  }, {});

  return (
    <div className="admin-orders">
      <h1 className="page-title">Orders</h1>
      <p className="page-subtitle">{orders.length} total orders</p>

      {/* Status Filters */}
      <div className="status-filters">
        {statuses.map(s => (
          <button key={s} className={`filter-pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)} {statusCounts[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-text">Loading orders...</div>
      ) : (
        <div className="orders-table-wrapper glass-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="empty-cell">No orders yet.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td><span className="order-id">{order.id.slice(0, 8)}...</span></td>
                    <td>{order.customer_name || order.customer_email || '—'}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <span className={`payment-badge ${order.payment_status}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.order_status}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="action-edit" onClick={() => setSelectedOrder(order)}>View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal glass-card" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Order Details</h2>
            <div className="detail-row"><span>Order ID:</span><span className="mono">{selectedOrder.id}</span></div>
            <div className="detail-row"><span>Customer:</span><span>{selectedOrder.customer_name || '—'}</span></div>
            <div className="detail-row"><span>Email:</span><span>{selectedOrder.customer_email || '—'}</span></div>
            <div className="detail-row"><span>Phone:</span><span>{selectedOrder.customer_phone || '—'}</span></div>
            <div className="detail-row"><span>Total:</span><span className="bold">₹{selectedOrder.total}</span></div>
            <div className="detail-row"><span>Payment:</span><span className={`payment-badge ${selectedOrder.payment_status}`}>{selectedOrder.payment_status}</span></div>

            <div className="status-update">
              <label>Update Status:</label>
              <select
                value={selectedOrder.order_status}
                onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
              >
                {['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="order-items">
                <h3>Items</h3>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span>{item.name || item.id}</span>
                    <span>x{item.quantity} — ₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-ghost close-btn" onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-orders { animation: fadeIn 0.4s ease; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
        .page-subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 20px; }
        .status-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
        .filter-pill { padding: 6px 14px; border: 1px solid var(--color-border); border-radius: 20px; background: none; color: var(--color-text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
        .filter-pill.active { background: var(--color-accent); color: var(--color-bg-primary); border-color: var(--color-accent); font-weight: 600; }
        .filter-pill:hover { border-color: var(--color-accent); }
        .orders-table-wrapper { padding: 0; overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .admin-table th { text-align: left; padding: 14px 16px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); white-space: nowrap; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .admin-table tr:hover { background: rgba(255,255,255,0.02); }
        .order-id { font-family: monospace; font-size: 0.8rem; }
        .payment-badge, .status-badge { padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .payment-badge.paid { background: rgba(76,175,80,0.15); color: var(--color-success); }
        .payment-badge.pending { background: rgba(255,167,38,0.15); color: #ffa726; }
        .payment-badge.failed { background: rgba(255,82,82,0.15); color: var(--color-danger); }
        .status-badge.placed { background: rgba(0,212,255,0.15); color: var(--color-accent); }
        .status-badge.confirmed { background: rgba(76,175,80,0.15); color: var(--color-success); }
        .status-badge.processing { background: rgba(255,167,38,0.15); color: #ffa726; }
        .status-badge.shipped { background: rgba(41,182,246,0.15); color: #29b6f6; }
        .status-badge.delivered { background: rgba(76,175,80,0.15); color: var(--color-success); }
        .status-badge.cancelled { background: rgba(255,82,82,0.15); color: var(--color-danger); }
        .empty-cell { text-align: center; color: var(--color-text-muted); padding: 40px 16px !important; }
        .action-edit { padding: 4px 10px; border: 1px solid var(--color-border); border-radius: 4px; background: none; color: var(--color-text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
        .action-edit:hover { color: var(--color-accent); border-color: var(--color-accent); }
        .loading-text { color: var(--color-text-muted); padding: 40px; text-align: center; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease; }
        .modal { width: 100%; max-width: 520px; padding: 32px; }
        .modal-title { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--color-border); font-size: 0.9rem; }
        .detail-row span:first-child { color: var(--color-text-muted); }
        .mono { font-family: monospace; font-size: 0.8rem; }
        .bold { font-weight: 700; }
        .status-update { margin-top: 20px; display: flex; align-items: center; gap: 12px; }
        .status-update label { font-size: 0.85rem; color: var(--color-text-muted); font-weight: 500; }
        .status-update select { padding: 8px 12px; background: var(--color-bg-tertiary); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-main); font-family: var(--font-body); font-size: 0.85rem; outline: none; }
        .status-update select option { background: var(--color-bg-secondary); }
        .order-items { margin-top: 20px; }
        .order-items h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 10px; }
        .order-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--color-border); font-size: 0.85rem; }
        .close-btn { margin-top: 20px; width: 100%; }
      `}</style>
    </div>
  );
}
