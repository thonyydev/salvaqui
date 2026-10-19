import { useRouter } from "expo-router";
import { ExternalLink, Heart, StickyNote } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { linkDomain, relativeDate } from "@/domain/format";
import type { SavedItem } from "@/domain/models";
import { useVault } from "@/providers/vault-provider";
import { colors } from "@/style/colors";

export function ItemCard({ item }: { item: SavedItem }) {
  const router = useRouter();
  const { data, toggleFavorite } = useVault();
  const collection = data.collections.find(
    (entry) => entry.id === item.collectionId,
  );
  const isLink = item.kind === "link";
  const Icon = isLink ? ExternalLink : StickyNote;
  const accent = isLink ? colors.content.link : colors.content.note;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/item/[id]", params: { id: item.id } })
        }
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${item.title}`}
        style={({ pressed }) => [styles.content, pressed && { opacity: 0.75 }]}
      >
        <View style={[styles.icon, { backgroundColor: colors.brand.subtle }]}>
          <Icon size={21} color={accent} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {isLink
              ? linkDomain(item.url)
              : item.description || "Nota sem descrição"}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.tag}>
              {collection?.name ?? (isLink ? "Link" : "Nota")}
            </Text>
            <Text style={styles.date}>{relativeDate(item.createdAt)}</Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={() => toggleFavorite(item.id)}
        hitSlop={10}
        accessibilityLabel={
          item.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
        accessibilityRole="button"
        style={styles.favorite}
      >
        <Heart
          size={20}
          color={item.favorite ? colors.favorite : colors.icon.muted}
          fill={item.favorite ? colors.favorite : "transparent"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card.background,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.card.border,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 8,
  },
  content: { flex: 1, flexDirection: "row", gap: 12, alignItems: "flex-start" },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  info: { flex: 1, gap: 6 },
  title: { color: colors.text.primary, fontSize: 15, fontWeight: "700" },
  description: { color: colors.text.secondary, fontSize: 12, lineHeight: 17 },
  meta: { flexDirection: "row", alignItems: "center", gap: 9, marginTop: 2 },
  tag: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.brand.primary,
    maxWidth: 118,
  },
  date: { fontSize: 11, color: colors.text.tertiary },
  favorite: { padding: 8, marginTop: -5, marginRight: -5 },
});
