import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      toast.success(`Welcome back, ${userData.fullName}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">✅</div>
          <h1>TaskFlow</h1>
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem',
          color: 'var(--text-primary)' }}>
          Welcome back 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Sign in to manage your tasks
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              className="form-control-custom" id="login-email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                name="password" value={form.password}
                onChange={handleChange} placeholder="Enter password"
                className="form-control-custom" id="login-password"
                style={{ paddingRight: '2.75rem' }}
              />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading} id="login-submit">
            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
