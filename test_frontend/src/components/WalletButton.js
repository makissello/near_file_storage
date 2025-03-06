import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';

import { NearContext } from '@/wallets/near';
import NearLogo from '/public/near-logo.svg';

export const WalletButton = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Login');
    }
  }, [signedAccountId, wallet]);

  return (
      <div className="container-fluid">
        <div className='navbar-nav'>
          <button 
            className="btn btn-outline-light btn-sm" 
            onClick={action}
          > 
            {label} 
          </button>
        </div>
      </div>
  );
};