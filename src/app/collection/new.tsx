import { useLocalSearchParams, useRouter } from "expo-router";
import { FolderPlus } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ActionButton, FormField } from "@/components/ui/primitives";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export default function CollectionFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data, addCollection, renameCollection } = useVault();
  const existing = data.collections.find((entry) => entry.id === id);
  const [name, setName] = useState(existing?.name ?? "");
  const [error, setError] = useState("");

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) return setError("Digite um nome para a coleção.");
    if (
      data.collections.some(
        (collection) =>
          collection.name.toLowerCase() === trimmed.toLowerCase() &&
          collection.id !== id,
      )
    ) {
      return setError("Já existe uma coleção com esse nome.");
    }
    if (existing) renameCollection(existing.id, trimmed);
    else addCollection(trimmed);
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.heading}>
          {existing ? "Renomear coleção" : "Uma nova coleção."}
        </Text>
        <Text style={styles.description}>
          Organize suas ideias, pesquisas e referências por assunto.
        </Text>
        <FormField
          label="Nome da coleção"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setError("");
          }}
          placeholder="Ex.: Programação"
          autoFocus
        />
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <ActionButton
          title={existing ? "Salvar nome" : "Criar coleção"}
          icon={FolderPlus}
          onPress={submit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background.primary },
  content: { padding: 20, gap: 21 },
  heading: { fontSize: 26, fontWeight: "800", color: colors.text.primary },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 21,
    marginTop: -12,
  },
  error: {
    color: colors.status.error,
    backgroundColor: colors.status.errorBackground,
    padding: 12,
    borderRadius: 12,
  },
});
