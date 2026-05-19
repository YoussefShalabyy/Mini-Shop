import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Order, OrderStatus } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

const STATUS_ICONS: Record<OrderStatus, IoniconName> = {
  pending:    'time-outline',
  processing: 'settings-outline',
  shipped:    'car-outline',
  delivered:  'checkmark-circle',
  cancelled:  'close-circle-outline',
};

export function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const statusColors: Record<OrderStatus, string> = {
    pending:    colors.warning,
    processing: colors.info,
    shipped:    colors.primary,
    delivered:  colors.success,
    cancelled:  colors.error,
  };

  const statusColor = statusColors[order.status] ?? colors.textMuted;
  const statusIcon = STATUS_ICONS[order.status] ?? 'cube-outline';

  const date = new Date(order.created_at).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
  const itemCount = order.order_items?.length ?? 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.top}>
        <View>
          <Text style={[styles.orderId, { color: colors.text }]}>#{order.id.slice(0, 8).toUpperCase()}</Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, { borderColor: statusColor + '55', backgroundColor: statusColor + '15' }]}>
          <Ionicons name={statusIcon} size={13} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {t(`orders.status.${order.status}`)}
          </Text>
        </View>
      </View>

      {order.order_items && order.order_items.length > 0 && (
        <View style={styles.items}>
          {order.order_items.slice(0, 2).map((item) => (
            <Text key={item.id} style={[styles.itemText, { color: colors.textSecondary }]} numberOfLines={1}>
              · {item.products?.name ?? 'Product'} × {item.quantity}
            </Text>
          ))}
          {order.order_items.length > 2 && (
            <Text style={[styles.moreText, { color: colors.textMuted }]}>
              {t('orders.moreItems', { count: order.order_items.length - 2 })}
            </Text>
          )}
        </View>
      )}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.itemCount, { color: colors.textMuted }]}>
          {t(itemCount === 1 ? 'orders.items' : 'orders.items_other', { count: itemCount })}
        </Text>
        <Text style={[styles.total, { color: colors.text }]}>${order.total_amount.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  orderId: { ...typography.label, fontWeight: '700' },
  date: { ...typography.caption, marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: radius.full, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 4,
  },
  statusText: { ...typography.caption, fontWeight: '600', textTransform: 'capitalize' },
  items: { gap: 4, marginBottom: spacing.sm },
  itemText: { ...typography.caption },
  moreText: { ...typography.caption, fontStyle: 'italic' },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: spacing.sm, borderTopWidth: 1,
  },
  itemCount: { ...typography.caption },
  total: { ...typography.h3 },
});
