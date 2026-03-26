const STORAGE_KEY = 'scanpesado.current-user';

export function getStoredUser() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function storeUser(user) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  sessionStorage.removeItem(STORAGE_KEY);
}
