import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

const PlantCareDetails = ({ plantType }) => (
  <View style={styles.careDetailsCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{plantType.name} Care Guide</Text>
      <View style={styles.plantTypeTag}>
        <Text style={styles.plantTypeTagText}>Active Plant</Text>
      </View>
    </View>

    <CareSection
      icon="💧"
      title="Watering Schedule"
      details={[
        {
          icon: "🕒",
          label: "Frequency",
          value: `Every ${plantType.stageRequirements.seeding.wateringFrequency} day(s)`,
        },
        {
          icon: "⏱️",
          label: "Duration",
          value: `${plantType.stageRequirements.seeding.wateringDuration} seconds`,
        },
        {
          icon: "💧",
          label: "Moisture Target",
          value: `${plantType.stageRequirements.seeding.moisture}%`,
          showMoistureBar: true,
          moistureValue: plantType.stageRequirements.seeding.moisture,
        },
      ]}
    />

    <CareSection
      icon="🌱"
      title="Fertilizing Guide"
      details={[
        {
          icon: "📅",
          label: "Frequency",
          value: `Every ${plantType.stageRequirements.seeding.fertilizingFrequency} days`,
        },
        {
          icon: "🧪",
          label: "pH Range",
          value: `${plantType.stageRequirements.seeding.ph.min} - ${plantType.stageRequirements.seeding.ph.max}`,
          showPhBar: true,
          phMin: plantType.stageRequirements.seeding.ph.min,
          phMax: plantType.stageRequirements.seeding.ph.max,
        },
      ]}
    />

    <GrowthTimeline plantType={plantType} />
    <PlantVarieties varieties={plantType.examples} />
  </View>
);

const CareSection = ({ icon, title, details }) => (
  <View style={styles.careSection}>
    <View style={styles.careSectionHeader}>
      <View style={styles.iconContainer}>
        <Text style={styles.careSectionIcon}>{icon}</Text>
      </View>
      <Text style={styles.careSectionTitle}>{title}</Text>
    </View>
    <View style={styles.careDetailBox}>
      {details.map((detail, index) => (
        <CareDetailItem key={index} {...detail} />
      ))}
    </View>
  </View>
);

const CareDetailItem = ({
  icon,
  label,
  value,
  showMoistureBar,
  moistureValue,
  showPhBar,
  phMin,
  phMax,
}) => (
  <View style={styles.careDetailItem}>
    <View style={styles.detailIconLabel}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.careDetailLabel}>{label}</Text>
    </View>
    {showMoistureBar ? (
      <View style={styles.moistureIndicator}>
        <Text style={styles.careDetailValue}>{value}</Text>
        <View style={styles.moistureBar}>
          <View style={[styles.moistureFill, { width: `${moistureValue}%` }]} />
        </View>
      </View>
    ) : showPhBar ? (
      <View style={styles.phRange}>
        <Text style={styles.phValue}>{phMin}</Text>
        <View style={styles.phBar}>
          <View style={styles.phIndicator} />
        </View>
        <Text style={styles.phValue}>{phMax}</Text>
      </View>
    ) : (
      <Text style={styles.careDetailValue}>{value}</Text>
    )}
  </View>
);

const GrowthTimeline = ({ plantType }) => (
  <View style={styles.careSection}>
    <View style={styles.careSectionHeader}>
      <Text style={styles.careSectionIcon}>📅</Text>
      <Text style={styles.careSectionTitle}>Growth Timeline</Text>
    </View>
    <View style={styles.timelineContainer}>
      {Object.entries(plantType.growthPeriod).map(([phase, days]) => {
        if (phase === "total") return null;
        return (
          <View key={phase} style={styles.timelineItem}>
            <Text style={styles.timelinePhase}>{phase}</Text>
            <Text style={styles.timelineDays}>{days} days</Text>
            <View
              style={[
                styles.timelineBar,
                { width: `${(days / plantType.growthPeriod.total) * 100}%` },
              ]}
            />
          </View>
        );
      })}
      <View style={styles.totalTimeContainer}>
        <Text style={styles.totalTimeLabel}>Total Growth Period:</Text>
        <Text style={styles.totalTimeValue}>
          {plantType.growthPeriod.total} days
        </Text>
      </View>
    </View>
  </View>
);

const PlantVarieties = ({ varieties }) => (
  <View style={styles.careSection}>
    <View style={styles.careSectionHeader}>
      <Text style={styles.careSectionIcon}>🌿</Text>
      <Text style={styles.careSectionTitle}>Varieties</Text>
    </View>
    <View style={styles.varietiesContainer}>
      {varieties.map((variety, index) => (
        <View key={index} style={styles.varietyChip}>
          <Text style={styles.varietyText}>{variety}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  careDetailsCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  plantTypeTag: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  plantTypeTagText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.sm,
    fontWeight: "600",
  },
  // ... rest of the styles following theme system
});

export default PlantCareDetails;
