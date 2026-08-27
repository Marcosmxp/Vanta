import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AuthStackParamList } from '../../../app/navigation/types';
import { ApiError } from '../../../core/api/ApiClient';
import { useI18n, type AppTranslationKey } from '../../../core/i18n';
import { useSession } from '../../../core/session/SessionProvider';
import { Button, Card, Input, darkTheme } from '../../../design-system';
import { AuthScreenLayout } from '../components/AuthScreenLayout';
import {
  createAccountSchema,
  createForgotPasswordSchema,
  createLoginSchema,
  createResetPasswordSchema,
  createVerificationSchema,
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
type Translate = (key: AppTranslationKey) => string;

function IntegrationNotice({ children }: { children: string }) {
  return <Card><Text style={styles.notice}>{children}</Text></Card>;
}

function readableAuthError(error: unknown, t: Translate): string {
  if (error instanceof ApiError) {
    if (error.code === 'invalid_credentials') return t('auth.error.invalidCredentials');
    if (error.code === 'rate_limited') return t('auth.error.rateLimited');
    if (error.code === 'account_conflict') return t('auth.error.accountConflict');
    if (error.code === 'api_not_configured') return t('auth.error.unavailable');
  }
  return t('auth.error.generic');
}

export function LoginScreen({ navigation }: LoginProps) {
  const { t } = useI18n();
  const { signIn } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => createLoginSchema(t), [t]);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await signIn({ email: values.email.trim(), password: values.password });
    } catch (error) {
      setSubmitError(readableAuthError(error, t));
    }
  });

  return (
    <AuthScreenLayout eyebrow={t('auth.login.eyebrow')} title={t('auth.login.title')} description={t('auth.login.description')}>
      <Controller control={control} name="email" render={({ field: { value, onChange, onBlur } }) => (
        <Input
          label={t('auth.email')}
          value={value}
          onChangeText={(text) => { setSubmitError(null); onChange(text); }}
          onBlur={onBlur}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          errorMessage={errors.email?.message}
        />
      )} />
      <Controller control={control} name="password" render={({ field: { value, onChange, onBlur } }) => (
        <Input
          label={t('auth.password')}
          value={value}
          onChangeText={(text) => { setSubmitError(null); onChange(text); }}
          onBlur={onBlur}
          secureTextEntry
          autoComplete="current-password"
          errorMessage={errors.password?.message}
        />
      )} />
      <Button label={t('auth.login.title')} fullWidth loading={isSubmitting} onPress={submit} />
      <Button label={t('auth.forgotPassword')} variant="ghost" fullWidth onPress={() => navigation.navigate('ForgotPassword')} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
    </AuthScreenLayout>
  );
}

export function CreateAccountScreen(_props: CreateAccountProps) {
  const { t } = useI18n();
  const { register } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => createAccountSchema(t), [t]);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: '', countryCode: '', email: '', password: '', confirmPassword: '', termsAccepted: false },
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
      setSubmitError(readableAuthError(error, t));
    }
  });

  return (
    <AuthScreenLayout eyebrow={t('auth.create.eyebrow')} title={t('auth.create.title')} description={t('auth.create.description')}>
      <Controller control={control} name="displayName" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.create.displayName')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} autoCorrect={false} errorMessage={errors.displayName?.message} />
      )} />
      <Controller control={control} name="countryCode" render={({ field: { value, onChange, onBlur } }) => (
        <Input
          label={t('auth.create.country')}
          value={value}
          onChangeText={(text) => { setSubmitError(null); onChange(text.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()); }}
          onBlur={onBlur}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={2}
          helperText={t('auth.create.countryHelper')}
          errorMessage={errors.countryCode?.message}
        />
      )} />
      <Controller control={control} name="email" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.email')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" errorMessage={errors.email?.message} />
      )} />
      <Controller control={control} name="password" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.password')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} secureTextEntry autoComplete="new-password" helperText={t('auth.create.passwordHelper')} errorMessage={errors.password?.message} />
      )} />
      <Controller control={control} name="confirmPassword" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.create.confirmPassword')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} secureTextEntry autoComplete="new-password" errorMessage={errors.confirmPassword?.message} />
      )} />
      <Controller control={control} name="termsAccepted" render={({ field: { value, onChange } }) => (
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: value }} onPress={() => onChange(!value)} style={styles.checkboxRow}>
          <View style={[styles.checkbox, value && styles.checkboxChecked]}>{value ? <Text style={styles.checkmark}>✓</Text> : null}</View>
          <Text style={styles.checkboxLabel}>{t('auth.create.terms')}</Text>
        </Pressable>
      )} />
      {errors.termsAccepted?.message ? <Text style={styles.errorText}>{errors.termsAccepted.message}</Text> : null}
      <Button label={t('auth.create.title')} fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
      <Text style={styles.legal}>{t('auth.create.note')}</Text>
    </AuthScreenLayout>
  );
}

