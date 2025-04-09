import { Stack } from "expo-router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { AuthProvider } from "@/context/auth";
import "../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
    </QueryClientProvider>
  );
}
