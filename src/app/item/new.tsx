import { useRouter } from "expo-router";

import { ItemForm } from "@/features/items/item-form";
import { useVault } from "@/providers/vault-provider";

export default function NewItemScreen() {
  const router = useRouter();
  const { addItem } = useVault();
  return (
    <ItemForm
      onSubmit={(input) => {
        addItem(input);
        router.back();
      }}
    />
  );
}
