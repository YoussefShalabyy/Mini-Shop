import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '@/types';
import { useCartStore } from '@/store/cart.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

export function CartItemRow({ item }: { item: CartItem }) {
  const { colors } = useTheme();
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.imageBox, { backgroundColor: colors.surfaceLight }]}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <Ionicons name="cube-outline" size={28} color={colors.textMuted} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.price, { color: colors.accent }]}>${(product.price * quantity).toFixed(2)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: colors.surfaceLight }]}
          onPress={() => updateQuantity(product.id, quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.qty, { color: colors.text }]}>{quantity}</Text>
        <TouchableOpacity
          style={[styles.qtyBtn, { backgroundColor: colors.surfaceLight }]}
          onPress={() => updateQuantity(product.id, quantity + 1)}
        >
          <Ionicons name="add" size={16} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(product.id)}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1,
  },
  imageBox: {
    width: 60, height: 60, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  info: { flex: 1 },
  name: { ...typography.label, marginBottom: 4 },
  price: { ...typography.body, fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  qty: { ...typography.body, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  removeBtn: { marginLeft: spacing.xs, padding: 4 },
});
