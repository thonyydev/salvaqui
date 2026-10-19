import { NativeTabs } from "expo-router/unstable-native-tabs";

import { colors } from "@/style/colors";

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={colors.brand.primary}
      iconColor={colors.text.secondary}
      labelStyle={{ color: colors.text.secondary }}
    >
      <NativeTabs.Trigger
        name="index"
        contentStyle={{ backgroundColor: colors.background.primary }}
      >
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} />
        <NativeTabs.Trigger.Label>Início</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="collections"
        contentStyle={{ backgroundColor: colors.background.primary }}
      >
        <NativeTabs.Trigger.Icon sf={{ default: "folder", selected: "folder.fill" }} />
        <NativeTabs.Trigger.Label>Coleções</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="favorites"
        contentStyle={{ backgroundColor: colors.background.primary }}
      >
        <NativeTabs.Trigger.Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <NativeTabs.Trigger.Label>Favoritos</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
