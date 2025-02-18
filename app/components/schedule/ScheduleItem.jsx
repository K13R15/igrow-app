import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { scheduleStyles as styles } from "../../styles/scheduleStyles";
import { formatPhTime } from "../../utils/plantHelpers";
import PropTypes from "prop-types";

export const ScheduleItem = ({ schedule, onToggle, onDelete }) => (
  <View style={styles.scheduleItem}>
    <TouchableOpacity
      style={[styles.scheduleContent, { opacity: schedule.isActive ? 1 : 0.5 }]}
      onPress={() => onToggle(schedule.id)}
    >
      <View>
        <Text style={styles.scheduleText}>
          {schedule.task.icon} {schedule.task.name}
        </Text>
        <Text style={styles.plantTypeText}>{schedule.plantType.name}</Text>
        <Text style={styles.scheduleDate}>{formatPhTime(schedule.date)}</Text>
        <Text style={styles.careInstructions}>
          {schedule.careInstructions.type ||
            schedule.careInstructions.waterAmount}
          {schedule.careInstructions.instructions
            ? `\n${schedule.careInstructions.instructions}`
            : ""}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(schedule.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </View>
);

ScheduleItem.propTypes = {
  schedule: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    task: PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    plantType: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    date: PropTypes.string.isRequired,
    careInstructions: PropTypes.shape({
      type: PropTypes.string,
      waterAmount: PropTypes.string,
      instructions: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
