import React, { useEffect, useState } from 'react';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await profileAPI.get();
        const p = res.data.data;
        setForm({ fullName: p.fullName, email: p.email, currentPassword: '', newPassword: '' });
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (form.newPassword && form.newPassword.length < 6) e.newPassword = 'Min 6 characters';
    if (form.newPassword && !form.currentPassword) e.currentPassword = 'Current password required';
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
    setSaving(true);
    try {
      const payload = { fullName: form.fullName, email: form.email };
      if (form.currentPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const res = await profileAPI.update(payload);
      updateUser({ ...user, fullName: res.data.data.fullName });
      toast.success('Profile updated! ✅');
      setForm((p) => ({ ...p, currentPassword: '', newPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <span>Loading profile...</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Avatar card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '2rem',
        display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem'
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 700, color: 'white', flexShrink: 0
        }}>
          {form.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {form.fullName}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{form.email}</p>
          <span style={{
            display: 'inline-block', marginTop: '0.4rem',
            padding: '0.2rem 0.7rem', borderRadius: '50px',
            background: 'rgba(99,102,241,0.15)', color: 'var(--primary-light)',
            fontSize: '0.72rem', fontWeight: 600
          }}>
            {user?.role || 'USER'}
          </span>
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.75rem'
      }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem',
            color: 'var(--text-primary)' }}>
            Update Profile
          </h3>

          <div className="form-group">
            <label className="form-label">
              <FiUser style={{ marginRight: 6 }} />Full Name
            </label>
            <input type="text" name="fullName" value={form.fullName}
              onChange={handleChange} className="form-control-custom"
              placeholder="Your full name" id="profile-fullname" />
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiMail style={{ marginRight: 6 }} />Email Address
            </label>
            <input type="email" name="email" value={form.email}
              className="form-control-custom" readOnly
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Email cannot be changed
            </p>
          </div>

          <div className="divider" />

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem',
            color: 'var(--text-primary)' }}>
            Change Password <span style={{ fontSize: '0.8rem', fontWeight: 400,
              color: 'var(--text-muted)' }}>(optional)</span>
          </h3>

          <div className="form-group">
            <label className="form-label">
              <FiLock style={{ marginRight: 6 }} />Current Password
            </label>
            <input type="password" name="currentPassword" value={form.currentPassword}
              onChange={handleChange} className="form-control-custom"
              placeholder="Enter current password" id="profile-current-pw" />
            {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <FiLock style={{ marginRight: 6 }} />New Password
            </label>
            <input type="password" name="newPassword" value={form.newPassword}
              onChange={handleChange} className="form-control-custom"
              placeholder="Min 6 characters" id="profile-new-pw" />
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>

          <button type="submit" className="btn-primary-custom" disabled={saving} id="profile-save">
            {saving ? '⏳ Saving...' : <><FiSave style={{ marginRight: 6 }} />Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
