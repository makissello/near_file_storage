import { useContext } from 'react';
import { NearContext } from '@/wallets/near';

export function useNear() {
  const context = useContext(NearContext);
  
  if (!context) {
    throw new Error('useNear must be used within a NearProvider');
  }
  
  return context;
} 