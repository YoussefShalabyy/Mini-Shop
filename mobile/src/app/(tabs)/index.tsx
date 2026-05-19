import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { EmptyState } from '@/components/EmptyState';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

export default function ShopScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const { data: categories } = useCategories();
  const { data, isLoading, refetch, isRefetching } = useProducts({ search, category: selectedCategory, limit: 20 });

  const handleSearch = useCallback(() => setSearch(searchInput.trim()), [searchInput]);
  const s = makeStyles(colors);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{t('shop.title')}</Text>
          <Text style={s.subtitle}>{t('shop.subtitle')}</Text>
        </View>
        <Ionicons name="storefront" size={28} color={colors.primary} />
      </View>

      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={s.searchInput}
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            placeholder={t('shop.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchInput(''); setSearch(''); }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Ionicons name="search" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {categories && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={(slug) => setSelectedCategory(slug === selectedCategory ? undefined : slug)}
        />
      )}

      {isLoading ? (
        <View style={s.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={s.row}
          contentContainerStyle={s.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="file-tray-outline"
              title={t('shop.noProducts')}
              subtitle={t('shop.noProductsSubtitle')}
            />
          }
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => router.push(`/product/${item.id}`)} />
          )}
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
    greeting: { ...typography.h1, color: colors.text },
    subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
    searchRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
    searchBox: {
      flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      backgroundColor: colors.surface, borderRadius: radius.md,
      borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md,
    },
    searchInput: { flex: 1, paddingVertical: spacing.xs, color: colors.text, ...typography.body },
    searchBtn: {
      backgroundColor: colors.primary, borderRadius: radius.md,
      paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    grid: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    row: { justifyContent: 'space-between' },
  });
}
