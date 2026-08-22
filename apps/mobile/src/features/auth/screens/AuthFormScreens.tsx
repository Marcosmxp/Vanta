import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import type { AuthStackParamList } from '../../../app/navigation/types';
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

export function LoginScreen({ navigation }: LoginProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async () => {
    // Phase 05 validates presentation/input only. No credential is logged or persisted.
  });

  return (
    <AuthScreenLayout
      eyebrow="Acesso"
      title="Entrar"
      description="Utilize as credenciais da sua conta. A validação final da sessão pertence ao serviço de identidade do servidor."
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

      <IntegrationNotice>
        O serviço remoto de autenticação ainda não está ligado neste build. Nenhuma credencial introduzida é guardada localmente.
      </IntegrationNotice>
    </AuthScreenLayout>
  );
}

export function CreateAccountScreen({ navigation }: CreateAccountProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const submit = handleSubmit(async () => {
    navigation.navigate('Verification', { purpose: 'registration' });
  });

  return (
    <AuthScreenLayout
      eyebrow="Nova conta"
      title="Criar conta"
      description="Comece com email e palavra-passe. Identidade, idade e elegibilidade serão verificadas separadamente antes de dinheiro real."
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

      <Button label="Continuar" fullWidth loading={isSubmitting} onPress={submit} />
      <Text style={styles.legal}>
        A criação visual desta etapa não cria conta no servidor. O endpoint de identidade será a única fonte de verdade.
      </Text>
    </AuthScreenLayout>
  );
}

export function VerificationScreen({ route, navigation }: VerificationProps) {
  const { purpose } = route.params;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: '' },
  });

  const submit = handleSubmit(async () => {
    if (purpose === 'password-reset') {
      navigation.replace('ResetPassword');
      return;
    }

    navigation.replace('Login');
  });

  return (
    <AuthScreenLayout
      eyebrow="Verificação"
      title="Código de 6 dígitos"
      description="Introduza o código associado à operação. Códigos reais serão emitidos e validados exclusivamente pelo backend."
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
      <IntegrationNotice>
        Este build valida apenas o formato do código para revisão do fluxo; não existe OTP local nem código mestre no cliente.
      </IntegrationNotice>
    </AuthScreenLayout>
  );
}

export function ForgotPasswordScreen({ navigation }: ForgotPasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const submit = handleSubmit(async () => {
    navigation.navigate('Verification', { purpose: 'password-reset' });
  });

  return (
    <AuthScreenLayout
      eyebrow="Recuperação"
      title="Recuperar acesso"
      description="Indique o email da conta. A resposta do serviço deverá ser neutra para não revelar se uma conta existe."
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
    </AuthScreenLayout>
  );
}

export function ResetPasswordScreen({ navigation }: ResetPasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const submit = handleSubmit(async () => {
    navigation.popToTop();
    navigation.navigate('Login');
  });

  return (
    <AuthScreenLayout
      eyebrow="Segurança"
      title="Definir nova palavra-passe"
      description="A alteração real será confirmada no servidor e deverá invalidar sessões anteriores conforme a política de segurança."
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
      <View style={styles.securityRow}>
        <View style={styles.securityDot} />
        <Text style={styles.securityText}>Nenhuma palavra-passe é gravada em estado persistente nesta fase.</Text>
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
