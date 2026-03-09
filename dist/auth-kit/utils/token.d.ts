/**
 * Auth Kit - Token Management Utilities
 *
 * JWT token yönetimi ve localStorage helpers
 */
/**
 * Token'ı localStorage'a kaydet
 */
export declare const setToken: (token: string) => void;
/**
 * Token'ı localStorage'dan al
 */
export declare const getToken: () => string | null;
/**
 * Token'ı localStorage'dan sil
 */
export declare const removeToken: () => void;
/**
 * Refresh token'ı kaydet
 */
export declare const setRefreshToken: (token: string) => void;
/**
 * Refresh token'ı al
 */
export declare const getRefreshToken: () => string | null;
/**
 * Refresh token'ı sil
 */
export declare const removeRefreshToken: () => void;
/**
 * Kullanıcı verisini kaydet
 */
export declare const setUser: (user: Record<string, unknown>) => void;
/**
 * Kullanıcı verisini al
 */
export declare const getUser: <T = Record<string, unknown>>() => T | null;
/**
 * Kullanıcı verisini sil
 */
export declare const removeUser: () => void;
/**
 * Tüm auth verilerini temizle (logout)
 */
export declare const clearAuth: () => void;
/**
 * JWT token'ı decode et (payload'ı al)
 * Not: Signature doğrulaması yapmaz, sadece payload'ı okur
 */
export declare const decodeToken: <T = Record<string, unknown>>(token: string) => T | null;
/**
 * Token'ın expire olup olmadığını kontrol et
 */
export declare const isTokenExpired: (token: string) => boolean;
/**
 * Token'ın ne kadar süre sonra expire olacağını hesapla (saniye)
 */
export declare const getTokenExpiresIn: (token: string) => number;
/**
 * Session storage helper (tab kapanınca silinen)
 */
export declare const sessionStorage: {
    set: (key: string, value: unknown) => void;
    get: <T = unknown>(key: string) => T | null;
    remove: (key: string) => void;
    clear: () => void;
};
//# sourceMappingURL=token.d.ts.map