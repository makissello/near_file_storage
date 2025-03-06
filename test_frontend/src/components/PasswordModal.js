import { useState, useEffect } from 'react';
import { EncryptionService } from '@/services/encryption';

export function PasswordModal({ isOpen, onClose, onSuccess, isSetup }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSetup && isOpen) {
      // When showing password, get it directly from storage
      const storedPassword = EncryptionService.getStoredPassword();
      if (storedPassword) {
        setPassword(storedPassword);
      }
    }
  }, [isOpen, isSetup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSetup) {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await EncryptionService.setupPassword(password);
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop show" style={{ zIndex: 1040 }}></div>
      <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-dark">
                {isSetup ? 'Set Up Password Protection' : 'Your Password'}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {isSetup ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-dark">
                      Create a password to protect your files
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label text-dark">
                      Confirm your password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        'Set Password'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 