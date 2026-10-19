import { useLocalSearchParams, useRouter } from "expo-router";
import { ExternalLink, Trash2 } from "lucide-react-native";
import { Alert, Linking, StyleSheet, View } from "react-native";

import { ActionButton, EmptyState } from "@/components/ui/primitives";
import { ItemForm } from "@/features/items/item-form";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export default function EditItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, updateItem, removeItem } = useVault();
  const item = data.items.find((entry) => entry.id === id);

  if (!item)
    return (
      <EmptyState
        icon={Trash2}
        title="Item não encontrado"
        subtitle="Ele pode ter sido removido."
      />
    );

  const remove = () =>
    Alert.alert("Excluir item?", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          removeItem(item.id);
          router.back();
        },
      },
    ]);

  const openLink = async () => {
    try {
      await Linking.openURL(item.url);
    } catch {
      Alert.alert("Não foi possível abrir", "Confira o endereço do link.");
    }
  };

  return (
    <View style={styles.page}>
      {item.kind === "link" ? (
        <View style={styles.open}>
          <ActionButton
            title="Abrir link"
            icon={ExternalLink}
            variant="secondary"
            onPress={() => {
              void openLink();
            }}
          />
        </View>
      ) : null}
      <ItemForm
        key={item.id}
        initial={item}
        onSubmit={(input) => {
          updateItem(item.id, input);
          router.back();
        }}
      />
      <View style={styles.bottom}>
        <ActionButton
          title="Excluir item"
          variant="danger"
          icon={Trash2}
          onPress={remove}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background.primary },
  open: { paddingHorizontal: 20, paddingTop: 16 },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopColor: colors.border.subtle,
    borderTopWidth: 1,
  },
});
