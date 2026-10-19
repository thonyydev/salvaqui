import { Button } from "@/shared/components/base/button";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={style.view}>
      <Button>
        <Text>Hello World!</Text>
      </Button>
    </View>
  );
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
