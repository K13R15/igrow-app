import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { PLANT_TYPES } from "../../constants/plantTypes";
import { scheduleService } from "../api/scheduleService";

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPlantType, setSelectedPlantType] = useState(null);

  const tasks = [
    { id: "water", name: "Watering", icon: "💧" },
    { id: "fertilize", name: "Fertilizing", icon: "🌱" },
    { id: "pesticide", name: "Pesticide", icon: "🧪" },
  ];

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const savedSchedules = await scheduleService.getSchedules();
      setSchedules(savedSchedules);
    } catch (error) {
      Alert.alert("Error", "Failed to load schedules");
    }
  };

  const addSchedule = async (date, task, plantType) => {
    try {
      const newSchedule = {
        id: Date.now(),
        date,
        task,
        plantType,
        isActive: true,
      };

      await scheduleService.createSchedule(newSchedule);
      setSchedules([...schedules, newSchedule]);

      Alert.alert("Success", "Schedule created successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to create schedule");
    }
  };

  const toggleSchedule = async (id) => {
    try {
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, isActive: !schedule.isActive }
          : schedule
      );

      await scheduleService.updateSchedule(
        id,
        !schedules.find((s) => s.id === id).isActive
      );
      setSchedules(updatedSchedules);
    } catch (error) {
      Alert.alert("Error", "Failed to update schedule");
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await scheduleService.deleteSchedule(id);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete schedule");
    }
  };

  const PlantTypeModal = () => (
    <Modal visible={showPlantModal} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Plant Type</Text>
          {Object.values(PLANT_TYPES).map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.plantTypeButton}
              onPress={() => {
                setSelectedPlantType(type);
                setShowPlantModal(false);
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.plantTypeName}>{type.name}</Text>
              <Text style={styles.plantTypeExamples}>
                Examples: {type.examples.join(", ")}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowPlantModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task Scheduler</Text>

      <View style={styles.taskContainer}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskButton}
            onPress={() => {
              setSelectedTask(task);
              setShowPlantModal(true);
            }}
          >
            <Text style={styles.taskIcon}>{task.icon}</Text>
            <Text style={styles.taskText}>{task.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <PlantTypeModal />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          is24Hour={true}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              addSchedule(date, selectedTask, selectedPlantType);
            }
          }}
        />
      )}

      <ScrollView style={styles.scheduleList}>
        {schedules.map((schedule) => (
          <View key={schedule.id} style={styles.scheduleItem}>
            <TouchableOpacity
              style={[
                styles.scheduleContent,
                { opacity: schedule.isActive ? 1 : 0.5 },
              ]}
              onPress={() => toggleSchedule(schedule.id)}
            >
              <View>
                <Text style={styles.scheduleText}>
                  {schedule.task.icon} {schedule.task.name}
                </Text>
                <Text style={styles.plantTypeText}>
                  {schedule.plantType.name}
                </Text>
                <Text style={styles.scheduleDate}>
                  {new Date(schedule.date).toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteSchedule(schedule.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  taskButton: {
    alignItems: "center",
    backgroundColor: "#065F46",
    padding: 16,
    borderRadius: 12,
    width: "30%",
  },
  taskIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  taskText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1F2937",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  plantTypeButton: {
    backgroundColor: "#065F46",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  plantTypeName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  plantTypeExamples: {
    color: "#A7AFB5",
    fontSize: 12,
    marginTop: 4,
  },
  scheduleItem: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    marginBottom: 8,
  },
  scheduleContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 4,
  },
  plantTypeText: {
    color: "#A7AFB5",
    fontSize: 14,
    marginBottom: 4,
  },
  scheduleDate: {
    color: "#A7AFB5",
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  cancelButton: {
    backgroundColor: "#DC2626",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Schedule;
