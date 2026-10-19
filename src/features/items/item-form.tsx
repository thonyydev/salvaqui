import { Link2, StickyNote } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ActionButton,
  ChoiceChips,
  FormField,
} from "@/components/ui/primitives";
import { normalizeLink } from "@/domain/format";
import type { ItemInput, ItemKind, SavedItem } from "@/domain/models";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export function ItemForm({
  initial,
  onSubmit,
}: {
  initial?: SavedItem;
  onSubmit: (input: ItemInput) => void;
}) {
  const { data } = useVault();
  const [kind, setKind] = useState<ItemKind>(initial?.kind ?? "link");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [collectionId, setCollectionId] = useState(initial?.collectionId ?? "");
  const [validation, setValidation] = useState<string | null>(null);

  const collectionOptions = useMemo(
    () => [
      { id: "", label: "Sem coleção" },
      ...data.collections.map((collection) => ({
        id: collection.id,
        label: collection.name,
      })),
    ],
    [data.collections],
  );

  function save() {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanedUrl = kind === "link" ? normalizeLink(url) : "";
    if (!cleanTitle) {
      setValidation("Digite um título para continuar.");
      return;
    }
    if (kind === "link" && !cleanedUrl) {
      setValidation(
        "Digite uma URL válida, como exemplo.com ou https://exemplo.com.",
      );
      return;
    }
    if (kind === "note" && !cleanDescription) {
      setValidation("Escreva o conteúdo da nota.");
      return;
    }
    setValidation(null);
    onSubmit({
      kind,
      title: cleanTitle,
      description: cleanDescription,
      url: cleanedUrl || "",
      collectionId: collectionId || null,
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={92}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.caption}>O QUE VAMOS GUARDAR?</Text>
        <ChoiceChips
          options={[
            { id: "link", label: "🔗  Link" },
            { id: "note", label: "📝  Nota" },
          ]}
          value={kind}
          onChange={(id) => {
            if (initial) return;
            setKind(id as ItemKind);
            setValidation(null);
          }}
        />
        {initial ? (
          <Text style={styles.hint}>
            O tipo de um item existente não pode ser alterado.
          </Text>
        ) : null}
        <FormField
          label="Título *"
          value={title}
          onChangeText={setTitle}
          placeholder={
            kind === "link"
              ? "Ex.: Artigo interessante"
              : "Ex.: Ideia para o projeto"
          }
        />
        {kind === "link" ? (
          <FormField
            label="Endereço do link *"
            value={url}
            onChangeText={setUrl}
            placeholder="https://exemplo.com"
            keyboardType="url"
            autoCapitalize="none"
          />
        ) : null}
        <FormField
          label={kind === "link" ? "Descrição (opcional)" : "Sua nota *"}
          value={description}
          onChangeText={setDescription}
          placeholder={
            kind === "link"
              ? "Por que vale a pena guardar?"
              : "Escreva sua ideia aqui..."
          }
          multiline
        />
        <View style={styles.section}>
          <Text style={styles.caption}>COLEÇÃO</Text>
          <ChoiceChips
            options={collectionOptions}
            value={collectionId}
            onChange={setCollectionId}
          />
        </View>
        {validation ? (
          <Text accessibilityRole="alert" style={styles.validation}>
            {validation}
          </Text>
        ) : null}
        <ActionButton
          title={initial ? "Salvar alterações" : "Salvar no Salvaqui"}
          icon={kind === "link" ? Link2 : StickyNote}
          onPress={save}
        />
        <Text style={styles.bottomHint}>
          Seus dados ficam guardados neste dispositivo.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: 20, gap: 22, paddingBottom: 48 },
  caption: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: "800",
    color: colors.text.secondary,
  },
  section: { gap: 12 },
  validation: {
    backgroundColor: colors.status.errorBackground,
    color: colors.status.error,
    padding: 14,
    borderRadius: 12,
    fontSize: 13,
  },
  bottomHint: {
    color: colors.text.tertiary,
    fontSize: 12,
    textAlign: "center",
  },
  hint: { color: colors.text.tertiary, fontSize: 12, marginTop: -12 },
});
