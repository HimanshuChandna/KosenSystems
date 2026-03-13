'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp({ email, password, fullName });
      setSuccess('Account created! Please check your email to verify your account.');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the Kosen Systems community</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="form-input"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading} id="register-submit-btn">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Sign In</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }
        .auth-container {
          width: 100%;
          max-width: 420px;
          padding: 40px;
        }
        .auth-title {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
          text-align: center;
        }
        .auth-subtitle {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          text-align: center;
          margin-bottom: 32px;
        }
        .auth-error {
          background: rgba(255, 82, 82, 0.1);
          border: 1px solid rgba(255, 82, 82, 0.3);
          color: var(--color-danger);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .auth-success {
          background: rgba(0, 230, 118, 0.1);
          border: 1px solid rgba(0, 230, 118, 0.3);
          color: var(--color-success);
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .form-input {
          padding: 12px 16px;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-main);
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.3s;
        }
        .form-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-glow);
        }
        .form-input::placeholder {
          color: var(--color-text-muted);
        }
        .auth-submit {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          margin-top: 8px;
        }
        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-switch {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .auth-link {
          color: var(--color-accent);
          text-decoration: none;
          font-weight: 600;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
