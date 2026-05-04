'use client';

import { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children, onConfirm, confirmText = 'Confirm', confirmStyle = 'btn-primary', showCancel = true }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          {showCancel && (
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          )}
          {onConfirm && (
            <button className={`btn ${confirmStyle}`} onClick={onConfirm}>{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  );
}
