import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

const styling = StyleSheet.create({
  tabbar: {
    // Styling of the tab container
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: "continuous",
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  tabbaritems: {
    // Styling of the tab
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});

const TabBar = ({ state, descriptors, navigation }) => {
  const icons = (name, color) => {
    if (name === "index") {
      return <FontAwesome size={28} name="home" color={color} />;
    } else if (name === "users/[id]") {
      return <FontAwesome size={28} name="id-card" color={color} />;
    } else {
      //Nothing
    }
  };

  return (
    <View style={styling.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styling.tabbaritems}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons(route.name, { color: isFocused ? `#fcd503` : `#222` })}
            <Text style={{ color: isFocused ? `#fcd503` : `#222` }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
