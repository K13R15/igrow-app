import React from "react";
import { View, Text } from "react-native";
import { scheduleStyles as styles } from "../../styles/scheduleStyles";
import { calculateStageProgress, getStageIcon } from "../../utils/plantHelpers";
import PropTypes from "prop-types";

export default function PlantGrowthProgress({ plant }) {
  const calculateProgress = () => {
    const plantedDate = new Date(plant.plantedAt);
    const now = new Date();
    const daysGrown = Math.floor((now - plantedDate) / (1000 * 60 * 60 * 24));
    const totalDays = plant.plantType.growthPeriod.total;
    return {
      daysGrown,
      progress: Math.min((daysGrown / totalDays) * 100, 100),
      daysRemaining: Math.max(totalDays - daysGrown, 0),
    };
  };

  const { daysGrown, progress, daysRemaining } = calculateProgress();
  const currentStage = plant.currentStage;

  return (
    <View style={styles.growthProgressCard}>
      <View style={styles.growthHeader}>
        <View style={styles.growthTitleContainer}>
          <Text style={styles.growthTitle}>Growth Progress</Text>
          <View style={styles.stageBadge}>
            <Text style={styles.stageBadgeText}>{currentStage}</Text>
          </View>
        </View>
        <Text style={styles.daysCount}>{daysGrown} days</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Day {daysGrown}</Text>
          <Text style={styles.progressLabel}>
            {daysRemaining} days remaining
          </Text>
        </View>
      </View>

      <View style={styles.growthStagesContainer}>
        {Object.entries(plant.plantType.growthPeriod).map(
          ([stage, days], index) => {
            if (stage === "total") return null;
            const stageProgress = calculateStageProgress(
              stage,
              daysGrown,
              plant.plantType.growthPeriod
            );

            return (
              <View key={stage} style={styles.growthStage}>
                <View style={styles.stageIconContainer}>
                  <Text style={styles.stageIcon}>{getStageIcon(stage)}</Text>
                  <View
                    style={[
                      styles.stageIndicator,
                      currentStage === stage && styles.activeStageIndicator,
                    ]}
                  />
                </View>
                <Text style={styles.stageName}>{stage}</Text>
                <Text style={styles.stageDuration}>{days} days</Text>
                <View style={styles.stageProgressBar}>
                  <View
                    style={[
                      styles.stageProgressFill,
                      { width: `${stageProgress}%` },
                    ]}
                  />
                </View>
              </View>
            );
          }
        )}
      </View>
    </View>
  );
}

PlantGrowthProgress.propTypes = {
  plant: PropTypes.shape({
    plantedAt: PropTypes.string.isRequired,
    currentStage: PropTypes.string.isRequired,
    plantType: PropTypes.shape({
      growthPeriod: PropTypes.shape({
        total: PropTypes.number.isRequired,
        seeding: PropTypes.number.isRequired,
        vegetative: PropTypes.number.isRequired,
        flowering: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};


