import { useState, useEffect } from 'react';
import { EncryptionService } from '@/services/encryption';

export function ShowPasswordModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedPassword = EncryptionService.getStoredPassword();
      if (storedPassword) {
        setPassword(storedPassword);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
      <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">Your Password</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p className="text-dark">Your password is:</p>
              <div className="alert alert-info">
                {password}
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 