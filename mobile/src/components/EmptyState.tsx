import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={colors.textMuted} style={styles.icon} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={onAction}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.sm },
  icon: { marginBottom: spacing.sm },
  title: { ...typography.h3, textAlign: 'center' },
  subtitle: { ...typography.body, textAlign: 'center' },
  btn: { marginTop: spacing.md, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  btnText: { ...typography.body, color: '#fff', fontWeight: '600' },
});
