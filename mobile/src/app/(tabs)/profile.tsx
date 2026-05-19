import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore, ThemeMode } from '@/store/theme.store';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/store/toast.store';
import { changeLanguage, SUPPORTED_LOCALES, SupportedLocale } from '@/i18n';
import { spacing, radius, typography } from '@/constants/theme';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { user, clearSession } = useAuthStore();
  const { mode, setMode } = useThemeStore();

  const handleLogout = () => {
    toast.info(t('profile.signedOut'));
    clearSession();
    router.replace('/(auth)/login');
  };

  const initial = user?.name?.[0]?.toUpperCase() ?? '?';
  const currentLang = i18n.language as SupportedLocale;

  const menuItems = [
    { icon: 'cube-outline' as const,  label: t('profile.myOrders'), onPress: () => router.push('/(tabs)/orders') },
    { icon: 'cart-outline' as const,  label: t('profile.cart'),     onPress: () => router.push('/(tabs)/cart')   },
  ];

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'dark',   label: t('profile.dark'),   icon: 'moon-outline'      },
    { mode: 'light',  label: t('profile.light'),  icon: 'sunny-outline'     },
    { mode: 'system', label: t('profile.system'), icon: 'contrast-outline'  },
  ];

  const s = makeStyles(colors);

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Ionicons name="person" size={26} color={colors.text} />
        <Text style={s.title}>{t('profile.title')}</Text>
      </View>

      {/* Avatar Card */}
      <View style={s.card}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initial}</Text>
        </View>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <View style={s.roleBadge}>
          <Ionicons
            name={user?.role === 'admin' ? 'shield-checkmark-outline' : 'person-circle-outline'}
            size={14} color={colors.primary}
          />
          <Text style={s.roleText}>
            {user?.role === 'admin' ? t('profile.admin') : t('profile.customer')}
          </Text>
        </View>
      </View>

      {/* Nav Menu */}
      <View style={s.section}>
        {menuItems.map(({ icon, label, onPress }) => (
          <TouchableOpacity key={label} style={s.menuItem} onPress={onPress}>
            <Ionicons name={icon} size={20} color={colors.primary} />
            <Text style={s.menuLabel}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Theme Picker */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('profile.theme')}</Text>
        <View style={s.optionRow}>
          {themeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.mode}
              style={[s.optionChip, mode === opt.mode && s.optionChipSelected]}
              onPress={() => setMode(opt.mode)}
            >
              <Ionicons name={opt.icon} size={16} color={mode === opt.mode ? colors.primary : colors.textMuted} />
              <Text style={[s.optionText, mode === opt.mode && s.optionTextSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Language Picker */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>{t('profile.language')}</Text>
        <View style={s.optionRow}>
          {SUPPORTED_LOCALES.map((loc) => (
            <TouchableOpacity
              key={loc.code}
              style={[s.optionChip, currentLang === loc.code && s.optionChipSelected]}
              onPress={() => changeLanguage(loc.code)}
            >
              <Text style={[s.optionText, currentLang === loc.code && s.optionTextSelected]}>
                {loc.nativeLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={s.logoutText}>{t('profile.signOut')}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Dynamic styles using theme colors
function makeStyles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md,
    },
    title: { ...typography.h1, color: colors.text },
    card: {
      marginHorizontal: spacing.lg, backgroundColor: colors.surface,
      borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center',
      borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg,
    },
    avatar: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
      marginBottom: spacing.md,
      shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    },
    avatarText: { fontSize: 32, color: colors.white, fontWeight: '700' },
    name: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
    email: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
    roleBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: colors.primary + '22', paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs, borderRadius: radius.full,
    },
    roleText: { ...typography.label, color: colors.primary },
    section: { marginHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.lg },
    sectionTitle: { ...typography.label, color: colors.textSecondary, marginBottom: 4 },
    menuItem: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: radius.md,
      padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.md,
    },
    menuLabel: { ...typography.bodyLg, color: colors.text, flex: 1 },
    optionRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    optionChip: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
      borderRadius: radius.full, borderWidth: 1,
      borderColor: colors.border, backgroundColor: colors.surface,
    },
    optionChipSelected: {
      borderColor: colors.primary, backgroundColor: colors.primary + '15',
    },
    optionText: { ...typography.label, color: colors.textSecondary },
    optionTextSelected: { color: colors.primary, fontWeight: '600' },
    logoutBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: spacing.sm, marginHorizontal: spacing.lg,
      backgroundColor: colors.surface, borderRadius: radius.md,
      padding: spacing.md, borderWidth: 1, borderColor: colors.error + '55',
    },
    logoutText: { ...typography.bodyLg, color: colors.error, fontWeight: '600' },
  });
}
