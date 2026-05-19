import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Category } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { spacing, radius, typography } from '@/constants/theme';

interface Props {
  categories: Category[];
  selected?: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat) => {
          const isSelected = selected === cat.slug;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                { borderColor: colors.border, backgroundColor: colors.surface },
                isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => onSelect(cat.slug)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.chipText,
                { color: colors.textSecondary },
                isSelected && { color: colors.white, fontWeight: '600' },
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.full, borderWidth: 1,
  },
  chipText: { ...typography.label },
});
