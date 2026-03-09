/**
 * Auth Kit - Token Management Utilities
 *
 * JWT token yönetimi ve localStorage helpers
 */
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
/**
 * Token'ı localStorage'a kaydet
 */
export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
};
/**
 * Token'ı localStorage'dan al
 */
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
};
/**
 * Token'ı localStorage'dan sil
 */
export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
};
/**
 * Refresh token'ı kaydet
 */
export const setRefreshToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
};
/**
 * Refresh token'ı al
 */
export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
};
/**
 * Refresh token'ı sil
 */
export const removeRefreshToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};
/**
 * Kullanıcı verisini kaydet
 */
export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};
/**
 * Kullanıcı verisini al
 */
export const getUser = () => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem(USER_KEY);
        if (userData) {
            try {
                return JSON.parse(userData);
            }
            catch {
                return null;
            }
        }
    }
    return null;
};
/**
 * Kullanıcı verisini sil
 */
export const removeUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
    }
};
/**
 * Tüm auth verilerini temizle (logout)
 */
export const clearAuth = () => {
    removeToken();
    removeRefreshToken();
    removeUser();
};
/**
 * JWT token'ı decode et (payload'ı al)
 * Not: Signature doğrulaması yapmaz, sadece payload'ı okur
 */
export const decodeToken = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    }
    catch {
        return null;
    }
};
/**
 * Token'ın expire olup olmadığını kontrol et
 */
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp)
        return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};
/**
 * Token'ın ne kadar süre sonra expire olacağını hesapla (saniye)
 */
export const getTokenExpiresIn = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp)
        return 0;
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - currentTime);
};
/**
 * Session storage helper (tab kapanınca silinen)
 */
export const sessionStorage = {
    set: (key, value) => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        }
    },
    get: (key) => {
        if (typeof window !== 'undefined') {
            const item = window.sessionStorage.getItem(key);
            if (item) {
                try {
                    return JSON.parse(item);
                }
                catch {
                    return null;
                }
            }
        }
        return null;
    },
    remove: (key) => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(key);
        }
    },
    clear: () => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.clear();
        }
    }
};
//# sourceMappingURL=token.js.map