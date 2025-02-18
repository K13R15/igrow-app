import React from "react";
import { View, Text } from "react-native";

import PropTypes from "prop-types";
import { scheduleStyles as styles } from "../../styles/scheduleStyles";

export default function PlantCareDetails({ plantType }) {
  return (
    <View style={styles.careDetailsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{plantType.name} Care Guide</Text>
        <View style={styles.plantTypeTag}>
          <Text style={styles.plantTypeTagText}>Active Plant</Text>
        </View>
      </View>

      <View style={styles.careSection}>
        <View style={styles.careSectionHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.careSectionIcon}>💧</Text>
          </View>
          <Text style={styles.careSectionTitle}>Watering Schedule</Text>
        </View>
        <View style={styles.careDetailBox}>
          <View style={styles.careDetailItem}>
            <View style={styles.detailIconLabel}>
              <Text style={styles.detailIcon}>🕒</Text>
              <Text style={styles.careDetailLabel}>Frequency</Text>
            </View>
            <Text style={styles.careDetailValue}>
              Every {plantType.stageRequirements.seeding.wateringFrequency}{" "}
              day(s)
            </Text>
          </View>
          <View style={styles.careDetailItem}>
            <View style={styles.detailIconLabel}>
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.careDetailLabel}>Duration</Text>
            </View>
            <Text style={styles.careDetailValue}>
              {plantType.stageRequirements.seeding.wateringDuration} seconds
            </Text>
          </View>
          <View style={styles.careDetailItem}>
            <View style={styles.detailIconLabel}>
              <Text style={styles.detailIcon}>💧</Text>
              <Text style={styles.careDetailLabel}>Moisture Target</Text>
            </View>
            <View style={styles.moistureIndicator}>
              <Text style={styles.careDetailValue}>
                {plantType.stageRequirements.seeding.moisture}%
              </Text>
              <View style={styles.moistureBar}>
                <View
                  style={[
                    styles.moistureFill,
                    {
                      width: `${plantType.stageRequirements.seeding.moisture}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.careSection}>
        <View style={styles.careSectionHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.careSectionIcon}>🌱</Text>
          </View>
          <Text style={styles.careSectionTitle}>Fertilizing Guide</Text>
        </View>
        <View style={styles.careDetailBox}>
          <View style={styles.careDetailItem}>
            <View style={styles.detailIconLabel}>
              <Text style={styles.detailIcon}>📅</Text>
              <Text style={styles.careDetailLabel}>Frequency</Text>
            </View>
            <Text style={styles.careDetailValue}>
              Every {plantType.stageRequirements.seeding.fertilizingFrequency}{" "}
              days
            </Text>
          </View>
          <View style={styles.careDetailItem}>
            <View style={styles.detailIconLabel}>
              <Text style={styles.detailIcon}>🧪</Text>
              <Text style={styles.careDetailLabel}>pH Range</Text>
            </View>
            <View style={styles.phRange}>
              <Text style={styles.phValue}>
                {plantType.stageRequirements.seeding.ph.min}
              </Text>
              <View style={styles.phBar}>
                <View style={styles.phIndicator} />
              </View>
              <Text style={styles.phValue}>
                {plantType.stageRequirements.seeding.ph.max}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.careSection}>
        <View style={styles.careSectionHeader}>
          <Text style={styles.careSectionIcon}>📅</Text>
          <Text style={styles.careSectionTitle}>Growth Timeline</Text>
        </View>
        <View style={styles.timelineContainer}>
          {Object.entries(plantType.growthPeriod).map(([stage, days]) => {
            if (stage === "total") return null;
            return (
              <View key={stage} style={styles.timelineItem}>
                <Text style={styles.timelinePhase}>{stage}</Text>
                <Text style={styles.timelineDays}>{days} days</Text>
                <View
                  style={[
                    styles.timelineBar,
                    {
                      width: `${(days / plantType.growthPeriod.total) * 100}%`,
                    },
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

      <View style={styles.careSection}>
        <View style={styles.careSectionHeader}>
          <Text style={styles.careSectionIcon}>🌿</Text>
          <Text style={styles.careSectionTitle}>Varieties</Text>
        </View>
        <View style={styles.varietiesContainer}>
          {plantType.examples.map((example, index) => (
            <View key={index} style={styles.varietyChip}>
              <Text style={styles.varietyText}>{example}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

PlantCareDetails.propTypes = {
  plantType: PropTypes.shape({
    name: PropTypes.string.isRequired,
    stageRequirements: PropTypes.shape({
      seeding: PropTypes.shape({
        wateringFrequency: PropTypes.number.isRequired,
        wateringDuration: PropTypes.number.isRequired,
        moisture: PropTypes.number.isRequired,
        fertilizingFrequency: PropTypes.number.isRequired,
        ph: PropTypes.shape({
          min: PropTypes.number.isRequired,
          max: PropTypes.number.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    growthPeriod: PropTypes.shape({
      total: PropTypes.number.isRequired,
      seeding: PropTypes.number.isRequired,
      vegetative: PropTypes.number.isRequired,
      flowering: PropTypes.number.isRequired,
    }).isRequired,
    examples: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