export function VerificationScreen({ route }: VerificationProps) {
  const { t } = useI18n();
  const { purpose } = route.params;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => createVerificationSchema(t), [t]);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<VerificationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  });
  const submit = handleSubmit(async () => {
    setSubmitError(purpose === 'password-reset' ? t('auth.verify.passwordUnavailable') : t('auth.verify.unavailable'));
  });

  return (
    <AuthScreenLayout eyebrow={t('auth.verify.eyebrow')} title={t('auth.verify.title')} description={t('auth.verify.description')}>
      <Controller control={control} name="code" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.verify.code')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text.replace(/\D/g, '').slice(0, 6)); }} onBlur={onBlur} keyboardType="number-pad" autoComplete="one-time-code" maxLength={6} errorMessage={errors.code?.message} />
      )} />
      <Button label={t('auth.verify.action')} fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
    </AuthScreenLayout>
  );
}

export function ForgotPasswordScreen(_props: ForgotPasswordProps) {
  const { t } = useI18n();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });
  const submit = handleSubmit(async () => setSubmitError(t('auth.forgot.unavailable')));

  return (
    <AuthScreenLayout eyebrow={t('auth.forgot.eyebrow')} title={t('auth.forgot.title')} description={t('auth.forgot.description')}>
      <Controller control={control} name="email" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.email')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" errorMessage={errors.email?.message} />
      )} />
      <Button label={t('auth.onboarding.continue')} fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
    </AuthScreenLayout>
  );
}

export function ResetPasswordScreen(_props: ResetPasswordProps) {
  const { t } = useI18n();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(() => createResetPasswordSchema(t), [t]);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const submit = handleSubmit(async () => setSubmitError(t('auth.reset.unavailable')));

  return (
    <AuthScreenLayout eyebrow={t('auth.reset.eyebrow')} title={t('auth.reset.title')} description={t('auth.reset.description')}>
      <Controller control={control} name="password" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.reset.newPassword')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} secureTextEntry autoComplete="new-password" helperText={t('auth.create.passwordHelper')} errorMessage={errors.password?.message} />
      )} />
      <Controller control={control} name="confirmPassword" render={({ field: { value, onChange, onBlur } }) => (
        <Input label={t('auth.reset.confirmPassword')} value={value} onChangeText={(text) => { setSubmitError(null); onChange(text); }} onBlur={onBlur} secureTextEntry autoComplete="new-password" errorMessage={errors.confirmPassword?.message} />
      )} />
      <Button label={t('auth.reset.action')} fullWidth loading={isSubmitting} onPress={submit} />
      {submitError ? <IntegrationNotice>{submitError}</IntegrationNotice> : null}
      <View style={styles.securityRow}><View style={styles.securityDot} /><Text style={styles.securityText}>{t('auth.reset.note')}</Text></View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  notice: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  legal: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: darkTheme.spacing.md },
  checkbox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: darkTheme.radius.sm, borderWidth: 1, borderColor: darkTheme.colors.border.strong, backgroundColor: darkTheme.colors.surface.raised },
  checkboxChecked: { borderColor: darkTheme.colors.brand.primary, backgroundColor: darkTheme.colors.brand.primary },
  checkmark: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.onBrand },
  checkboxLabel: { flex: 1, ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  errorText: { ...darkTheme.typography.caption, color: darkTheme.colors.status.danger },
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: darkTheme.spacing.sm },
  securityDot: { width: 8, height: 8, borderRadius: darkTheme.radius.full, backgroundColor: darkTheme.colors.status.success },
  securityText: { flex: 1, ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
});
