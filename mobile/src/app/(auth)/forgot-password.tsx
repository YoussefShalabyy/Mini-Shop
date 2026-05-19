import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/api/auth.api';
import { toast } from '@/store/toast.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { toast.error(t('auth.errors.fillAll')); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      toast.success(t('auth.success.resetSent'));
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('auth.errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="chevron-back" size={22} color={colors.primary} />
        <Text style={s.backText}>{t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={s.title}>{t('auth.forgotPasswordTitle')}</Text>
      <Text style={s.subtitle}>{t('auth.forgotPasswordSubtitle')}</Text>

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
          />
        </View>
      </View>

      <TouchableOpacity
        style={[s.btn, loading && s.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={colors.white} />
          : <Text style={s.btnText}>{t('auth.sendResetLink')}</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, paddingTop: 80 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.xl },
    backText: { ...typography.body, color: colors.primary },
    title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm },
    subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
    inputGroup: { gap: spacing.xs, marginBottom: spacing.lg },
    label: { ...typography.label, color: colors.textSecondary },
    inputWrapper: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.md,
      borderWidth: 1, borderColor: colors.border,
    },
    inputIcon: { paddingLeft: spacing.md },
    input: { flex: 1, padding: spacing.md, color: colors.text, ...typography.bodyLg },
    btn: {
      backgroundColor: colors.primary, borderRadius: radius.md,
      padding: spacing.md, alignItems: 'center',
    },
    btnDisabled: { opacity: 0.7 },
    btnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
  });
}
