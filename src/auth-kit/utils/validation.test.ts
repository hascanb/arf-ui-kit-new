import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidUsername,
  isValidPhoneNumber,
  isValidOtp,
  getPasswordStrength,
  getPasswordStrengthText,
  passwordsMatch,
  meetsMinPasswordLength,
  calculatePasswordSimilarity,
} from './validation'

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
      expect(isValidEmail('valid_email@test.io')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@no-local-part.com')).toBe(false)
      expect(isValidEmail('no-at-sign.com')).toBe(false)
    })
  })

  describe('isValidUsername', () => {
    it('should return true for valid usernames', () => {
      expect(isValidUsername('john_doe')).toBe(true)
      expect(isValidUsername('user123')).toBe(true)
      expect(isValidUsername('test.user')).toBe(true) // dots allowed
      expect(isValidUsername('a'.repeat(30))).toBe(true)
    })

    it('should return false for invalid undernames', () => {
      expect(isValidUsername('')).toBe(false)
      expect(isValidUsername('ab')).toBe(false) // too short (< 3)
      expect(isValidUsername('user-name')).toBe(false) // dashes not allowed
      expect(isValidUsername('user@name')).toBe(false) // @ not allowed
      expect(isValidUsername('user name')).toBe(false) // space not allowed
    })
  })

  describe('isValidPhoneNumber', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhoneNumber('+905551234567')).toBe(true)
      expect(isValidPhoneNumber('5551234567')).toBe(true) // without 0
      expect(isValidPhoneNumber('+905441234567')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhoneNumber('')).toBe(false)
      expect(isValidPhoneNumber('123')).toBe(false) // too short
      expect(isValidPhoneNumber('abcdefghij')).toBe(false) // letters
      expect(isValidPhoneNumber('05551234567')).toBe(false) // starts with 0 (not matching regex)
    })
  })

  describe('isValidOtp', () => {
    it('should return true for valid 6-digit OTP', () => {
      expect(isValidOtp('123456')).toBe(true)
      expect(isValidOtp('000000')).toBe(true)
      expect(isValidOtp('999999')).toBe(true)
    })

    it('should return false for invalid OTP', () => {
      expect(isValidOtp('')).toBe(false)
      expect(isValidOtp('12345')).toBe(false) // too short
      expect(isValidOtp('1234567')).toBe(false) // too long
      expect(isValidOtp('12345a')).toBe(false) // contains letter
      expect(isValidOtp('abc123')).toBe(false) // contains letters
    })
  })

  describe('getPasswordStrength', () => {
    it('should return 0 for empty passwords', () => {
      expect(getPasswordStrength('')).toBe(0)
    })

    it('should return 1 for short passwords', () => {
      expect(getPasswordStrength('12345')).toBe(1) // has number, adds 1
    })

    it('should return strength based on criteria', () => {
      expect(getPasswordStrength('password')).toBe(1) // >= 8 chars
      expect(getPasswordStrength('12345678')).toBe(2) // >= 8 + has number
      expect(getPasswordStrength('Password')).toBe(2) // >= 8 + upper/lower
      expect(getPasswordStrength('Password123')).toBe(3) // >= 8 + upper/lower + number
      expect(getPasswordStrength('Password123!')).toBe(4) // all criteria
    })
  })

  describe('getPasswordStrengthText', () => {
    it('should return correct strength text in Turkish (default)', () => {
      expect(getPasswordStrengthText(0)).toBe('Çok Zayıf')
      expect(getPasswordStrengthText(1)).toBe('Zayıf')
      expect(getPasswordStrengthText(2)).toBe('Orta')
      expect(getPasswordStrengthText(3)).toBe('Güçlü')
      expect(getPasswordStrengthText(4)).toBe('Çok Güçlü')
    })
  })

  describe('passwordsMatch', () => {
    it('should return true for matching non-empty passwords', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true)
      expect(passwordsMatch('Test', 'Test')).toBe(true)
    })

    it('should return false for non-matching orempty passwords', () => {
      expect(passwordsMatch('password123', 'password456')).toBe(false)
      expect(passwordsMatch('Test', 'test')).toBe(false) // case sensitive
      expect(passwordsMatch('', '')).toBe(false) // empty strings don't match (security)
    })
  })

  describe('meetsMinPasswordLength', () => {
    it('should return true for passwords meeting min length', () => {
      expect(meetsMinPasswordLength('12345678')).toBe(true) // exactly 8
      expect(meetsMinPasswordLength('123456789')).toBe(true) // > 8
    })

    it('should return false for passwords below min length', () => {
      expect(meetsMinPasswordLength('')).toBe(false)
      expect(meetsMinPasswordLength('1234567')).toBe(false) // < 8
    })
  })

  describe('calculatePasswordSimilarity', () => {
    it('should return 100 for identical strings', () => {
      expect(calculatePasswordSimilarity('password', 'password')).toBe(100)
      expect(calculatePasswordSimilarity('', '')).toBe(100) // empty = identical
    })

    it('should return 0 for completely different strings', () => {
      expect(calculatePasswordSimilarity('abc', 'xyz')).toBe(0)
    })

    it('should return percentage for partially similar strings', () => {
      const similarity = calculatePasswordSimilarity('password123', 'password456')
      expect(similarity).toBeGreaterThan(0)
      expect(similarity).toBeLessThan(100)
    })

    it('should be case-sensitive', () => {
      const similarity = calculatePasswordSimilarity('PASSWORD', 'password')
      expect(similarity).toBe(0) // Different cases = no match
    })
  })
})
