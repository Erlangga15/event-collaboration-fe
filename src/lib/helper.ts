export const getFromLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Error accessing localStorage for key "${key}":`, error);
    return null;
  }
};

export const getFromSessionStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`Error accessing sessionStorage for key "${key}":`, error);
    return null;
  }
};
