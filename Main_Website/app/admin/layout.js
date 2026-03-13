'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/products', label: 'Products', icon: ProductIcon },
  { href: '/admin/orders', label: 'Orders', icon: OrderIcon },
  { href: '/admin/tutorials', label: 'Tutorials', icon: TutorialIcon },
];

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <Link href="/admin" className="sidebar-brand">
              <Image
                src="/logos/Favicon_48x48_White_Transparent.svg"
                alt="Kosen Systems"
                width={100}
                height={28}
                className="sidebar-logo"
              />
            </Link>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            <CollapseIcon collapsed={sidebarCollapsed} />
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="sidebar-badge">Admin Panel</div>
        )}

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="sidebar-link sidebar-back-link">
            <BackIcon />
            {!sidebarCollapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>

      <style jsx>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        /* Sidebar */
        .admin-sidebar {
          width: 260px;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .admin-sidebar.collapsed {
          width: 64px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-bottom: 1px solid var(--color-border);
          min-height: 64px;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
        }
        .sidebar-logo {
          height: 24px;
          width: auto;
        }
        .sidebar-toggle {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .sidebar-toggle:hover {
          color: var(--color-text-main);
          background: var(--color-bg-tertiary);
        }

        .sidebar-badge {
          margin: 12px 16px 0;
          padding: 4px 10px;
          background: rgba(0, 212, 255, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-accent);
          text-align: center;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-footer {
          padding: 8px;
          border-top: 1px solid var(--color-border);
        }

        /* Main */
        .admin-main {
          flex: 1;
          min-width: 0;
        }
        .admin-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 40px;
        }
      `}</style>
    </div>
  );
}

/* Sidebar Link Styles as a global component */
export function SidebarLinkStyles() {
  return (
    <style jsx global>{`
      .sidebar-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        color: var(--color-text-muted);
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .sidebar-link:hover {
        color: var(--color-text-main);
        background: var(--color-bg-tertiary);
      }
      .sidebar-link.active {
        color: var(--color-accent);
        background: rgba(0, 212, 255, 0.08);
        font-weight: 600;
      }
      .sidebar-back-link:hover {
        color: var(--color-accent);
      }
      .admin-sidebar.collapsed .sidebar-link {
        justify-content: center;
        padding: 10px;
      }
    `}</style>
  );
}

/* Icon Components */
function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" /><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
    </svg>
  );
}

function TutorialIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 13h4" /><path d="M10 17h4" /><path d="M10 9h1" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
