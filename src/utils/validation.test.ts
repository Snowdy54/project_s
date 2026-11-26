import { describe, it, expect } from 'vitest';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidPhone = (value: string) =>
  value.replace(/\D/g, '').length >= 10;

const isValidNickname = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/[«»”]/.test(trimmed)) return false;
  return true;
};

describe('Profile Validation Rules', () => {
  it('validates emails correctly', () => {
    expect(isValidEmail('user@skillmap.ru')).toBe(true);
    expect(isValidEmail('test.dev@company.com')).toBe(true);
    expect(isValidEmail('plainaddress')).toBe(false);
    expect(isValidEmail('@missinguser.com')).toBe(false);
    expect(isValidEmail('user@.com')).toBe(false);
  });

  it('validates phone numbers with flexible formatting', () => {
    expect(isValidPhone('+7 (999) 123-45-67')).toBe(true);
    expect(isValidPhone('89991234567')).toBe(true);
    expect(isValidPhone('12345')).toBe(false);
  });

  it('validates nicknames and rejects forbidden quotation marks per specs', () => {
    expect(isValidNickname('Александр Скиллмапов')).toBe(true);
    expect(isValidNickname('   ')).toBe(false);
    expect(isValidNickname('Иван «Хакер»')).toBe(false);
    expect(isValidNickname('Пётр”')).toBe(false);
    expect(isValidNickname('»Сергей')).toBe(false);
  });
});
