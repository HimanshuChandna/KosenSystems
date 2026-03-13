'use client';

import { useState, useEffect } from 'react';

export default function AdminTutorialsPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTutorials(); }, []);

  async function fetchTutorials() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tutorials');
      const data = await res.json();
      if (Array.isArray(data)) setTutorials(data);
    } catch (err) {
      console.error('Failed to fetch tutorials:', err);
    }
    setLoading(false);
  }

  async function togglePublish(tutorial) {
    try {
      const res = await fetch('/api/admin/tutorials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tutorial.id, published: !tutorial.published }),
      });
      const data = await res.json();
      if (res.ok) {
        setTutorials(tutorials.map(t => t.id === data.id ? data : t));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  }

  const difficultyColor = {
    'Beginner': '#4caf50',
    'Intermediate': '#ffa726',
    'Advanced': '#ff5252',
  };

  return (
    <div className="admin-tutorials">
      <h1 className="page-title">Tutorials</h1>
      <p className="page-subtitle">{tutorials.length} tutorials</p>

      {loading ? (
        <div className="loading-text">Loading tutorials...</div>
      ) : (
        <div className="tutorials-grid">
          {tutorials.map(tut => (
            <div key={tut.id} className="tutorial-card glass-card">
              <div className="tutorial-header">
                <span className={`pub-badge ${tut.published ? 'published' : 'draft'}`}>
                  {tut.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
                <span className="difficulty-badge" style={{ color: difficultyColor[tut.difficulty] || '#ccc' }}>
                  {tut.difficulty}
                </span>
              </div>
              <h3 className="tutorial-title">{tut.title}</h3>
              <p className="tutorial-excerpt">{tut.excerpt}</p>
              <div className="tutorial-meta">
                <span>📖 {tut.read_time}</span>
                <span>📁 {tut.category}</span>
              </div>
              <button
                className={`toggle-btn ${tut.published ? 'unpublish' : 'publish'}`}
                onClick={() => togglePublish(tut)}
              >
                {tut.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && tutorials.length === 0 && (
        <div className="empty-state">No tutorials yet.</div>
      )}

      <style jsx>{`
        .admin-tutorials { animation: fadeIn 0.4s ease; }
        .page-title { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 4px; }
        .page-subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 24px; }
        .tutorials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .tutorial-card { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .tutorial-header { display: flex; align-items: center; gap: 10px; }
        .pub-badge { padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .pub-badge.published { background: rgba(76,175,80,0.15); color: var(--color-success); }
        .pub-badge.draft { background: rgba(255,167,38,0.15); color: #ffa726; }
        .difficulty-badge { font-size: 0.8rem; font-weight: 500; }
        .tutorial-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 600; line-height: 1.3; }
        .tutorial-excerpt { font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5; flex: 1; }
        .tutorial-meta { display: flex; gap: 16px; font-size: 0.8rem; color: var(--color-text-muted); }
        .toggle-btn { padding: 8px 14px; border: 1px solid var(--color-border); border-radius: 6px; background: none; color: var(--color-text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; font-family: var(--font-body); align-self: flex-start; }
        .toggle-btn.unpublish:hover { color: var(--color-danger); border-color: var(--color-danger); }
        .toggle-btn.publish:hover { color: var(--color-success); border-color: var(--color-success); }
        .loading-text { color: var(--color-text-muted); padding: 40px; text-align: center; }
        .empty-state { color: var(--color-text-muted); padding: 40px; text-align: center; font-size: 0.95rem; }
      `}</style>
    </div>
  );
}
