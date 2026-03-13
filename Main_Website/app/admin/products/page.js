'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function handleSave(product) {
    try {
      if (editingProduct) {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...product, id: editingProduct.id }),
        });
        const data = await res.json();
        if (res.ok) setProducts(products.map(p => p.id === data.id ? data : p));
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
        const data = await res.json();
        if (res.ok) setProducts([data, ...products]);
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
    setShowForm(false);
    setEditingProduct(null);
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{products.length} products in your catalog</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}

      {loading ? (
        <div className="loading-text">Loading products...</div>
      ) : (
        <div className="products-table-wrapper glass-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-thumb">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="thumb-img" />
                      ) : (
                        <div className="thumb-placeholder">📦</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="product-cell">
                      <span className="product-cell-name">{product.short_name || product.name}</span>
                      <span className="product-cell-id">{product.id}</span>
                    </div>
                  </td>
                  <td><span className="category-tag">{product.category}</span></td>
                  <td>
                    ₹{product.price}
                    {product.original_price && (
                      <span className="original-price"> ₹{product.original_price}</span>
                    )}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-dot ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-edit" onClick={() => { setEditingProduct(product); setShowForm(true); }}>
                        Edit
                      </button>
                      {deleteConfirm === product.id ? (
                        <>
                          <button className="action-confirm" onClick={() => handleDelete(product.id)}>Confirm</button>
                          <button className="action-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className="action-delete" onClick={() => setDeleteConfirm(product.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="empty-state">No products yet. Click &quot;Add Product&quot; to get started.</div>
          )}
        </div>
      )}

      <style jsx>{`
        .admin-products { animation: fadeIn 0.4s ease; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; gap: 16px; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
        .page-subtitle { color: var(--color-text-muted); font-size: 0.9rem; }
        .products-table-wrapper { padding: 0; overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
        .admin-table th { text-align: left; padding: 14px 16px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-muted); border-bottom: 1px solid var(--color-border); white-space: nowrap; }
        .admin-table td { padding: 14px 16px; border-bottom: 1px solid var(--color-border); vertical-align: middle; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover { background: rgba(255,255,255,0.02); }
        .product-thumb { width: 48px; height: 48px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; }
        .thumb-placeholder { width: 100%; height: 100%; background: var(--color-bg-tertiary); border: 1px solid var(--color-border); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .product-cell { display: flex; flex-direction: column; gap: 2px; }
        .product-cell-name { font-weight: 600; }
        .product-cell-id { font-size: 0.75rem; color: var(--color-text-muted); font-family: monospace; }
        .category-tag { padding: 3px 8px; background: var(--color-bg-tertiary); border-radius: 4px; font-size: 0.8rem; white-space: nowrap; }
        .original-price { text-decoration: line-through; color: var(--color-text-muted); font-size: 0.8rem; }
        .status-dot { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; white-space: nowrap; }
        .status-dot::before { content: ''; width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .status-dot.in-stock::before { background: var(--color-success); }
        .status-dot.out-of-stock::before { background: var(--color-danger); }
        .action-btns { display: flex; gap: 8px; }
        .action-edit, .action-delete, .action-confirm, .action-cancel { padding: 4px 10px; border: 1px solid var(--color-border); border-radius: 4px; background: none; color: var(--color-text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); }
        .action-edit:hover { color: var(--color-accent); border-color: var(--color-accent); }
        .action-delete:hover { color: var(--color-danger); border-color: var(--color-danger); }
        .action-confirm { color: var(--color-danger); border-color: var(--color-danger); }
        .action-cancel:hover { color: var(--color-text-main); }
        .loading-text { color: var(--color-text-muted); padding: 40px; text-align: center; }
        .empty-state { color: var(--color-text-muted); padding: 40px; text-align: center; font-size: 0.95rem; }
      `}</style>
    </div>
  );
}

/* ===========================
   Product Form with Image Upload via API Route
   =========================== */
