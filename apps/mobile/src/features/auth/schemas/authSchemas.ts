import { z } from 'zod';

import type { AppTranslationKey } from '../../../core/i18n';

type Translate = (key: AppTranslationKey) => string;

function passwordRule(t: Translate) {
  return z
    .string()
    .min(12, t('auth.validation.passwordMin'))
    .max(128, t('auth.validation.passwordMax'))
    .regex(/[a-z]/, t('auth.validation.passwordLower'))
    .regex(/[A-Z]/, t('auth.validation.passwordUpper'))
    .regex(/[0-9]/, t('auth.validation.passwordNumber'));
}

export function createLoginSchema(t: Translate) {
  return z.object({
    email: z.string().trim().email(t('auth.validation.email')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  });
}

export function createAccountSchema(t: Translate) {
  return z
    .object({
      displayName: z.string().trim().min(2, t('auth.validation.displayNameMin')).max(50, t('auth.validation.displayNameMax')),
      countryCode: z.string().trim().regex(/^[A-Za-z]{2}$/, t('auth.validation.country')),
      email: z.string().trim().email(t('auth.validation.email')),
      password: passwordRule(t),
      confirmPassword: z.string(),
      termsAccepted: z.boolean().refine((value) => value, t('auth.validation.terms')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('auth.validation.passwordMatch'),
    });
}

export function createForgotPasswordSchema(t: Translate) {
  return z.object({ email: z.string().trim().email(t('auth.validation.email')) });
}

export function createVerificationSchema(t: Translate) {
  return z.object({ code: z.string().regex(/^\d{6}$/, t('auth.validation.code')) });
}

export function createResetPasswordSchema(t: Translate) {
  return z
    .object({ password: passwordRule(t), confirmPassword: z.string() })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('auth.validation.passwordMatch'),
    });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type CreateAccountFormValues = z.infer<ReturnType<typeof createAccountSchema>>;
export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type VerificationFormValues = z.infer<ReturnType<typeof createVerificationSchema>>;
export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;
