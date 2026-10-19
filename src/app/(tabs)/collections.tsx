import { useRouter } from "expo-router";
import { ChevronRight, FolderOpen } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState, Heading, Page } from "@/components/ui/primitives";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export default function CollectionsScreen() {
  const router = useRouter();
  const { data } = useVault();
  return (
    <Page>
      <Heading
        title="Coleções."
        subtitle="Um lugar para cada coisa."
        onAdd={() => router.push("/collection/new")}
      />
      <FlatList
        data={data.collections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon={FolderOpen}
            title="Organize do seu jeito"
            subtitle="Crie uma coleção para agrupar links e notas por assunto."
          />
        }
        renderItem={({ item }) => {
          const count = data.items.filter(
            (entry) => entry.collectionId === item.id,
          ).length;
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/collection/[id]",
                  params: { id: item.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Abrir coleção ${item.name}`}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.7 },
              ]}
            >
              <View style={styles.icon}>
                <FolderOpen color={colors.content.collection} size={23} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.count}>
                  {count} {count === 1 ? "item salvo" : "itens salvos"}
                </Text>
              </View>
              <ChevronRight color={colors.icon.muted} size={21} />
            </Pressable>
          );
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 12, flexGrow: 1 },
  card: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.card.border,
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 16,
    backgroundColor: colors.brand.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 5 },
  name: { color: colors.text.primary, fontSize: 16, fontWeight: "800" },
  count: { color: colors.text.secondary, fontSize: 12 },
});
