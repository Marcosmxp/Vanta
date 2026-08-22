import { z } from 'zod';

const passwordRule = z
  .string()
  .min(10, 'Use pelo menos 10 caracteres.')
  .regex(/[a-z]/, 'Inclua uma letra minúscula.')
  .regex(/[A-Z]/, 'Inclua uma letra maiúscula.')
  .regex(/[0-9]/, 'Inclua um número.');

export const loginSchema = z.object({
  email: z.string().trim().email('Introduza um email válido.'),
  password: z.string().min(1, 'Introduza a sua palavra-passe.'),
});

export const createAccountSchema = z
  .object({
    email: z.string().trim().email('Introduza um email válido.'),
    password: passwordRule,
    confirmPassword: z.string(),
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
