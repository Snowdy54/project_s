import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidNickname,
  hasForbiddenQuotes,
} from './validation';

describe('Profile & Auth Validation Rules', () => {
  it('validates emails correctly', () => {
    expect(isValidEmail('user@myskill.ru')).toBe(true);
    expect(isValidEmail('test.dev@company.com')).toBe(true);
    expect(isValidEmail('  example@myskill.com  ')).toBe(true);
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@missinguser.com')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
  });

  it('validates phone numbers with flexible formatting', () => {
    expect(isValidPhone('+7 (999) 123-45-67')).toBe(true);
    expect(isValidPhone('89991234567')).toBe(true);
    expect(isValidPhone('9991234567')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });

  it('validates nicknames and rejects forbidden quotation marks per specs', () => {
    expect(isValidNickname('Александр Скиллмапов')).toBe(true);
    expect(isValidNickname('   ')).toBe(false);
    expect(isValidNickname('Иван «Хакер»')).toBe(false);
    expect(isValidNickname('Пётр”')).toBe(false);
    expect(isValidNickname('»Сергей')).toBe(false);
    expect(hasForbiddenQuotes('NormalName')).toBe(false);
    expect(hasForbiddenQuotes('Bad«Name')).toBe(true);
  });
});
