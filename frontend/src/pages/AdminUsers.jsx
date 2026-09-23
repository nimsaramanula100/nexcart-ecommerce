import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import API from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="admin-users-page fade-in">
      <div className="page-header flex-between">
        <div>
          <Link to="/admin" className="back-link mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1>Registered Customers & User Directory</h1>
          <p>View registered accounts, customer role permissions, and contact details.</p>
        </div>
      </div>

      <div className="card p-0">
        {loading ? (
          <div className="p-4 text-center">Loading Directory...</div>
        ) : users.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-table-cell">
                      <div className="avatar-sm">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="flex-center gap-1 font-sm">
                      <Mail size={14} className="text-muted" /> {u.email}
                    </span>
                  </td>

                  <td>
                    {u.role === 'admin' ? (
                      <span className="badge badge-warning flex-center gap-1">
                        <ShieldCheck size={12} /> Admin
                      </span>
                    ) : (
                      <span className="badge badge-primary">Customer</span>
                    )}
                  </td>

                  <td>{u.phone || 'N/A'}</td>

                  <td className="text-muted font-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-muted">No users registered yet.</div>
        )}
      </div>

      <style>{`
        .admin-users-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .user-table-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar-sm {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
