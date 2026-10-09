import { useContext } from 'react';
import { OutbreakContext } from './outbreakContextDef';

export function useOutbreak() {
  const ctx = useContext(OutbreakContext);
  if (!ctx) {
    throw new Error('useOutbreak must be used within OutbreakProvider');
  }
  return ctx;
}
