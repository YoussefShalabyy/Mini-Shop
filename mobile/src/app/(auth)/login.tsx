import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { toast } from '@/store/toast.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const s = makeStyles(colors);

  const handleLogin = async () => {
    if (!email || !password) { toast.error(t('auth.errors.fillAll')); return; }
    setLoading(true);
    try {
      const { token, user } = await authApi.login(email.trim(), password);
      setSession(token, user);
      router.replace('/(tabs)');
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('auth.errors.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.inner} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.logoCircle}>
            <Ionicons name="bag-handle" size={38} color={colors.white} />
          </View>
          <Text style={s.title}>Mini Shop</Text>
          <Text style={s.subtitle}>{t('auth.signInToContinue')}</Text>
        </View>

        <View style={s.form}>
          <View style={s.inputGroup}>
            <Text style={s.label}>{t('auth.email')}</Text>
            <View style={s.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>{t('auth.password')}</Text>
            <View style={s.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={s.inputIcon} />
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={colors.textMuted}
                secureTextEntry
              />
            </View>
          </View>

          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={s.forgotBtn}>
              <Text style={s.forgotText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[s.loginBtn, loading && s.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={s.loginBtnText}>{t('auth.signIn')}</Text>}
          </TouchableOpacity>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>{t('auth.noAccount')} </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={s.footerLink}>{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    inner: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
    header: { alignItems: 'center', marginBottom: spacing.xxl },
    logoCircle: {
      width: 84, height: 84, borderRadius: 42,
      backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
      marginBottom: spacing.md,
      shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10,
    },
    title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
    subtitle: { ...typography.body, color: colors.textSecondary },
    form: { gap: spacing.md },
    inputGroup: { gap: spacing.xs },
    label: { ...typography.label, color: colors.textSecondary },
    inputWrapper: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.md,
      borderWidth: 1, borderColor: colors.border,
    },
    inputIcon: { paddingLeft: spacing.md },
    input: { flex: 1, padding: spacing.md, color: colors.text, ...typography.bodyLg },
    forgotBtn: { alignSelf: 'flex-end' },
    forgotText: { ...typography.label, color: colors.primary },
    loginBtn: {
      backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center',
      marginTop: spacing.sm, shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    btnDisabled: { opacity: 0.7 },
    loginBtnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
    footerText: { ...typography.body, color: colors.textSecondary },
    footerLink: { ...typography.body, color: colors.primary, fontWeight: '600' },
  });
}
