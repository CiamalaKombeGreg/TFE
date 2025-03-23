import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const Index = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Empty for now...</Text>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/users/[id]", params: { id: "1" } })
        }
      >
        <Text>Go to profil 1</Text>
      </Pressable>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/users/[id]", params: { id: "2" } })
        }
      >
        <Text>Go to profil 2</Text>
      </Pressable>
    </View>
  );
};

export default Index;
