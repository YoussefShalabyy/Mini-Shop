import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart.store';
import { toast } from '@/store/toast.store';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

interface Props {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem(product);
    toast.success(t('cart.addedToCart', { name: product.name }));
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceLight }]}>
            <Ionicons name="cube-outline" size={44} color={colors.textMuted} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.price, { color: colors.accent }]}>${product.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '44' }]}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={14} color={colors.primary} />
        <Text style={[styles.addBtnText, { color: colors.primary }]}>{t('product.addToCart')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: spacing.sm, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1 },
  imageContainer: { width: '100%', height: 140 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  info: { padding: spacing.sm, gap: 2 },
  name: { ...typography.label },
  price: { ...typography.body, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2,
    margin: spacing.sm, marginTop: 0, borderRadius: radius.sm,
    padding: spacing.xs + 2, borderWidth: 1,
  },
  addBtnText: { ...typography.caption, fontWeight: '700' },
});
