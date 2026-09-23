import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(res.error);
    }
  };

  const fillCustomerDemo = () => {
    setEmail('john@example.com');
    setPassword('user123');
  };

  const fillAdminDemo = () => {
    setEmail('admin@nexcart.com');
    setPassword('admin123');
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card card">
        <div className="auth-brand-header">
          <div className="logo-icon-box">
            <ShoppingBag size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p className="auth-sub">Log in to access your ALoraLuxe account</p>
        </div>

        {error && <div className="card badge-danger p-3 mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-control with-icon"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                className="form-control with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="demo-credentials-box mt-4">
          <span className="demo-title">Quick One-Click Demo Credentials:</span>
          <div className="demo-btn-group">
            <button className="btn btn-secondary btn-sm" onClick={fillCustomerDemo}>
              <User size={14} /> Customer Demo
            </button>
            <button className="btn btn-secondary btn-sm" onClick={fillAdminDemo}>
              <ShieldCheck size={14} /> Admin Demo
            </button>
          </div>
        </div>

        <p className="auth-switch-text mt-4">
          Don't have an account? <Link to="/register" className="link-accent">Create Account</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          padding: 2rem 1rem;
        }

        .auth-card {
          max-width: 440px;
          width: 100%;
          padding: 2.5rem;
        }

        .auth-brand-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-icon-box {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background: var(--accent-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 16px var(--accent-glow);
        }

        .auth-brand-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }

        .auth-sub {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
        }

        .with-icon {
          padding-left: 2.75rem;
        }

        .demo-credentials-box {
          background-color: var(--bg-hover);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-color);
          text-align: center;
        }

        .demo-title {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
        }

        .demo-btn-group {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .auth-switch-text {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .link-accent {
          color: var(--accent-primary);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default Login;
