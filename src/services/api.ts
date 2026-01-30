export const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';

// Types for the dashboard
export interface Transaction {
  id?: string; // timestamp string
  timestamp?: string;
  date: string;
  product: string;
  qty: number;
  price: number;
  total: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  sold: number;
}

export interface Profile {
  name: string;
  email: string;
  photourl: string;
}

export interface FullDashboardData {
  transactions: Transaction[];
  products: Product[];
  profile: Profile;
}

const PROXY_URL = '/api/proxy';

/**
 * Fetches all unified data from Google Sheet via Proxy
 */
export async function fetchFullData(): Promise<FullDashboardData | null> {
  try {
    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(`${GOOGLE_SCRIPT_URL}?action=getData`)}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    const rawData = await res.json();
    
    // Normalize Profile Data
    // GAS might return various casings depending on sheet headers
    const profileRaw = rawData.profile || {};
    
    // Helper to find case-insensitive key
    const getVal = (obj: any, key: string) => {
      const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
      return foundKey ? obj[foundKey] : undefined;
    };

    const profile: Profile = {
      name: getVal(profileRaw, 'name') || 'Admin Bakery',
      email: getVal(profileRaw, 'email') || 'admin@baketrack.com',
      photourl: getVal(profileRaw, 'photourl') || getVal(profileRaw, 'photourl') || getVal(profileRaw, 'photo') || '👩‍🍳'
    };

    // Normalize Transactions: ensure they have IDs if possible (fallback to timestamp if available, or just index logic in UI)
    // The GAS V2 script returns them.
    const transactions = (rawData.transactions || []).map((t: any) => ({
      ...t,
      // If GAS script V2 is used, Column A is the ID/Timestamp.
      // If we need to force it to string:
      id: t.timestamp ? t.timestamp.toString() : t.id?.toString()
    }));

    return {
      transactions: transactions,
      products: rawData.products || [],
      profile
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

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(GOOGLE_SCRIPT_URL)}`, {
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
  try {
    const formData = new FormData();
    formData.append('action', 'manageTransaction');
    formData.append('subAction', 'delete');
    formData.append('id', id);

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(GOOGLE_SCRIPT_URL)}`, {
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
  try {
    const formData = new FormData();
    formData.append('action', 'manageProduct');
    formData.append('subAction', action);
    formData.append('id', product.id?.toString() || '');
    formData.append('name', product.name || '');
    formData.append('price', product.price?.toString() || '');
    formData.append('stock', product.stock?.toString() || '');
    formData.append('image', product.image || '');

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(GOOGLE_SCRIPT_URL)}`, {
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
  try {
    const formData = new FormData();
    formData.append('action', 'updateProfile');
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('photoUrl', profile.photourl);

    const res = await fetch(`${PROXY_URL}?url=${encodeURIComponent(GOOGLE_SCRIPT_URL)}`, {
      method: 'POST',
      body: formData
    });
    
    return res.ok;
  } catch (error) {
    console.error("API Profile Error:", error);
    return false;
  }
}
