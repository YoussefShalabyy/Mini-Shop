import { Tabs, Redirect } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius } from '@/constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconName;
  focusedName: IoniconName;
  focused: boolean;
  badge?: number;
}

function TabIcon({ name, focusedName, focused, badge }: TabIconProps) {
  const { colors } = useTheme();
  return (
    <View>
      <Ionicons
        name={focused ? focusedName : name}
        size={24}
        color={focused ? colors.primary : colors.textMuted}
      />
      {badge != null && badge > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user, isHydrated } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginBottom: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t('tabs.shop'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="storefront-outline" focusedName="storefront" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarLabel: t('tabs.cart'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cart-outline" focusedName="cart" focused={focused} badge={itemCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: t('tabs.orders'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cube-outline" focusedName="cube" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" focusedName="person" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -8,
    borderRadius: radius.full, minWidth: 16, height: 16,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});
