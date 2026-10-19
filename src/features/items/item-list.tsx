import { BookmarkX } from "lucide-react-native";
import type { ReactElement } from "react";
import { FlatList, StyleSheet } from "react-native";

import { EmptyState } from "@/components/ui/primitives";
import type { SavedItem } from "@/domain/models";
import { ItemCard } from "@/features/items/item-card";

export function ItemList({
  items,
  emptyTitle = "Nada por aqui ainda",
  emptySubtitle = "Seus links e notas vão aparecer aqui.",
  header,
}: {
  items: SavedItem[];
  emptyTitle?: string;
  emptySubtitle?: string;
  header?: ReactElement;
}) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ItemCard item={item} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyState
          icon={BookmarkX}
          title={emptyTitle}
          subtitle={emptySubtitle}
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
    gap: 11,
    flexGrow: 1,
  },
});
