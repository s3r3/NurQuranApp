import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppNavigator from "./src/navigation/AppNavigator";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { useOfflineInitialization } from "./src/hooks/useOfflineInitialization";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const queryClient = new QueryClient();

function AppContent() {
  useOfflineInitialization();

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#111111",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
  },
  errorHint: {
    fontSize: 12,
    color: "#999999",
    fontStyle: "italic",
    textAlign: "center",
  },
});
