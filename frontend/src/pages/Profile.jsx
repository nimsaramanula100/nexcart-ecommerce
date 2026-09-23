import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || '',
    password: '',
  });

  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(false);

    const profilePayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
    };

    if (formData.password) {
      profilePayload.password = formData.password;
    }

    const result = await updateProfile(profilePayload);
    setUpdating(false);

    if (result.success) {
      setSuccess(true);
      showToast('Profile updated successfully!', 'success');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="profile-page fade-in">
      <div className="page-header">
        <h1>User Account Profile</h1>
        <p>Manage your account settings, personal details, and default delivery address.</p>
      </div>

      {success && (
        <div className="card badge-success p-3 flex-center gap-1">
          <Check size={18} /> Profile details saved successfully!
        </div>
      )}

      {error && <div className="card badge-danger p-3">{error}</div>}

      <div className="profile-layout">
        {/* User Card Sidebar */}
        <div className="card user-summary-card">
          <div className="avatar-large">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user?.name}</h3>
          <p className="user-email-text">{user?.email}</p>
          <div className="user-role-badge">
            <ShieldCheck size={14} />
            <span>{user?.role === 'admin' ? 'Administrator' : 'Customer Account'}</span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="card profile-form-card">
          <h3>Personal Details</h3>
          <hr className="divider" />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  required
                  className="form-control with-icon"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-control with-icon"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-icon-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="text"
                    name="phone"
                    className="form-control with-icon"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <h3 className="mt-3">Default Shipping Address</h3>
            <hr className="divider" />

            <div className="form-group">
              <label className="form-label">Street Address</label>
              <div className="input-icon-wrapper">
                <MapPin size={18} className="input-icon" />
                <input
                  type="text"
                  name="street"
                  className="form-control with-icon"
                  placeholder="123 Innovation Street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / Zip Code</label>
                <input
                  type="text"
                  name="postalCode"
                  className="form-control"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                className="form-control"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <h3 className="mt-3">Security</h3>
            <hr className="divider" />

            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-3" disabled={updating}>
              <Save size={18} /> {updating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .profile-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .user-summary-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          font-weight: 800;
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 6px 20px var(--accent-glow);
        }

        .user-email-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .user-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          background-color: rgba(99, 102, 241, 0.12);
          color: var(--accent-primary);
        }

        .profile-form-card {
          padding: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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

        @media (max-width: 768px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
