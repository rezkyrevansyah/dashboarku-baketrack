import { Transaction, Product, Profile, FullDashboardData } from '@/types/dashboard';
import { mapProfile } from './helpers';

export type { Transaction, Product, Profile, FullDashboardData };

// Dynamic URL getter
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('baketrack_api_url') || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';
  }
  return process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';
};

const PROXY_URL = '/api/proxy';

/**
 * Fetches all unified data from Google Sheet via Proxy
 */
export async function fetchFullData(): Promise<FullDashboardData | null> {
  const SCRIPT_URL = getApiUrl();
  console.log('Using Google Script URL:', SCRIPT_URL);
  if (!SCRIPT_URL) return null;

  try {
    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(`${SCRIPT_URL}?action=getData`)}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to fetch data (${res.status})`);
    }
    
    const rawData = await res.json();
    
    // Normalize Profile Data
    const profileRaw = rawData.profile || {};
    const profilesRaw = rawData.profiles || (rawData.profile ? [rawData.profile] : []); // Handle both V1 and V2 API

    const activeProfile = mapProfile(profileRaw);
    const allProfiles = profilesRaw.map(mapProfile);

    // Normalize Transactions
    const transactions = (rawData.transactions || []).map((t: any) => ({
      ...t,
      // If GAS script V2 is used, Column A is the ID/Timestamp.
      id: t.timestamp ? t.timestamp.toString() : t.id?.toString()
    }));

    const products = (rawData.products || []).map((p: any) => ({
      ...p,
      // Map GAS lowercase 'costprice' to frontend 'costPrice'
      costPrice: p.costprice !== undefined ? Number(p.costprice) : (p.costPrice !== undefined ? Number(p.costPrice) : undefined),
      // Ensure numeric types
      price: Number(p.price),
      stock: Number(p.stock),
      sold: Number(p.sold)
    }));

    return {
      transactions: transactions,
      products: products,
      profile: activeProfile,
      profiles: allProfiles
    };
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
}

/**
 * Sends a new transaction OR updates existing one to the Google Sheet via Proxy
 */
export async function submitTransaction(data: Transaction, isUpdate = false): Promise<boolean> {
  const SCRIPT_URL = getApiUrl();
  if (!SCRIPT_URL) return false;

  try {
    const formData = new FormData();
    formData.append('action', 'manageTransaction');
    formData.append('subAction', isUpdate ? 'update' : 'create');
    
    // For create, we generate ID here if not present. For update, we need existing ID.
    const id = data.id || Date.now().toString();
    formData.append('id', id);
    
    formData.append('date', data.date);
    formData.append('product', data.product);
    formData.append('qty', data.qty.toString());
    formData.append('price', data.price.toString());
    formData.append('total', data.total.toString());
    formData.append('addedBy', data.addedBy || ''); // Send addedBy field

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(SCRIPT_URL)}`, {
      method: 'POST',
      body: formData
    });
    
    return res.ok;
  } catch (error) {
    console.error("API Submit Error:", error);
    return false;
  }
}

/**
 * Deletes a transaction
 */
export async function deleteTransaction(id: string): Promise<boolean> {
  const SCRIPT_URL = getApiUrl();
  if (!SCRIPT_URL) return false;

  try {
    const formData = new FormData();
    formData.append('action', 'manageTransaction');
    formData.append('subAction', 'delete');
    formData.append('id', id);

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(SCRIPT_URL)}`, {
      method: 'POST',
      body: formData
    });
    
    return res.ok;
  } catch (error) {
    console.error("API Delete Transaction Error:", error);
    return false;
  }
}

/**
 * Manage products (create, update, delete) via Proxy
 */
export async function manageProduct(action: 'create' | 'update' | 'delete', product: Partial<Product>): Promise<boolean> {
  const SCRIPT_URL = getApiUrl();
  if (!SCRIPT_URL) return false;

  try {
    const formData = new FormData();
    formData.append('action', 'manageProduct');
    formData.append('subAction', action);
    formData.append('id', product.id?.toString() || '');
    formData.append('name', product.name || '');
    formData.append('price', product.price?.toString() || '');
    formData.append('costPrice', product.costPrice?.toString() || '');
    formData.append('stock', product.stock?.toString() || '');
    formData.append('sold', product.sold?.toString() || '');
    formData.append('image', product.image || '');

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(SCRIPT_URL)}`, {
      method: 'POST',
      body: formData
    });
    
    return res.ok;
  } catch (error) {
    console.error("API Product Error:", error);
    return false;
  }
}

/**
 * Update user profile via Proxy
 */
export async function updateProfile(profile: Profile): Promise<boolean> {
  const SCRIPT_URL = getApiUrl();
  if (!SCRIPT_URL) return false;

  try {
    const formData = new FormData();
    formData.append('action', 'updateProfile');
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('photoUrl', profile.photourl);

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(SCRIPT_URL)}`, {
      method: 'POST',
      body: formData
    });
    
    return res.ok;
  } catch (error) {
    console.error("API Profile Error:", error);
    return false;
  }
}
