import type { LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/shared/components/base/button";
import { colors } from "@/style/colors";

type Variant = "primary" | "secondary" | "danger";

/**
 * Application adapter for the local Reacticx Button.
 *
 * The Reacticx Button expects a numeric width. Measuring our wrapper lets us
 * use it in full-width forms and in smaller side-by-side collection actions.
 */
export function ReacticxActionButton({
  title,
  onPress,
  icon: Icon,
  variant = "primary",
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: Variant;
  disabled?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const primary = variant === "primary";
  const danger = variant === "danger";
  const foreground = primary
    ? colors.text.onBrand
    : danger
      ? colors.status.error
      : colors.text.primary;
  const background = primary ? colors.brand.primary : colors.button.secondary;

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const nextWidth = Math.round(event.nativeEvent.layout.width);
        setWidth((previousWidth) =>
          previousWidth === nextWidth ? previousWidth : nextWidth,
        );
      }}
    >
      {width > 0 ? (
        <Button
          width={width}
          height={50}
          borderRadius={15}
          backgroundColor={background}
          loadingBackgroundColor={background}
          withPressAnimation
          disabled={disabled}
          onPress={onPress}
          accessibilityLabel={title}
          style={
            !primary
              ? {
                  borderWidth: 1,
                  borderColor: danger
                    ? colors.status.error
                    : colors.border.default,
                }
              : undefined
          }
        >
          <View style={styles.content}>
            {Icon ? <Icon size={18} color={foreground} /> : null}
            <Text style={[styles.label, { color: foreground }]}>{title}</Text>
          </View>
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 50,
  },
  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
});
