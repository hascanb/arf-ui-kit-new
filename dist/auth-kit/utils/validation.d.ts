/**
 * Auth Kit - Validation Utilities
 *
 * Form validation helper fonksiyonları
 */
/**
 * Email formatı doğrulama
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Şifre gücü kontrolü
 * @returns 0-4 arası değer (0: çok zayıf, 4: çok güçlü)
 */
export declare const getPasswordStrength: (password: string) => number;
/**
 * Şifre gücü metni
 */
export declare const getPasswordStrengthText: (strength: number) => string;
/**
 * Kullanıcı adı formatı kontrolü
 * - En az 3 karakter
 * - Sadece harf, rakam, alt çizgi ve nokta
 */
export declare const isValidUsername: (username: string) => boolean;
/**
 * Telefon numarası formatı kontrolü (Türkiye)
 * Desteklenen formatlar:
 * - 05XX XXX XX XX
 * - 5XXXXXXXXX
 * - +90 5XX XXX XX XX
 */
export declare const isValidPhoneNumber: (phone: string) => boolean;
/**
 * OTP kodu formatı kontrolü
 */
export declare const isValidOtp: (otp: string, length?: number) => boolean;
/**
 * Şifre eşleşme kontrolü
 */
export declare const passwordsMatch: (password: string, confirmPassword: string) => boolean;
/**
 * Minimum şifre uzunluğu kontrolü
 */
export declare const meetsMinPasswordLength: (password: string, minLength?: number) => boolean;
/**
 * İki şifre arasındaki farkı hesapla (güvenlik için)
 * Yeni şifre eski şifre ile çok benzer olmamalı
 */
export declare const calculatePasswordSimilarity: (oldPassword: string, newPassword: string) => number;
//# sourceMappingURL=validation.d.ts.map