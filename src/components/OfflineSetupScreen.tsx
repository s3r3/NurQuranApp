import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAppStore } from "../store/useAppStore";
import { offlineDataService } from "../services";

interface OfflineSetupScreenProps {
  onSetupComplete: () => void;
}

export const OfflineSetupScreen: React.FC<OfflineSetupScreenProps> = ({
  onSetupComplete,
}) => {
  const { quranDBReady, setQuranDBReady } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const initializeOfflineMode = async () => {
      try {
        setStatus("Preparing offline database...");
        setProgress(10);

        const offlineStatus = await offlineDataService.getOfflineStatus();

        if (offlineStatus.quranReady) {
          setProgress(100);
          setStatus("Ready!");
          setQuranDBReady(true);
          setTimeout(onSetupComplete, 500);
          return;
        }

        setStatus("Downloading Quran data...");
        setProgress(30);

        await offlineDataService.initialize();

        setProgress(75);
        setStatus("Verifying data...");

        const verified = await offlineDataService.verifyDataIntegrity();

        if (verified) {
          setProgress(100);
          setStatus("Setup complete!");
          setQuranDBReady(true);
          setTimeout(onSetupComplete, 500);
        } else {
          setStatus("Data verification failed. Retrying...");
          setProgress(0);
          setTimeout(initializeOfflineMode, 1000);
        }
      } catch (error) {
        console.error("Failed to initialize offline mode:", error);
        setStatus(
          "Error: " +
            (error instanceof Error ? error.message : "Unknown error"),
        );
        setProgress(0);

        // Retry after delay
        setTimeout(initializeOfflineMode, 2000);
      }
    };

    if (!quranDBReady) {
      initializeOfflineMode();
    }
  }, [quranDBReady, setQuranDBReady, onSetupComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📖 Setting Up NurQuran</Text>
        <Text style={styles.subtitle}>
          Downloading offline Quran data for offline access
        </Text>

        <View style={styles.progressSection}>
          <ActivityIndicator size="large" color="#A44AFF" />

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>{Math.round(progress)}%</Text>

          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.features}>
          <FeatureItem icon="📱" text="Offline Quran access" />
          <FeatureItem icon="🕌" text="Cached prayer times" />
          <FeatureItem icon="📅" text="Islamic calendar" />
        </View>
      </View>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 20,
  },
  progressSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    marginVertical: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#A44AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A44AFF",
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  features: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
});
