import { Profile } from '@/types/dashboard';

// Helper to find case-insensitive key
export const getVal = (obj: any, key: string) => {
  if (!obj) return undefined;
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
  return foundKey ? obj[foundKey] : undefined;
};

export const mapProfile = (p: any): Profile => ({
  name: getVal(p, 'name') || 'Admin Bakery',
  email: getVal(p, 'email') || 'admin@baketrack.com',
  photourl: getVal(p, 'photourl') || getVal(p, 'photourl') || getVal(p, 'photo') || '👩‍🍳',
  password: getVal(p, 'password') // Auto-mapped from dynamic sheet data
});
