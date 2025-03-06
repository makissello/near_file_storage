import { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import styles from '@/styles/app.module.css';
import { FileStorageContract } from '../../config';
import { Cards } from '@/components/cards';
import { uploadToPinata } from '@/services/pinata';
import { EncryptionService } from '@/services/encryption';
import { PasswordModal } from '@/components/PasswordModal';
import { ShowPasswordModal } from '@/components/ShowPasswordModal';
import { WalletButton } from '@/components/WalletButton';
import JSZip from 'jszip';
import crypto from 'crypto';

// Contract that the app will interact with
const CONTRACT = FileStorageContract;

// Utility function to calculate SHA256 hash of a string and base64 encode it
const calculateFileHash = (fileName) => {
  const hash = crypto.createHash('sha256').update(fileName).digest();
  return Buffer.from(hash).toString('base64');
};

// Add this function near the top of the file, after the imports
const convertToReliableGateway = (url) => {
  if (url.startsWith('https://ipfs.io/ipfs/')) {
    // Replace ipfs.io with dweb.link which is more reliable
    return url.replace('https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/');
  }
  return url;
};

export default function HelloNear() {
  const { signedAccountId, wallet } = useContext(NearContext);

  const [files, setFiles] = useState({}); // Object to store name -> {name, hash, url} mapping
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswordViewModal, setShowPasswordViewModal] = useState(false);
  const [isPasswordSetup, setIsPasswordSetup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  useEffect(() => {
    if (!wallet || !signedAccountId) return;
    
    // Check if password is set up
    const hasSetup = EncryptionService.hasPasswordSetup();
    setIsPasswordSetup(hasSetup);
    
    // Show password modal if:
    // 1. No password setup yet, or
    // 2. Has password setup but no active session
    if (!hasSetup || (hasSetup && !EncryptionService.hasActiveSession())) {
      setShowPasswordModal(true);
    } else {
      loadFiles();
    }
  }, [wallet, signedAccountId]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  const loadFiles = async () => {
    if (!signedAccountId) return;
    
    try {
      setShowSpinner(true);
      const userFiles = await wallet.viewMethod({ 
        contractId: CONTRACT, 
        method: 'get_user_files',
        args: { account_id: signedAccountId }
      });
      
      // Convert array to object with file name as key
      const filesMap = {};
      userFiles.forEach(file => {
        const fileHash = calculateFileHash(file.name);
        filesMap[file.name] = {
          name: file.name,
          hash: fileHash,
          url: convertToReliableGateway(file.url)
        };
      });
      setFiles(filesMap);
    } catch (err) {
      setError('Failed to load files');
      console.error('Error loading files:', err);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setShowSpinner(true);
      
      // Encrypt the file
      const encryptedFile = await EncryptionService.encryptFile(selectedFile);
      
      // Upload encrypted file to Pinata
      const pinataUrl = await uploadToPinata(encryptedFile);
      
      // Then save to NEAR contract
      await wallet.callMethod({ 
        contractId: CONTRACT, 
        method: 'add_file',
        args: { name: selectedFile.name, url: pinataUrl }
      });
      
      await loadFiles();
      setSelectedFile(null);
    } catch (err) {
      setError('Failed to upload file');
      console.error('Error uploading file:', err);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleDeleteFile = async (fileName) => {
    try {
      setShowSpinner(true);
      const fileHash = calculateFileHash(fileName);
      await wallet.callMethod({ 
        contractId: CONTRACT, 
        method: 'delete_file',
        args: { file_hash: fileHash }
      });
      await loadFiles();
    } catch (err) {
      setError('Failed to delete file');
      console.error('Error deleting file:', err);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      setShowSpinner(true);
      const response = await fetch(file.url, {
        mode: 'cors',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const encryptedData = await response.arrayBuffer();
      
      // Decrypt the file
      const decryptedContent = await EncryptionService.decryptFile(encryptedData);
      
      // Create and download file
      const blob = new Blob([decryptedContent]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download file');
      console.error('Error downloading file:', err);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedFiles.size === 0) return;

    try {
      setShowSpinner(true);
      const zip = new JSZip();

      for (const fileName of selectedFiles) {
        const file = files[fileName];
        const response = await fetch(file.url, {
          mode: 'cors',
          headers: {
            'Accept': 'application/octet-stream',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const encryptedData = await response.arrayBuffer();
        
        // Decrypt the file
        const decryptedContent = await EncryptionService.decryptFile(encryptedData);
        
        // Add to zip
        zip.file(file.name, decryptedContent);
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'files.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download files');
      console.error('Error downloading files:', err);
    } finally {
      setShowSpinner(false);
    }
  };

  const toggleFileSelection = (fileName) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileName)) {
      newSelected.delete(fileName);
    } else {
      newSelected.add(fileName);
    }
    setSelectedFiles(newSelected);
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">File Storage</a>
          <div className="d-flex align-items-center justify-content-end gap-3">
            {loggedIn && (
              <button
                className="btn btn-outline-light btn-sm flex-shrink-0"
                onClick={() => setShowPasswordViewModal(true)}
              >
                Show Password
              </button>
            )}
            <WalletButton />
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 mb-0">My Files</h2>
                  {loggedIn && (
                    <div className="d-flex gap-2">
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileSelect}
                        disabled={showSpinner}
                        style={{ maxWidth: '300px' }}
                      />
                      <button
                        className="btn btn-primary"
                        onClick={handleFileUpload}
                        disabled={!selectedFile || showSpinner}
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>

                {showSpinner ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedFiles.size === Object.keys(files).length}
                              onChange={() => {
                                if (selectedFiles.size === Object.keys(files).length) {
                                  setSelectedFiles(new Set());
                                } else {
                                  setSelectedFiles(new Set(Object.keys(files)));
                                }
                              }}
                            />
                          </th>
                          <th>Name</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(files).map((file) => (
                          <tr key={file.name}>
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedFiles.has(file.name)}
                                onChange={() => toggleFileSelection(file.name)}
                              />
                            </td>
                            <td>
                              <a 
                                href={file.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                <i className="bi bi-file-earmark me-2"></i>
                                {file.name}
                              </a>
                            </td>
                            <td>
                              <div className="btn-group">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleDownloadFile(file)}
                                  disabled={showSpinner}
                                >
                                  <i className="bi bi-download"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteFile(file.name)}
                                  disabled={showSpinner}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedFiles.size > 0 && (
                      <div className="mt-3">
                        <button
                          className="btn btn-primary"
                          onClick={handleDownloadSelected}
                          disabled={showSpinner}
                        >
                          Download Selected ({selectedFiles.size})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={loadFiles}
        isSetup={!isPasswordSetup}
      />

      <ShowPasswordModal
        isOpen={showPasswordViewModal}
        onClose={() => setShowPasswordViewModal(false)}
      />
    </div>
  );
}