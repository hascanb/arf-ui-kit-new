/**
 * Auth Kit - Translation Hook
 *
 * Nested key desteği ile çeviri hook'u
 * Örnek: t('signIn.title') -> "Giriş Yap"
 */
import { useCallback, useMemo } from 'react';
import { defaultTranslations, getDefaultLocale } from './defaults';
/**
 * Nested object'te key path ile değer bul
 * @example getNestedValue({ a: { b: 'value' } }, 'a.b') -> 'value'
 */
function getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        }
        else {
            return undefined;
        }
    }
    return typeof current === 'string' ? current : undefined;
}
/**
 * Template string'i parametrelerle doldur
 * @example interpolate('Hello {{name}}', { name: 'World' }) -> 'Hello World'
 */
function interpolate(template, params) {
    if (!params)
        return template;
    return Object.entries(params).reduce((result, [key, value]) => {
        return result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }, template);
}
/**
 * Çeviri hook'u
 *
 * @param locale Aktif dil
 * @param customTranslations Özel çeviriler (varsayılanları override eder)
 * @returns Çeviri fonksiyonu
 *
 * @example
 * const { t } = useTranslation('tr')
 * t('signIn.title') // -> "Giriş Yap"
 * t('errors.generic', { error: 'timeout' }) // -> parametreli çeviri
 */
export function useTranslation(locale, customTranslations) {
    const activeLocale = locale || getDefaultLocale();
    // Varsayılan ve özel çevirileri birleştir
    const translations = useMemo(() => {
        const defaultTrans = defaultTranslations[activeLocale] || defaultTranslations[getDefaultLocale()];
        if (!customTranslations)
            return defaultTrans;
        // Deep merge
        return {
            signIn: { ...defaultTrans.signIn, ...customTranslations.signIn },
            otp: { ...defaultTrans.otp, ...customTranslations.otp },
            forgotPassword: { ...defaultTrans.forgotPassword, ...customTranslations.forgotPassword },
            resetPassword: { ...defaultTrans.resetPassword, ...customTranslations.resetPassword },
            validation: { ...defaultTrans.validation, ...customTranslations.validation },
            errors: { ...defaultTrans.errors, ...customTranslations.errors },
        };
    }, [activeLocale, customTranslations]);
    /**
     * Çeviri fonksiyonu
     * @param key Nested key (örn: 'signIn.title')
     * @param params Template parametreleri (opsiyonel)
     */
    const t = useCallback((key, params) => {
        const value = getNestedValue(translations, key);
        if (!value) {
            console.warn(`[auth-kit] Translation key not found: "${key}"`);
            return key; // Key bulunamazsa key'i döndür
        }
        return interpolate(value, params);
    }, [translations]);
    return { t, locale: activeLocale, translations };
}
//# sourceMappingURL=use-translation.js.map