import { createHash, randomBytes } from 'crypto';

export const generateEncryptionKey = (length: number = 32): string => {
  return randomBytes(length).toString('hex');
};

export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex');
};

export const generatePin = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const validatePin = (input: string): boolean => {
  return /^\d{6}$/.test(input);
};

export const calculatePinStrength = (pin: string): 'weak' | 'medium' | 'strong' => {
  if (pin.length !== 6) return 'weak';
  
  const hasRepeatingDigits = /(.).*\1/.test(pin);
  const hasSequentialDigits = /012|123|234|345|456|567|678|789/.test(pin);
  
  if (hasRepeatingDigits && hasSequentialDigits) return 'weak';
  if (hasRepeatingDigits || hasSequentialDigits) return 'medium';
  return 'strong';
};

export const encryptMessage = (message: string, key: string): string => {
  // Implementation would use a proper encryption library
  // This is just a placeholder for the interface
  return message;
};

export const decryptMessage = (encrypted: string, key: string): string => {
  // Implementation would use a proper encryption library
  // This is just a placeholder for the interface
  return encrypted;
};