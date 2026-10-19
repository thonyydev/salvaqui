import { useLocalSearchParams, useRouter } from "expo-router";
import { FolderOpen, Pencil, Trash2 } from "lucide-react-native";
import { Alert, StyleSheet, Text, View } from "react-native";

import { ActionButton, EmptyState } from "@/components/ui/primitives";
import { recentFirst } from "@/domain/format";
import { ItemList } from "@/features/items/item-list";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export default function CollectionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, removeCollection } = useVault();
  const collection = data.collections.find((entry) => entry.id === id);

  if (!collection)
    return (
      <EmptyState
        icon={FolderOpen}
        title="Coleção não encontrada"
        subtitle="Ela pode ter sido removida."
      />
    );

  const items = recentFirst(
    data.items.filter((item) => item.collectionId === id),
  );
  const confirmDelete = () =>
    Alert.alert(
      "Excluir coleção?",
      "Os itens serão mantidos, mas ficarão sem coleção.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            removeCollection(collection.id);
            router.back();
          },
        },
      ],
    );

  return (
    <View style={styles.page}>
      <View style={styles.heading}>
        <Text style={styles.title}>{collection.name}</Text>
        <Text style={styles.subtitle}>
          {items.length} {items.length === 1 ? "item" : "itens"} nesta coleção
        </Text>
        <View style={styles.actions}>
          <View style={styles.action}>
            <ActionButton
              title="Renomear"
              icon={Pencil}
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname: "/collection/new",
                  params: { id: collection.id },
                })
              }
            />
          </View>
          <View style={styles.action}>
            <ActionButton
              title="Excluir"
              icon={Trash2}
              variant="danger"
              onPress={confirmDelete}
            />
          </View>
        </View>
      </View>
      <ItemList
        items={items}
        emptyTitle="Coleção vazia"
        emptySubtitle="Ao criar ou editar um item, selecione esta coleção."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background.primary },
  heading: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, gap: 9 },
  title: { color: colors.text.primary, fontWeight: "800", fontSize: 27 },
  subtitle: { color: colors.text.secondary, fontSize: 13 },
  actions: { flexDirection: "row", gap: 10, marginTop: 10 },
  action: { flex: 1 },
});
