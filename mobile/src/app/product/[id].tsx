import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart.store';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/store/toast.store';
import { spacing, radius, typography } from '@/constants/theme';

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const s = makeStyles(colors);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    toast.success(t('cart.addedToCart', { name: product.name }));
  };

  if (isLoading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={s.centered}>
        <Ionicons name="alert-circle-outline" size={56} color={colors.textMuted} />
        <Text style={s.notFound}>{t('product.notFound')}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.backLink}>{t('product.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={s.imageContainer}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={s.image} />
          ) : (
            <View style={s.imagePlaceholder}>
              <Ionicons name="cube-outline" size={80} color={colors.textMuted} />
            </View>
          )}
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={s.info}>
          {product.categories && (
            <View style={s.categoryBadge}>
              <Text style={s.categoryText}>{product.categories.name}</Text>
            </View>
          )}
          <Text style={s.name}>{product.name}</Text>
          <Text style={s.price}>${product.price.toFixed(2)}</Text>
          {product.description && (
            <>
              <Text style={s.descLabel}>{t('product.description')}</Text>
              <Text style={s.desc}>{product.description}</Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={s.footer}>
        <View style={s.priceRow}>
          <Text style={s.footerLabel}>{t('product.price')}</Text>
          <Text style={s.footerPrice}>${product.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={handleAddToCart} activeOpacity={0.85}>
          <Ionicons name="cart-outline" size={20} color={colors.white} />
          <Text style={s.addBtnText}>{t('product.addToCart')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
    notFound: { ...typography.h3, color: colors.textSecondary },
    backLink: { ...typography.body, color: colors.primary },
    imageContainer: { position: 'relative' },
    image: { width: '100%', height: 320, resizeMode: 'cover' },
    imagePlaceholder: {
      width: '100%', height: 320,
      backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
    },
    backBtn: {
      position: 'absolute', top: 48, left: spacing.lg,
      width: 40, height: 40, borderRadius: 20,
      backgroundColor: colors.background + 'CC',
      justifyContent: 'center', alignItems: 'center',
    },
    info: { padding: spacing.lg, gap: spacing.sm },
    categoryBadge: {
      backgroundColor: colors.primaryLight + '33', borderRadius: radius.full,
      paddingHorizontal: spacing.md, paddingVertical: spacing.xs, alignSelf: 'flex-start',
    },
    categoryText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
    name: { ...typography.h1, color: colors.text },
    price: { ...typography.h2, color: colors.accent, fontWeight: '700' },
    descLabel: { ...typography.label, color: colors.textSecondary, marginTop: spacing.sm },
    desc: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
    footer: {
      backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
      padding: spacing.lg, paddingBottom: spacing.xl,
      flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
    },
    priceRow: { flex: 1 },
    footerLabel: { ...typography.caption, color: colors.textSecondary },
    footerPrice: { ...typography.h2, color: colors.text },
    addBtn: {
      flex: 2, backgroundColor: colors.primary, borderRadius: radius.md,
      padding: spacing.md, alignItems: 'center', flexDirection: 'row',
      justifyContent: 'center', gap: spacing.sm,
      shadowColor: colors.primary, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    addBtnText: { ...typography.bodyLg, color: colors.white, fontWeight: '700' },
  });
}
