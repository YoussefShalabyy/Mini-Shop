import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cart.store';
import { usePlaceOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/auth.store';
import { CartItemRow } from '@/components/CartItemRow';
import { EmptyState } from '@/components/EmptyState';
import { toast } from '@/store/toast.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

export default function CartScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();
  const s = makeStyles(colors);

  const handleCheckout = async () => {
    if (!user) { router.push('/(auth)/login'); return; }
    if (items.length === 0) return;
    try {
      await placeOrder(items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })));
      clearCart();
      toast.success(t('cart.success'));
      setTimeout(() => router.push('/(tabs)/orders'), 800);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('cart.errors.failed'));
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Ionicons name="cart" size={26} color={colors.text} />
          <Text style={s.title}>{t('cart.title')}</Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={s.clearBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={s.clearText}>{t('cart.clear')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <EmptyState
            icon="cart-outline"
            title={t('cart.empty')}
            subtitle={t('cart.emptySubtitle')}
            actionLabel={t('cart.browseShop')}
            onAction={() => router.push('/(tabs)')}
          />
        }
        renderItem={({ item }) => <CartItemRow item={item} />}
      />

      {items.length > 0 && (
        <View style={s.footer}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>{t('cart.total')}</Text>
            <Text style={s.totalValue}>${total().toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[s.checkoutBtn, isPending && s.checkoutBtnDisabled]}
            onPress={handleCheckout}
            disabled={isPending}
          >
            <View style={s.checkoutInner}>
              <Ionicons name="bag-check-outline" size={20} color={colors.white} />
              <Text style={s.checkoutBtnText}>
                {isPending ? t('cart.placingOrder') : t('cart.placeOrder')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    clearText: { ...typography.body, color: colors.error },
    list: { padding: spacing.lg, paddingBottom: 200 },
    footer: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
      padding: spacing.lg, paddingBottom: spacing.xl,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
    totalLabel: { ...typography.h3, color: colors.textSecondary },
    totalValue: { ...typography.h2, color: colors.text },
    checkoutBtn: {
      backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center',
      shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    checkoutBtnDisabled: { opacity: 0.7 },
    checkoutInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    checkoutBtnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
  });
}
