import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/context/ThemeContext';

export default function Index() {
  const { colors } = useTheme();
  const { user, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)' : '/(auth)/login'} />;
}
