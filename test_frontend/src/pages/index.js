import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NearContext } from '@/wallets/near';
import { useContext } from 'react';

export default function Home() {
  const router = useRouter();
  const { signedAccountId } = useContext(NearContext);

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0 w-50 h-100 bg-white bg-opacity-10" style={{ transform: 'skewX(-15deg) translateX(50%)' }}></div>
        <div className="container position-relative">
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Secure File Storage on NEAR</h1>
              <p className="lead mb-4">
                Store your files securely on the blockchain with end-to-end encryption. 
                Powered by NEAR Protocol and IPFS.
              </p>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-light btn-lg px-4 shadow-sm"
                  onClick={() => router.push('/file-storage')}
                >
                  Get Started
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="bg-white rounded-3 p-4 shadow-lg">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-shield-lock text-primary"></i>
                    </div>
                    <h5 className="mb-0 text-dark">End-to-End Encryption</h5>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-cloud-arrow-up text-primary"></i>
                    </div>
                    <h5 className="mb-0 text-dark">Decentralized Storage</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-wallet2 text-primary"></i>
                    </div>
                    <h5 className="mb-0 text-dark">Web3 Integration</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 text-dark">Why Choose Our Platform?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-shield-check text-primary fs-4"></i>
                  </div>
                  <h3 className="h5 mb-3">Secure by Design</h3>
                  <p className="text-muted mb-0">
                    Your files are encrypted before upload and stored on IPFS. 
                    Only you can access them with your private key.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-lightning text-primary fs-4"></i>
                  </div>
                  <h3 className="h5 mb-3">Fast & Reliable</h3>
                  <p className="text-muted mb-0">
                    Built on NEAR Protocol for fast transactions and IPFS for 
                    distributed storage. Your files are always available.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                    <i className="bi bi-globe text-primary fs-4"></i>
                  </div>
                  <h3 className="h5 mb-3">Web3 Ready</h3>
                  <p className="text-muted mb-0">
                    Seamlessly integrate with your Web3 wallet. No traditional 
                    login required - just connect your NEAR wallet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5 text-dark">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <i className="bi bi-wallet2 text-primary fs-4"></i>
                </div>
                <h4 className="h6 mb-2 text-dark">1. Connect Wallet</h4>
                <p className="text-muted small mb-0">Connect your NEAR wallet to get started</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <i className="bi bi-key text-primary fs-4"></i>
                </div>
                <h4 className="h6 mb-2 text-dark">2. Set Password</h4>
                <p className="text-muted small mb-0">Create a password to encrypt your files</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <i className="bi bi-cloud-arrow-up text-primary fs-4"></i>
                </div>
                <h4 className="h6 mb-2 text-dark">3. Upload Files</h4>
                <p className="text-muted small mb-0">Upload and encrypt your files</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                  <i className="bi bi-cloud-check text-primary fs-4"></i>
                </div>
                <h4 className="h6 mb-2 text-dark">4. Access Anywhere</h4>
                <p className="text-muted small mb-0">Access your files securely from anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4">
            Join the future of secure file storage with NEAR Protocol
          </p>
          <button 
            className="btn btn-light btn-lg px-5 shadow-sm"
            onClick={() => router.push('/file_storage')}
          >
            Start Storing Files
          </button>
        </div>
      </div>

      <style jsx global>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
      `}</style>
    </div>
  );
}