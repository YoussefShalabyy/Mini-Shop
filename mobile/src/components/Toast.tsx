import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore, ToastType } from '@/store/toast.store';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing, typography } from '@/constants/theme';

const ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error:   'close-circle',
  warning: 'warning',
  info:    'information-circle',
};

const BG_OPACITY = '22';

export function Toast() {
  const { visible, message, type, hide } = useToastStore();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const iconColor = {
    success: colors.success,
    error:   colors.error,
    warning: colors.warning,
    info:    colors.primary,
  }[type];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: visible ? 0 : -120, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity,    { toValue: visible ? 1 : 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + spacing.sm,
          backgroundColor: isDark ? colors.surface : colors.white,
          borderColor: colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Ionicons name={ICONS[type]} size={22} color={iconColor} />
      <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>{message}</Text>
      <TouchableOpacity onPress={hide} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: spacing.md, right: spacing.md, zIndex: 9999,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.lg, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 10,
  },
  message: { ...typography.body, flex: 1 },
});
