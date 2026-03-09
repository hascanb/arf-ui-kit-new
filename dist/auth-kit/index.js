/**
 * Auth Kit - Public API
 *
 * Kimlik doğrulama modülü barrel export
 * Sadece public API'yi expose eder
 */
// ========== Context & Provider ==========
export { AuthKitProvider } from './context/AuthKitProvider';
export { useAuthKit, useAuthKitConfig, useAuthKitTranslation } from './context/useAuthKit';
// ========== Components ==========
export { SignInForm } from './components/SignInForm';
export { OtpForm } from './components/OtpForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
// ========== Pages ==========
export { SignInPageContent } from './pages/SignInPageContent';
export { SignIn2PageContent } from './pages/SignIn2PageContent';
export { OtpPageContent } from './pages/OtpPageContent';
export { ForgotPasswordPageContent } from './pages/ForgotPasswordPageContent';
export { ResetPasswordPageContent } from './pages/ResetPasswordPageContent';
// ========== i18n ==========
export { defaultTranslations, getDefaultLocale, getSupportedLocales } from './i18n/defaults';
// ========== Utils ==========
export { 
// Validation
isValidEmail, isValidUsername, isValidPhoneNumber, isValidOtp, getPasswordStrength, getPasswordStrengthText, passwordsMatch, meetsMinPasswordLength, calculatePasswordSimilarity, 
// Token Management
setToken, getToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken, setUser, getUser, removeUser, clearAuth, decodeToken, isTokenExpired, getTokenExpiresIn, sessionStorage, } from './utils';
// ========== Brand Icons ==========
// Lucide React'te olmayan social login ikonları
export { GoogleIcon, AppleIcon } from './icons';
//# sourceMappingURL=index.js.map