import { Stack } from "expo-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "../global.css";
import {
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
