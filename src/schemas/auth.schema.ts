import { z } from 'zod';

/** Email — trimmed, lowercase, pattern-validated */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Email обовʼязковий.')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Вкажіть коректний email.');

/** Password — min 8 chars, requires mix of cases + digit/symbol */
export const passwordSchema = z
  .string()
  .min(8, 'Пароль має містити мінімум 8 символів.')
  .refine(
    (val) => {
      const hasUpper = /[A-ZА-ЯІЇЄ]/.test(val);
      const hasLower = /[a-zа-яіїє]/.test(val);
      const hasDigitOrSymbol = /[\d\W]/.test(val);
      return hasUpper && hasLower && hasDigitOrSymbol;
    },
    { message: 'Додайте великі/малі літери, цифру або символ.' }
  );

/** Name — min 2 chars */
export const nameSchema = z
  .string()
  .trim()
  .min(2, 'Вкажіть імʼя мінімум з 2 символів.');

/** PIN — exactly 4 digits */
export const pinSchema = z
  .string()
  .length(4, 'PIN має містити рівно 4 цифри.')
  .regex(/^\d{4}$/, 'PIN може містити тільки цифри.');

/** Recovery code — 6 digits */
export const recoveryCodeSchema = z
  .string()
  .trim()
  .length(6, 'Код має містити 6 цифр.')
  .regex(/^\d{6}$/, 'Код може містити тільки цифри.');

/** Registration form */
export const registrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export type RegistrationForm = z.infer<typeof registrationSchema>;

/** Login form */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Введіть пароль.'),
});
export type LoginForm = z.infer<typeof loginSchema>;

/** Profile update form */
export const profileUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});
export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

/** Password strength calculator */
export function getPasswordStrengthFromSchema(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-ZА-ЯІЇЄ]/.test(password) && /[a-zа-яіїє]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-zА-Яа-яІіЇїЄє0-9]/.test(password)) score += 1;

  const labels = [
    'Додайте мінімум 8 символів',
    'Слабкий пароль',
    'Нормальний пароль',
    'Сильний пароль',
  ] as const;

  return { label: labels[score], score: score as 0 | 1 | 2 | 3 };
}
