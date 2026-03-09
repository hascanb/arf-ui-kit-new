/**
 * Auth Kit - Translation Hook
 *
 * Nested key desteği ile çeviri hook'u
 * Örnek: t('signIn.title') -> "Giriş Yap"
 */
import type { AuthKitTranslations } from '../context/types';
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
export declare function useTranslation(locale?: string, customTranslations?: Partial<AuthKitTranslations>): {
    t: (key: string, params?: Record<string, string>) => string;
    locale: string;
    translations: AuthKitTranslations;
};
//# sourceMappingURL=use-translation.d.ts.map