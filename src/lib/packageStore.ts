import { Package } from '../types';
import { mockPackages } from '../data/mockPackages';

const STORAGE_KEY = 'iyum_makeover_packages_2025';

/**
 * Retrieve packages from localStorage or fallback to mockPackages
 */
export function getStoredPackages(): Package[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Gagal membaca data paket dari storage:', err);
  }
  return mockPackages;
}

/**
 * Save packages to localStorage and broadcast change event
 */
export function saveStoredPackages(packages: Package[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    window.dispatchEvent(new CustomEvent('packages_updated', { detail: packages }));
  } catch (err) {
    console.error('Gagal menyimpan data paket ke storage:', err);
  }
}

/**
 * Reset packages to original mock data
 */
export function resetStoredPackages(): Package[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('packages_updated', { detail: mockPackages }));
  } catch (err) {
    console.error('Gagal mereset data paket:', err);
  }
  return mockPackages;
}

/**
 * Helper to toggle status of a package
 */
export function togglePackageStatus(id: string): Package[] {
  const current = getStoredPackages();
  const updated = current.map((pkg) => {
    if (pkg.id === id) {
      const nextStatus: 'active' | 'inactive' = pkg.status === 'active' ? 'inactive' : 'active';
      return { ...pkg, status: nextStatus };
    }
    return pkg;
  });
  saveStoredPackages(updated);
  return updated;
}

/**
 * Helper to delete a package
 */
export function deleteStoredPackage(id: string): Package[] {
  const current = getStoredPackages();
  const updated = current.filter((pkg) => pkg.id !== id);
  saveStoredPackages(updated);
  return updated;
}

/**
 * Helper to save or update a package
 */
export function upsertStoredPackage(pkg: Package): Package[] {
  const current = getStoredPackages();
  const index = current.findIndex((p) => p.id === pkg.id);
  let updated: Package[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...pkg, updated_at: new Date().toISOString() };
  } else {
    updated = [
      ...current,
      {
        ...pkg,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
  saveStoredPackages(updated);
  return updated;
}
