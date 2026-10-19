import { Button } from "@/shared/components/base/button";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/style/colors";

export default function Index() {
  return (
    <View style={style.container}>
      <Button
        onPress={() => {
          console.log("Cliquei!");
        }}
      >
        <Text>Hello World!</Text>
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    gap: 8,
  },

  text: {
    color: colors.text.primary,
  },
});
