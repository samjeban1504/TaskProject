import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      const { confirmPassword, ...payload } = form;
      const res = await authAPI.register(payload);
      const { token, ...userData } = res.data.data;
      login(userData, token);
      toast.success(`Account created! Welcome, ${userData.fullName}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
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
          Create account ✨
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Start managing your tasks today
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="fullName" value={form.fullName}
              onChange={handleChange} placeholder="John Doe"
              className="form-control-custom" id="reg-fullname" />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              className="form-control-custom" id="reg-email" />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'}
                name="password" value={form.password}
                onChange={handleChange} placeholder="Min 6 characters"
                className="form-control-custom" id="reg-password"
                style={{ paddingRight: '2.75rem' }} />
              <button type="button" onClick={() => setShowPw((p) => !p)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} placeholder="Repeat password"
              className="form-control-custom" id="reg-confirm-password" />
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading} id="reg-submit">
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
