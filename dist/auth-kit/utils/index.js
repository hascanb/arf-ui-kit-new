/**
 * Auth Kit - Utilities Barrel Export
 */
// Validation utilities
export { isValidEmail, isValidUsername, isValidPhoneNumber, isValidOtp, getPasswordStrength, getPasswordStrengthText, passwordsMatch, meetsMinPasswordLength, calculatePasswordSimilarity, } from './validation';
// Token management utilities
export { setToken, getToken, removeToken, setRefreshToken, getRefreshToken, removeRefreshToken, setUser, getUser, removeUser, clearAuth, decodeToken, isTokenExpired, getTokenExpiresIn, sessionStorage, } from './token';
//# sourceMappingURL=index.js.map