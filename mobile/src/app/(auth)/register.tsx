import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/api/auth.api';
import { toast } from '@/store/toast.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const s = makeStyles(colors);

  const handleRegister = async () => {
    if (!name || !email || !password) { toast.error(t('auth.errors.fillAll')); return; }
    if (password.length < 8) { toast.error(t('auth.errors.passwordLength')); return; }
    setLoading(true);
    try {
      await authApi.register(name.trim(), email.trim(), password);
      toast.success(t('auth.success.accountCreated'));
      setTimeout(() => router.replace('/(auth)/login'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? t('auth.errors.registrationFailed');
      toast.error(msg.includes('rate limit') ? t('auth.errors.rateLimit') : msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: t('auth.fullName'),  value: name,     setter: setName,     icon: 'person-outline' as const,      keyboardType: 'default',       secure: false },
    { label: t('auth.email'),     value: email,    setter: setEmail,    icon: 'mail-outline' as const,        keyboardType: 'email-address', secure: false },
    { label: t('auth.password'),  value: password, setter: setPassword, icon: 'lock-closed-outline' as const, keyboardType: 'default',       secure: true  },
  ];

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.inner} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
            <Text style={s.backText}>{t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={s.title}>{t('auth.createAccount')}</Text>
          <Text style={s.subtitle}>{t('auth.joinToday')}</Text>
        </View>

        <View style={s.form}>
          {fields.map(({ label, value, setter, icon, keyboardType, secure }) => (
            <View key={label} style={s.inputGroup}>
              <Text style={s.label}>{label}</Text>
              <View style={s.inputWrapper}>
                <Ionicons name={icon} size={18} color={colors.textMuted} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  value={value}
                  onChangeText={setter}
                  placeholder={label}
                  placeholderTextColor={colors.textMuted}
                  keyboardType={keyboardType as any}
                  autoCapitalize={keyboardType === 'email-address' ? 'none' : label === t('auth.fullName') ? 'words' : 'none'}
                  secureTextEntry={secure}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={s.btnText}>{t('auth.createAccount')}</Text>}
          </TouchableOpacity>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>{t('auth.haveAccount')} </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={s.footerLink}>{t('auth.signIn')}</Text>
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
    header: { marginBottom: spacing.xl },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: 4 },
    backText: { ...typography.body, color: colors.primary },
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
    btn: {
      backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md,
      alignItems: 'center', marginTop: spacing.sm,
      shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    btnDisabled: { opacity: 0.7 },
    btnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
    footerText: { ...typography.body, color: colors.textSecondary },
    footerLink: { ...typography.body, color: colors.primary, fontWeight: '600' },
  });
}
