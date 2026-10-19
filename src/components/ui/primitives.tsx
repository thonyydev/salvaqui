import type { LucideIcon } from "lucide-react-native";
import { Plus } from "lucide-react-native";
import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ReacticxActionButton } from "@/components/ui/reacticx-action-button";
import { Button } from "@/shared/components/base/button";
import { colors } from "@/style/colors";

export const S = {
  page: 20,
  card: 16,
  gap: 12,
} as const;

export function Page({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView edges={["top"]} style={[styles.page, style]}>
      {children}
    </SafeAreaView>
  );
}

export function Heading({
  title,
  subtitle,
  onAdd,
}: {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
}) {
  return (
    <View style={styles.heading}>
      <View style={styles.headingText}>
        <Text style={styles.eyebrow}>SALVAQUI</Text>
        <Text style={styles.headingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {onAdd ? (
        <Button
          width={48}
          height={48}
          borderRadius={17}
          backgroundColor={colors.brand.primary}
          onPress={onAdd}
          accessibilityLabel="Adicionar novo item"
        >
          <Plus color={colors.text.onBrand} size={22} />
        </Button>
      ) : null}
    </View>
  );
}

export function ActionButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  icon: Icon,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <ReacticxActionButton
      title={title}
      onPress={onPress}
      icon={Icon}
      variant={variant}
      disabled={disabled}
    />
  );
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  autoCapitalize = "sentences",
  keyboardType = "default",
  autoFocus = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "url";
  autoFocus?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        selectionColor={colors.brand.primary}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        autoCorrect={keyboardType !== "url"}
        autoFocus={autoFocus}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Icon size={26} color={colors.brand.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {action}
    </View>
  );
}

export function ChoiceChips({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chips}
      keyboardShouldPersistTaps="handled"
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.chip, selected && styles.selectedChip]}
          >
            <Text
              style={[styles.chipText, selected && styles.selectedChipText]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background.primary },
  heading: {
    paddingHorizontal: S.page,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headingText: { flex: 1, gap: 4 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2.4,
    color: colors.brand.primary,
  },
  headingTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text.primary,
    letterSpacing: -0.9,
  },
  subtitle: { fontSize: 13, lineHeight: 20, color: colors.text.secondary },
  field: { gap: 9 },
  fieldLabel: { color: colors.text.secondary, fontSize: 13, fontWeight: "700" },
  input: {
    minHeight: 52,
    backgroundColor: colors.input.background,
    borderWidth: 1,
    borderColor: colors.input.border,
    color: colors.text.primary,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  multiline: { height: 146, paddingTop: 14 },
  empty: {
    flex: 1,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 12,
  },
  emptyIcon: {
    height: 62,
    width: 62,
    borderRadius: 22,
    backgroundColor: colors.brand.subtle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  emptySubtitle: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  chips: { gap: 9, paddingVertical: 2, paddingRight: S.page },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface.primary,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  chipText: { color: colors.text.secondary, fontWeight: "700", fontSize: 13 },
  selectedChipText: { color: colors.text.onBrand },
});
