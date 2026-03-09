/**
 * Auth Kit - Public API
 *
 * Kimlik doğrulama modülü barrel export
 * Sadece public API'yi expose eder
 */
export { AuthKitProvider } from './context/AuthKitProvider';
export { useAuthKit, useAuthKitConfig, useAuthKitTranslation } from './context/useAuthKit';
export type { AuthKitConfig, AuthKitRoutes, AuthKitUIConfig, AuthKitTranslations, AuthKitContextValue, SignInCredentials, SignInResponse, OtpData, OtpResponse, ForgotPasswordData, ForgotPasswordResponse, ResetPasswordData, ResetPasswordResponse, SignInFormProps, OtpFormProps, ForgotPasswordFormProps, ResetPasswordFormProps, } from './context/types';
export { SignInForm } from './components/SignInForm';
export { OtpForm } from './components/OtpForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
export { SignInPageContent } from './pages/SignInPageContent';
export { SignIn2PageContent } from './pages/SignIn2PageContent';
export { OtpPageContent } from './pages/OtpPageContent';
export { ForgotPasswordPageContent } from './pages/ForgotPasswordPageContent';
export { ResetPasswordPageContent } from './pages/ResetPasswordPageContent';
export { defaultTranslations, getDefaultLocale, getSupportedLocales } from './i18n/defaults';
export { isValidEmail, isValidUsername, isValidPhoneNumber, isValidOtp, getPasswordStrength, getPasswordStrengthText, passwordsMatch, meetsMinPasswordLength, calculatePasswordSimilarity, setToken, getToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken, setUser, getUser, removeUser, clearAuth, decodeToken, isTokenExpired, getTokenExpiresIn, sessionStorage, } from './utils';
export { GoogleIcon, AppleIcon, type IconProps } from './icons';
//# sourceMappingURL=index.d.ts.map