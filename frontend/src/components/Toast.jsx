import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const { text, type } = toastMessage;

  return (
    <div className={`toast-popup toast-${type || 'success'} fade-in`}>
      <div className="toast-icon">
        {type === 'error' && <AlertCircle size={20} />}
        {type === 'info' && <Info size={20} />}
        {(!type || type === 'success') && <CheckCircle2 size={20} />}
      </div>
      <span className="toast-text">{text}</span>

      <style>{`
        .toast-popup {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          color: var(--text-primary);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .toast-success {
          border-left: 4px solid var(--success);
        }

        .toast-success .toast-icon {
          color: var(--success);
        }

        .toast-error {
          border-left: 4px solid var(--danger);
        }

        .toast-error .toast-icon {
          color: var(--danger);
        }

        .toast-info {
          border-left: 4px solid var(--accent-primary);
        }

        .toast-info .toast-icon {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
};

export default Toast;
