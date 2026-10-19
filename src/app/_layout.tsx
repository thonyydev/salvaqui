import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { VaultProvider, useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export const unstable_settings = { anchor: "(tabs)" };

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.brand.primary,
    background: colors.background.primary,
    card: colors.navigation.background,
    text: colors.text.primary,
    border: colors.border.default,
  },
};

function AppNavigation() {
  const { loading, loadFailed, error } = useVault();

  if (loading) {
    return (
      <View style={styles.status}>
        <ActivityIndicator
          color={colors.brand.primary}
          accessibilityLabel="Carregando seus itens"
        />
      </View>
    );
  }

  if (loadFailed) {
    return (
      <View style={styles.status}>
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navigation.background },
        headerTintColor: colors.text.primary,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="item/new"
        options={{ title: "Novo item", presentation: "modal" }}
      />
      <Stack.Screen name="item/[id]" options={{ title: "Editar item" }} />
      <Stack.Screen
        name="collection/new"
        options={{ title: "Coleção", presentation: "modal" }}
      />
      <Stack.Screen name="collection/[id]" options={{ title: "Coleção" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={theme}>
        <VaultProvider>
          <StatusBar style="light" />
          <AppNavigation />
        </VaultProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  status: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.primary,
    padding: 24,
  },
  error: { color: colors.status.error, textAlign: "center" },
});
