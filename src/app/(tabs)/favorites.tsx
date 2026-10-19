import { useRouter } from "expo-router";

import { Heading, Page } from "@/components/ui/primitives";
import { recentFirst } from "@/domain/format";
import { ItemList } from "@/features/items/item-list";
import { useVault } from "@/providers/vault-provider";

export default function FavoritesScreen() {
  const router = useRouter();
  const { data } = useVault();
  const favorites = recentFirst(data.items.filter((item) => item.favorite));
  return (
    <Page>
      <Heading
        title="Favoritos."
        subtitle={`${favorites.length} itens especiais, sempre à mão.`}
        onAdd={() => router.push("/item/new")}
      />
      <ItemList
        items={favorites}
        emptyTitle="Nenhum favorito ainda"
        emptySubtitle="Toque no coração de um item para encontrá-lo aqui."
      />
    </Page>
  );
}
