import { useRouter } from "expo-router";
import { Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ChoiceChips, Heading, Page } from "@/components/ui/primitives";
import { matchesSearch, recentFirst } from "@/domain/format";
import { ItemList } from "@/features/items/item-list";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

type Filter = "all" | "link" | "note";

export default function HomeScreen() {
  const router = useRouter();
  const { data, error, retrySave } = useVault();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const items = useMemo(
    () =>
      recentFirst(
        data.items.filter(
          (item) =>
            (filter === "all" || item.kind === filter) &&
            matchesSearch(item, search),
        ),
      ),
    [data.items, search, filter],
  );

  return (
    <Page>
      <Heading
        title="Seu espaço."
        subtitle="Tudo que importa, em um só lugar."
        onAdd={() => router.push("/item/new")}
      />
      {error ? (
        <Pressable
          onPress={retrySave}
          style={styles.error}
          accessibilityRole="button"
        >
          <Text style={styles.errorText}>
            {error} Toque para tentar novamente.
          </Text>
        </Pressable>
      ) : null}
      <View style={styles.search}>
        <Search size={19} color={colors.icon.secondary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar links e notas..."
          placeholderTextColor={colors.text.tertiary}
          style={styles.searchInput}
          accessibilityLabel="Pesquisar itens salvos"
          returnKeyType="search"
        />
        {search ? (
          <Pressable
            onPress={() => setSearch("")}
            hitSlop={10}
            accessibilityLabel="Limpar busca"
          >
            <X size={18} color={colors.icon.secondary} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.filters}>
        <ChoiceChips
          options={[
            { id: "all", label: "Todos" },
            { id: "link", label: "Links" },
            { id: "note", label: "Notas" },
          ]}
          value={filter}
          onChange={(value) => setFilter(value as Filter)}
        />
      </View>
      <ItemList
        items={items}
        header={
          <View style={styles.listHeading}>
            <Text style={styles.listTitle}>Salvos recentemente</Text>
            <Text style={styles.count}>
              {items.length} {items.length === 1 ? "item" : "itens"}
            </Text>
          </View>
        }
        emptyTitle={search ? "Nenhum resultado" : "Seu espaço começa aqui"}
        emptySubtitle={
          search
            ? "Tente outra palavra ou remova o filtro."
            : "Toque em + para salvar seu primeiro link ou nota."
        }
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.input.background,
    marginHorizontal: 20,
    height: 54,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    height: "100%",
  },
  filters: { marginTop: 14, marginBottom: 8, paddingLeft: 20 },
  listHeading: {
    paddingTop: 7,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: { fontSize: 16, fontWeight: "800", color: colors.text.primary },
  count: { color: colors.text.tertiary, fontSize: 12 },
  error: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.status.errorBackground,
  },
  errorText: { color: colors.status.error, fontSize: 12 },
});
