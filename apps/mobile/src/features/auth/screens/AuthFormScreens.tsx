import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AuthStackParamList } from '../../../app/navigation/types';
import { ApiError } from '../../../core/api/ApiClient';
import { useSession } from '../../../core/session/SessionProvider';
import { Button, Card, Input, darkTheme } from '../../../design-system';
import { AuthScreenLayout } from '../components/AuthScreenLayout';
import {
  createAccountSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  verificationSchema,
  type CreateAccountFormValues,
  type ForgotPasswordFormValues,
  type LoginFormValues,
  type ResetPasswordFormValues,
  type VerificationFormValues,
} from '../schemas/authSchemas';

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type CreateAccountProps = NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>;
type VerificationProps = NativeStackScreenProps<AuthStackParamList, 'Verification'>;
type ForgotPasswordProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;
type ResetPasswordProps = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

function IntegrationNotice({ children }: { children: string }) {
  return (
    <Card>
      <Text style={styles.notice}>{children}</Text>
    </Card>
  );
}

function readableAuthError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') {
      return 'Email ou palavra-passe inválidos.';
    }
    if (error.code === 'rate_limited') {
      return 'Foram efetuadas demasiadas tentativas. Aguarde antes de tentar novamente.';
    }
    if (error.code === 'account_conflict') {
      return 'Já existe uma conta associada a estas credenciais.';
    }
    if (error.code === 'api_not_configured') {
      return 'A API Vanta não está configurada neste build.';
    }
    return error.message;
  }
  return 'Não foi possível concluir a operação de autenticação.';
}

export function LoginScreen({ navigation }: LoginProps) {
  const { signIn } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await signIn({ email: values.email.trim(), password: values.password });
    } catch (error) {
      setSubmitError(readableAuthError(error));
    }
  });

  return (
    <AuthScreenLayout
      eyebrow="Acesso"
      title="Entrar"
      description="A sessão é validada pelo serviço de identidade Vanta e os tokens são guardados apenas no armazenamento seguro do dispositivo."
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            errorMessage={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Palavra-passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="current-password"
            errorMessage={errors.password?.message}
          />
        )}
      />

      <Button label="Entrar" fullWidth loading={isSubmitting} onPress={submit} />
      <Button
        label="Esqueci a palavra-passe"
        variant="ghost"
        fullWidth
        onPress={() => navigation.navigate('ForgotPassword')}
      />

      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
    </AuthScreenLayout>
  );
}

export function CreateAccountScreen(_props: CreateAccountProps) {
  const { register } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      displayName: '',
      countryCode: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await register({
        email: values.email.trim(),
        password: values.password,
        displayName: values.displayName.trim(),
        countryCode: values.countryCode.trim().toUpperCase(),
        termsAccepted: values.termsAccepted,
      });
    } catch (error) {
      setSubmitError(readableAuthError(error));
    }
  });

  return (
    <AuthScreenLayout
      eyebrow="Nova conta"
      title="Criar conta"
      description="Crie a identidade base da conta. KYC, idade e elegibilidade continuam separados e obrigatórios antes de operações reguladas."
    >
      <Controller
        control={control}
        name="displayName"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nome de apresentação"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCorrect={false}
            errorMessage={errors.displayName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="countryCode"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="País (ISO)"
            value={value}
            onChangeText={(text) => onChange(text.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase())}
            onBlur={onBlur}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={2}
            helperText="Exemplo de formato: PT"
            errorMessage={errors.countryCode?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            errorMessage={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Palavra-passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            helperText="Mínimo de 10 caracteres, maiúscula, minúscula e número."
            errorMessage={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Confirmar palavra-passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            errorMessage={errors.confirmPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="termsAccepted"
        render={({ field: { value, onChange } }) => (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value }}
            onPress={() => onChange(!value)}
            style={styles.checkboxRow}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.checkboxLabel}>Li e aceito os termos aplicáveis à criação da conta.</Text>
          </Pressable>
        )}
      />
      {errors.termsAccepted?.message ? <Text style={styles.errorText}>{errors.termsAccepted.message}</Text> : null}

      <Button label="Criar conta" fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
      <Text style={styles.legal}>
        A criação da conta não autoriza apostas, depósitos ou levantamentos. Essas operações continuam dependentes das verificações server-side aplicáveis.
      </Text>
    </AuthScreenLayout>
  );
}

export function VerificationScreen({ route }: VerificationProps) {
  const { purpose } = route.params;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: '' },
  });

  const submit = handleSubmit(async () => {
    setSubmitError(
      purpose === 'password-reset'
        ? 'A API de recuperação de palavra-passe ainda não está disponível.'
        : 'A API de verificação por código ainda não está disponível.',
    );
  });

  return (
    <AuthScreenLayout
      eyebrow="Verificação"
      title="Código de 6 dígitos"
      description="Códigos só podem ser emitidos e validados pelo backend. Este build não possui OTP local nem código mestre."
    >
      <Controller
        control={control}
        name="code"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Código"
            value={value}
            onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 6))}
            onBlur={onBlur}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            maxLength={6}
            errorMessage={errors.code?.message}
          />
        )}
      />
      <Button label="Verificar" fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
    </AuthScreenLayout>
  );
}

export function ForgotPasswordScreen(_props: ForgotPasswordProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const submit = handleSubmit(async () => {
    setSubmitError('A recuperação remota ainda não foi exposta pela API Vanta; nenhum pedido foi enviado.');
  });

  return (
    <AuthScreenLayout
      eyebrow="Recuperação"
      title="Recuperar acesso"
      description="A recuperação será ativada quando existir um endpoint neutro que não revele se uma conta existe."
    >
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            errorMessage={errors.email?.message}
          />
        )}
      />
      <Button label="Continuar" fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
    </AuthScreenLayout>
  );
}

export function ResetPasswordScreen(_props: ResetPasswordProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const submit = handleSubmit(async () => {
    setSubmitError('A alteração de palavra-passe permanece bloqueada até existir confirmação server-side do fluxo de recuperação.');
  });

  return (
    <AuthScreenLayout
      eyebrow="Segurança"
      title="Definir nova palavra-passe"
      description="A alteração real deverá ser confirmada no servidor e invalidar sessões anteriores segundo a política de segurança."
    >
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nova palavra-passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            errorMessage={errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Confirmar nova palavra-passe"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="new-password"
            errorMessage={errors.confirmPassword?.message}
          />
        )}
      />
      <Button label="Guardar nova palavra-passe" fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
      <View style={styles.securityRow}>
        <View style={styles.securityDot} />
        <Text style={styles.securityText}>A palavra-passe nunca é persistida pelo cliente Vanta.</Text>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  notice: {
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  legal: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: darkTheme.radius.sm,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.strong,
    backgroundColor: darkTheme.colors.surface.raised,
  },
  checkboxChecked: {
    borderColor: darkTheme.colors.brand.primary,
    backgroundColor: darkTheme.colors.brand.primary,
  },
  checkmark: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  checkboxLabel: {
    flex: 1,
    ...darkTheme.typography.bodyMedium,
    color: darkTheme.colors.text.secondary,
  },
  errorText: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.status.danger,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.sm,
  },
  securityDot: {
    width: 8,
    height: 8,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.status.success,
  },
  securityText: {
    flex: 1,
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
});
