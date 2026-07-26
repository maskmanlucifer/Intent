export const APP_VERSION = "5.8";
export const LAST_SEEN_VERSION_KEY = "lastSeenVersion";

/**
 * Get the last seen version from storage
 * Uses chrome.storage in extension mode, localStorage in development
 */
export const getLastSeenVersion = async (): Promise<string | null> => {
    if (typeof chrome !== "undefined" && chrome.storage) {
        try {
            const result = await chrome.storage.local.get(LAST_SEEN_VERSION_KEY);
            return result[LAST_SEEN_VERSION_KEY] || null;
        } catch (error) {
            console.error("Error reading version from chrome.storage:", error);
        }
    }

    // Fallback to localStorage (development mode)
    return localStorage.getItem(LAST_SEEN_VERSION_KEY);
};

/**
 * Save the last seen version to storage
 * Uses chrome.storage in extension mode, localStorage in development
 */
export const setLastSeenVersion = async (version: string): Promise<void> => {
    // Save to localStorage (for development mode)
    localStorage.setItem(LAST_SEEN_VERSION_KEY, version);

    // Also save to chrome.storage (for extension mode)
    if (typeof chrome !== "undefined" && chrome.storage) {
        try {
            await chrome.storage.local.set({ [LAST_SEEN_VERSION_KEY]: version });
        } catch (error) {
            console.error("Error saving version to chrome.storage:", error);
        }
    }
};

/**
 * Check if there are new updates to show
 * Returns true if user hasn't seen the current version
 */
export const hasNewUpdates = async (): Promise<boolean> => {
    const lastSeenVersion = await getLastSeenVersion();
    return lastSeenVersion !== APP_VERSION;
};
