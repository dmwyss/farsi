const localStorageManager = {
    // Save or overwrite data
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    },
    // Retrieve data (returns null if key doesn't exist)
    get(key, vDefault=null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : vDefault;
        } catch (error) {
            console.error(`Error getting localStorage key "${key}":`, error);
            return vDefault;
        }
    },
    // Delete a specific key
    remove(key) {
        localStorage.removeItem(key);
    }
};