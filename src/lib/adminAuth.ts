export interface AdminSession {
  email: string;
  name: string;
  role: 'admin';
  loggedInAt: string;
  token?: string;
}

const AUTH_STORAGE_KEY = 'griya_admin_auth';

/**
 * Validates whether the current browser storage contains a valid admin session.
 */
export function getStoredAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (session && session.role === 'admin' && session.email) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if the user is currently authenticated as admin.
 */
export function isAdminAuthenticated(): boolean {
  return getStoredAdminSession() !== null;
}

/**
 * Saves an admin session to localStorage with a simulated token.
 */
export function saveAdminSession(session: Omit<AdminSession, 'loggedInAt' | 'token'>): AdminSession {
  const fullSession: AdminSession = {
    ...session,
    loggedInAt: new Date().toISOString(),
    token: `mock_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`
  };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullSession));
  } catch (err) {
    console.error('Failed to save admin session', err);
  }
  return fullSession;
}

/**
 * Clears the admin session from localStorage.
 */
export function clearAdminSession(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear admin session', err);
  }
}
