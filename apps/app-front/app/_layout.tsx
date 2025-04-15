import { Stack } from "expo-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "../global.css";
import {
  Text,
} from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
    </QueryClientProvider>
  );
}
