import type { AuthKitContextValue } from './types';
/**
 * AuthKit context hook
 * @throws Eğer AuthKitProvider dışında kullanılırsa hata fırlatır
 */
export declare function useAuthKit(): AuthKitContextValue;
/**
 * AuthKit config'e doğrudan erişim için yardımcı hook
 */
export declare function useAuthKitConfig(): import("./types").AuthKitConfig;
/**
 * AuthKit translation'a doğrudan erişim için yardımcı hook
 */
export declare function useAuthKitTranslation(): (key: string, params?: Record<string, string>) => string;
//# sourceMappingURL=useAuthKit.d.ts.map