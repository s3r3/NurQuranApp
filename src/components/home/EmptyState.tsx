import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useHomeColors } from "../../constants/home.constants";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  message?: string;
  progress?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isLoading,
  error,
  onRetry,
  message,
  progress,
}) => {
  const { t } = useTranslation();
  const colors = useHomeColors();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={[styles.text, { color: colors.TEXT_SECONDARY }]}>
          {message || `${t("Loading surahs")}...`}
        </Text>
        {typeof progress === "number" && (
          <Text style={[styles.progressText, { color: colors.PRIMARY }]}>
            {Math.round(progress)}%
          </Text>
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("Failed to load surahs")}</Text>
        <Text style={[styles.errorDetail, { color: colors.TEXT_SECONDARY }]}>{error.message}</Text>
        {onRetry && (
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.PRIMARY }]} onPress={onRetry}>
            <Text style={[styles.retryText, { color: colors.TEXT_PRIMARY }]}>{t("Retry")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.TEXT_SECONDARY }]}>{t("No surahs available")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    fontWeight: "600",
  },
});
