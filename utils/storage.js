/**
 * storage - Safe wrapper for localStorage and sessionStorage
 *
 * Usage:
 *   storage.set('theme', 'dark');              // localStorage
 *   storage.get('theme');                      // "dark"
 *   storage.remove('theme');                   // removes key
 *   storage.clear();                           // clears all localStorage
 *
 *   storage.session.set('token', 'abc123');   // sessionStorage
 */

const createStorage = (type = "local") => ({
  set: (key, value) => {
    try {
      const str = JSON.stringify(value);
      (type === "local" ? localStorage : sessionStorage).setItem(key, str);
    } catch (err) {
      console.error(`[storage][set] Error storing key "${key}":`, err);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = (type === "local" ? localStorage : sessionStorage).getItem(
        key
      );
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.error(`[storage][get] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      (type === "local" ? localStorage : sessionStorage).removeItem(key);
    } catch (err) {
      console.error(`[storage][remove] Error removing key "${key}":`, err);
    }
  },

  clear: () => {
    try {
      (type === "local" ? localStorage : sessionStorage).clear();
    } catch (err) {
      console.error("[storage][clear] Error clearing storage:", err);
    }
  },
});

export const storage = createStorage("local");
export const sessionStorageWrapper = createStorage("session");

// Example Usage:
// storage.set('user', { name: 'Jackson' });
// const user = storage.get('user');
// storage.remove('user');
// storage.clear();
export default storage;
