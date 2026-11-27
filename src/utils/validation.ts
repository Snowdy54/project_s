export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPhone = (value: string): boolean =>
  value.replace(/\D/g, '').length >= 10;

export const hasForbiddenQuotes = (value: string): boolean =>
  /[«»”]/.test(value);

export const isValidNickname = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return !hasForbiddenQuotes(trimmed);
};