function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: product?.id || '',
    name: product?.name || '',
    short_name: product?.short_name || '',
    price: product?.price || '',
    original_price: product?.original_price || '',
    description: product?.description || '',
    category: product?.category || 'buck-converters',
    in_stock: product?.in_stock ?? true,
    stock: product?.stock || 0,
    badge: product?.badge || '',
    images: product?.images || [],
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  async function handleImageUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const productId = form.id || product?.id || 'temp';
    if (!productId || productId === '') {
      setUploadError('Please enter a Product ID first.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const newUrls = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          setUploadError('Only image files are allowed.');
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('File size must be under 5MB.');
          continue;
        }

        // Upload via server-side API route
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', productId);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          newUrls.push(data.url);
        } else {
          setUploadError(data.error || 'Upload failed');
        }
      }
      update('images', [...form.images, ...newUrls]);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleRemoveImage(index) {
    const updated = form.images.filter((_, i) => i !== index);
    update('images', updated);
  }

  function handleReorderImage(fromIndex, toIndex) {
    const updated = [...form.images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    update('images', updated);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        stock: Number(form.stock),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="product-form-overlay">
      <form className="product-form glass-card" onSubmit={handleSubmit}>
        <h2 className="form-title">{product ? 'Edit Product' : 'Add New Product'}</h2>

        {/* Image Upload Section */}
        <div className="image-section">
          <label className="section-label">Product Images</label>
          <div className="image-gallery">
            {form.images.map((url, index) => (
              <div key={index} className="image-item">
                <img src={url} alt={`Product ${index + 1}`} className="image-preview" />
                <div className="image-overlay">
                  {index > 0 && (
                    <button type="button" className="img-action-btn" onClick={() => handleReorderImage(index, index - 1)} title="Move left">←</button>
                  )}
                  <button type="button" className="img-action-btn img-remove" onClick={() => handleRemoveImage(index)} title="Remove">✕</button>
                  {index < form.images.length - 1 && (
                    <button type="button" className="img-action-btn" onClick={() => handleReorderImage(index, index + 1)} title="Move right">→</button>
                  )}
                </div>
                {index === 0 && <span className="primary-badge">Primary</span>}
              </div>
            ))}
            <button type="button" className="image-upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? <span className="upload-spinner">↻</span> : <><span style={{fontSize:'1.4rem'}}>📷</span><span>Upload</span></>}
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
          {uploadError && <div className="upload-error">{uploadError}</div>}
          <p className="image-hint">Upload up to 5 images. Max 5MB each. First image is the primary/thumbnail.</p>
        </div>

        <div className="form-grid">
          {!product && (
            <div className="form-group">
              <label>Product ID (slug)</label>
              <input type="text" value={form.id} onChange={e => update('id', e.target.value)} required placeholder="ks-product-name" />
            </div>
          )}
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Short Name</label>
            <input type="text" value={form.short_name} onChange={e => update('short_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => update('category', e.target.value)}>
              <option value="buck-converters">DC-DC Buck Converters</option>
              <option value="iot-boards">IoT Development Boards</option>
              <option value="modules">Control Modules</option>
              <option value="accessories">Kits &amp; Accessories</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={form.price} onChange={e => update('price', e.target.value)} required min="0" step="0.01" />
          </div>
          <div className="form-group">
            <label>Original Price (₹)</label>
            <input type="number" value={form.original_price} onChange={e => update('original_price', e.target.value)} min="0" step="0.01" placeholder="Optional" />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={e => update('stock', e.target.value)} min="0" />
          </div>
          <div className="form-group">
            <label>Badge</label>
            <input type="text" value={form.badge} onChange={e => update('badge', e.target.value)} placeholder="e.g. Best Seller, New" />
          </div>
          <div className="form-group full-width">
            <label>Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" checked={form.in_stock} onChange={e => update('in_stock', e.target.checked)} />
              In Stock
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving || uploading}>
            {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .product-form-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease; }
        .product-form { width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; padding: 32px; }
        .form-title { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; margin-bottom: 24px; }
        .image-section { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--color-border); }
        .section-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 12px; }
        .image-gallery { display: flex; gap: 12px; flex-wrap: wrap; }
        .image-item { position: relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border); }
        .image-preview { width: 100%; height: 100%; object-fit: cover; }
        .image-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; gap: 4px; opacity: 0; transition: opacity 0.2s; }
        .image-item:hover .image-overlay { opacity: 1; }
        .img-action-btn { width: 28px; height: 28px; border-radius: 4px; border: none; background: rgba(255,255,255,0.1); color: white; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .img-action-btn:hover { background: rgba(255,255,255,0.25); }
        .img-remove:hover { background: rgba(255,82,82,0.6); }
        .primary-badge { position: absolute; bottom: 4px; left: 4px; padding: 2px 6px; background: var(--color-accent); color: var(--color-bg-primary); border-radius: 3px; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; }
        .image-upload-btn { width: 100px; height: 100px; border-radius: 8px; border: 2px dashed var(--color-border-light); background: var(--color-bg-tertiary); color: var(--color-text-muted); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 0.75rem; font-family: var(--font-body); transition: all 0.2s; }
        .image-upload-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .image-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .upload-spinner { font-size: 1.2rem; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .upload-error { margin-top: 8px; padding: 8px 12px; background: rgba(255,82,82,0.1); border: 1px solid rgba(255,82,82,0.3); border-radius: 6px; color: var(--color-danger); font-size: 0.8rem; }
        .image-hint { margin-top: 8px; font-size: 0.75rem; color: var(--color-text-muted); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-group.checkbox-group { flex-direction: row; align-items: center; gap: 8px; }
        .form-group label { font-size: 0.8rem; color: var(--color-text-muted); font-weight: 500; }
        .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; background: var(--color-bg-tertiary); border: 1px solid var(--color-border); border-radius: 6px; color: var(--color-text-main); font-family: var(--font-body); font-size: 0.9rem; outline: none; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--color-accent); }
        .form-group input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--color-accent); }
        .form-group textarea { resize: vertical; }
        .form-group select option { background: var(--color-bg-secondary); }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
      `}</style>
    </div>
  );
}
