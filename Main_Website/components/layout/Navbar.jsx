'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoggedIn, user, signOut } = useAuth();
  const { cartCount } = useCart();
  const userDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Hamburger Menu (Extreme Left) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-menu-btn"
        >
          <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Brand Logo */}
        <Link href="/" className="navbar-logo" id="brand-logo-link">
          <Image
            src="/logos/Favicon_48x48_White_Transparent.svg"
            alt="Kosen Systems"
            width={140}
            height={40}
            className="navbar-logo-img"
            priority
          />
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="navbar-search-desktop">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products, modules, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="desktop-search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Mobile Search Toggle */}
          <button
            className="navbar-icon-btn mobile-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
            id="mobile-search-btn"
          >
            <SearchIcon />
          </button>

          {/* Notification Button (only when logged in) */}
          {isLoggedIn && (
            <button className="navbar-icon-btn" aria-label="Notifications" id="notification-btn">
              <BellIcon />
              <span className="icon-badge">3</span>
            </button>
          )}

          {/* User Button */}
          <div className="navbar-user-wrapper" ref={userDropdownRef}>
            <button
              className="navbar-icon-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-label="User account"
              id="user-account-btn"
            >
              <UserIcon />
            </button>

            {/* User Dropdown */}
            {userDropdownOpen && (
              <div className="user-dropdown animate-slide-down">
                {isLoggedIn ? (
                  <>
                    <Link href="/profile" className="dropdown-item" id="dropdown-profile">
                      <UserIcon size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link href="/addresses" className="dropdown-item" id="dropdown-addresses">
                      <MapPinIcon />
                      <span>Addresses</span>
                    </Link>
                    <Link href="/orders" className="dropdown-item" id="dropdown-orders">
                      <PackageIcon />
                      <span>My Orders</span>
                    </Link>
                    <Link href="/tracking" className="dropdown-item" id="dropdown-tracking">
                      <TruckIcon />
                      <span>Track Order</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item dropdown-logout" id="dropdown-logout" onClick={() => { signOut(); setUserDropdownOpen(false); }}>
                      <LogoutIcon />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="dropdown-item" id="dropdown-login">
                      <UserIcon size={16} />
                      <span>Sign In</span>
                    </Link>
                    <Link href="/register" className="dropdown-item" id="dropdown-register">
                      <PlusIcon />
                      <span>Create Account</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Link href="/cart" className="navbar-icon-btn cart-btn" id="cart-btn">
            <div className="cart-icon-wrapper" style={{ position: 'relative', display: 'flex' }}>
              <CartIcon />
              {cartCount > 0 && (
                <span className="icon-badge">{cartCount}</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="navbar-search-mobile animate-slide-down">
          <div className="search-input-wrapper">
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, modules, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              id="mobile-search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Slide-out Menu */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Image
            src="/logos/Favicon_48x48_White_Transparent.svg"
            alt="Kosen Systems"
            width={120}
            height={35}
            className="mobile-menu-logo"
          />
          <button
            className="mobile-menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-menu-links">
          <Link href="/" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>All Products</Link>

          <div className="mobile-menu-category-label">Categories</div>
          <Link href="/products?category=buck-converters" className="mobile-menu-item sub" onClick={() => setMenuOpen(false)}>DC-DC Buck Converters</Link>
          <Link href="/products?category=iot-boards" className="mobile-menu-item sub" onClick={() => setMenuOpen(false)}>IoT Development Boards</Link>
          <Link href="/products?category=modules" className="mobile-menu-item sub" onClick={() => setMenuOpen(false)}>Control Modules</Link>
          <Link href="/products?category=accessories" className="mobile-menu-item sub" onClick={() => setMenuOpen(false)}>Kits & Accessories</Link>

          <div className="mobile-menu-category-label">Resources</div>
          <Link href="/tutorials" className="mobile-menu-item sub" onClick={() => setMenuOpen(false)}>Tutorials</Link>
          <Link href="/docs" className="mobile-menu-item sub" onClick={() => setMenuOpen(false)}>Documentation</Link>
        </div>

        <div className="mobile-menu-footer">
          <a href="mailto:himanshu@kosen.in" className="mobile-menu-contact">
            himanshu@kosen.in
          </a>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(5, 5, 5, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
        }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Hamburger */
        .navbar-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hamburger-line {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 22px;
        }
        .hamburger-line span {
          display: block;
          height: 2px;
          background: var(--color-text-main);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger-line.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger-line.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger-line.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .navbar-logo-img {
          height: 32px;
          width: auto;
        }

        /* Search */
        .navbar-search-desktop {
          flex: 1;
          max-width: 480px;
          margin: 0 16px;
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 0 14px;
          transition: all 0.3s ease;
        }
        .search-input-wrapper:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-glow);
        }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--color-text-main);
          font-family: var(--font-body);
          font-size: 0.9rem;
          padding: 10px 0;
          outline: none;
        }
        .search-input::placeholder {
          color: var(--color-text-muted);
        }
        .search-clear {
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 4px;
        }

        .navbar-search-mobile {
          padding: 0 20px 12px;
          background: rgba(5, 5, 5, 0.95);
          border-bottom: 1px solid var(--color-border);
        }

        /* Actions */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
        }

        .navbar-icon-btn {
          position: relative !important;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          border-radius: 8px;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .navbar-icon-btn:hover {
          color: var(--color-text-main);
          background: var(--color-bg-tertiary);
        }

        .icon-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          transform: translate(50%, -50%);
          min-width: 15px;
          height: 15px;
          padding: 0 4px;
          background: var(--color-accent);
          color: #000;
          border-radius: 10px;
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 0 8px var(--color-accent-glow);
          border: 1.5px solid var(--color-bg-primary);
          pointer-events: none;
          z-index: 10;
        }

        .mobile-search-btn {
          display: none;
        }

        /* User Dropdown */
        .navbar-user-wrapper {
          position: relative;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-light);
          border-radius: 10px;
          padding: 6px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          z-index: 200;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--font-body);
        }
        .dropdown-item:hover {
          color: var(--color-text-main);
          background: var(--color-bg-tertiary);
        }
        .dropdown-divider {
          height: 1px;
          background: var(--color-border);
          margin: 4px 0;
        }
        .dropdown-logout:hover {
          color: var(--color-danger);
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 150;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .mobile-menu-overlay.open {
          display: block;
          opacity: 1;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 100vh;
          background: var(--color-bg-secondary);
          z-index: 200;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .mobile-menu.open {
          transform: translateX(0);
        }
        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }
        .mobile-menu-logo {
          height: 28px;
          width: auto;
        }
        .mobile-menu-close {
          background: none;
          border: none;
          color: var(--color-text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px;
        }
        .mobile-menu-links {
          flex: 1;
          padding: 16px 0;
        }
        .mobile-menu-item {
          display: block;
          padding: 12px 24px;
          color: var(--color-text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .mobile-menu-item:hover {
          color: var(--color-text-main);
          background: var(--color-bg-tertiary);
        }
        .mobile-menu-item.sub {
          padding-left: 36px;
          font-size: 0.9rem;
        }
        .mobile-menu-category-label {
          padding: 20px 24px 8px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-text-muted);
        }
        .mobile-menu-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--color-border);
        }
        .mobile-menu-contact {
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        .mobile-menu-contact:hover {
          color: var(--color-accent);
        }

        @media (max-width: 768px) {
          .navbar-search-desktop {
            display: none;
          }
          .mobile-search-btn {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}

/* ============================
   Icon Components
   ============================ */

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" /><path d="M12 22V12" /><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
