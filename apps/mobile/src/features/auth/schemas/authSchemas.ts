import { z } from 'zod';

const passwordRule = z
  .string()
  .min(12, 'Use pelo menos 12 caracteres.')
  .max(128, 'Use no máximo 128 caracteres.')
  .regex(/[a-z]/, 'Inclua uma letra minúscula.')
  .regex(/[A-Z]/, 'Inclua uma letra maiúscula.')
  .regex(/[0-9]/, 'Inclua um número.');

export const loginSchema = z.object({
  email: z.string().trim().email('Introduza um email válido.'),
  password: z.string().min(1, 'Introduza a sua palavra-passe.'),
});

export const createAccountSchema = z
  .object({
    displayName: z.string().trim().min(2, 'Introduza pelo menos 2 caracteres.').max(50, 'Use no máximo 50 caracteres.'),
    countryCode: z.string().trim().regex(/^[A-Za-z]{2}$/, 'Use um código de país ISO com 2 letras.'),
    email: z.string().trim().email('Introduza um email válido.'),
    password: passwordRule,
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((value) => value, 'Tem de aceitar os termos para criar a conta.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As palavras-passe não coincidem.',
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Introduza um email válido.'),
});

export const verificationSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Introduza o código de 6 dígitos.'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As palavras-passe não coincidem.',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerificationFormValues = z.infer<typeof verificationSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
