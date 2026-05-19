import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useMyOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/OrderCard';
import { EmptyState } from '@/components/EmptyState';
import { useTheme } from '@/context/ThemeContext';
import { spacing, typography } from '@/constants/theme';

export default function OrdersScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data: orders, isLoading, refetch, isRefetching } = useMyOrders();
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Ionicons name="cube" size={26} color={colors.text} />
          <Text style={s.title}>{t('orders.title')}</Text>
        </View>
        <Text style={s.count}>{orders?.length ?? 0} {t('orders.orders')}</Text>
      </View>

      {isLoading ? (
        <View style={s.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={orders ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="file-tray-outline"
              title={t('orders.empty')}
              subtitle={t('orders.emptySubtitle')}
            />
          }
          renderItem={({ item }) => <OrderCard order={item} />}
        />
      )}
    </View>
  );
}

function makeStyles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: spacing.md,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    title: { ...typography.h1, color: colors.text },
    count: { ...typography.body, color: colors.textSecondary },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: spacing.lg, paddingBottom: spacing.xl },
  });
}
