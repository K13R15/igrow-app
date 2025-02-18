import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PLANT_TYPES } from "../../constants/plantTypes";
import { scheduleService } from "../api/scheduleService";
import {
  updatePlantSettings,
  addPlant,
  getActivePlants,
  account,
  PLANT_LIFECYCLE_STAGES,
  harvestPlant,
  getActivePlant,
  createSchedule,
  getSchedules,
  markPlantAsDied,
} from "../../lib/appwrite";
import {
  formatPhTime,
  getPlantIcon,
  getStageIcon,
  calculateStageProgress,
} from "../utils/plantHelpers";
import { scheduleStyles as styles } from "../styles/scheduleStyles";

const PlantCareDetails = ({ plantType }) => (
  <View style={styles.careDetailsCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{plantType.name} Care Guide</Text>
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
            Every {plantType.stageRequirements.seeding.wateringFrequency} day(s)
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
                  { width: `${plantType.stageRequirements.seeding.moisture}%` },
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
          <View style={styles.phRangeContainer}>
            <Text style={styles.phValue}>
              {plantType.stageRequirements.seeding.ph.min}
            </Text>
            <View style={styles.phBarContainer}>
              <View style={styles.phBar}>
                <View
                  style={[
                    styles.phIndicator,
                    {
                      left: `${
                        ((plantType.stageRequirements.seeding.ph.min - 0) /
                          14) *
                        100
                      }%`,
                      width: `${
                        ((plantType.stageRequirements.seeding.ph.max -
                          plantType.stageRequirements.seeding.ph.min) /
                          14) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.phScale}>
                <Text style={styles.phScaleLabel}>Acidic</Text>
                <Text style={styles.phScaleLabel}>Neutral</Text>
                <Text style={styles.phScaleLabel}>Alkaline</Text>
              </View>
            </View>
            <Text style={styles.phValue}>
              {plantType.stageRequirements.seeding.ph.max}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const PlantVarietyCard = ({ variety, onSelect }) => (
  <TouchableOpacity
    style={styles.varietyCard}
    onPress={() => onSelect(variety)}
  >
    <Text style={styles.varietyIcon}>🌱</Text>
    <Text style={styles.varietyName}>{variety}</Text>
  </TouchableOpacity>
);

const CareCustomizationModal = ({ visible, plantType, onSubmit, onCancel }) => {
  const [useDefaultCare, setUseDefaultCare] = useState(true);
  const [customCare, setCustomCare] = useState({
    wateringFrequency:
      plantType?.stageRequirements?.seeding?.wateringFrequency || 1,
    wateringDuration:
      plantType?.stageRequirements?.seeding?.wateringDuration || 30,
    fertilizingFrequency:
      plantType?.stageRequirements?.seeding?.fertilizingFrequency || 7,
    moistureThreshold: plantType?.stageRequirements?.seeding?.moisture || 70,
  });

  useEffect(() => {
    setCustomCare({
      wateringFrequency:
        plantType?.stageRequirements?.seeding?.wateringFrequency || "",
      wateringDuration:
        plantType?.stageRequirements?.seeding?.wateringDuration || "",
      fertilizingFrequency:
        plantType?.stageRequirements?.seeding?.fertilizingFrequency || 0,
      moistureThreshold: plantType?.stageRequirements?.seeding?.moisture || "",
    });
  }, [plantType]);

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setCustomCare((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const renderCareDetail = (icon, label, value, unit) => (
    <View style={styles.enhancedCareDetailRow}>
      <View style={styles.careDetailLeft}>
        <View style={styles.iconContainer}>
          <Text style={styles.enhancedDetailIcon}>{icon}</Text>
        </View>
        <Text style={styles.enhancedDetailLabel}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.enhancedDetailValue}>
          {value} <Text style={styles.unitText}>{unit}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.enhancedModalContent}>
          <View style={styles.modalHeaderWithClose}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Plant Care Setup</Text>
              <Text style={styles.modalSubtitle}>{plantType?.name}</Text>
            </View>
            <TouchableOpacity style={styles.closeIconButton} onPress={onCancel}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.enhancedCareTypeSelection}>
            <TouchableOpacity
              style={[
                styles.careTypeTab,
                useDefaultCare && styles.enhancedCareTypeTabActive,
              ]}
              onPress={() => setUseDefaultCare(true)}
            >
              <Text
                style={[
                  styles.careTypeText,
                  useDefaultCare && styles.enhancedCareTypeTextActive,
                ]}
              >
                Default Care
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.careTypeTab,
                !useDefaultCare && styles.enhancedCareTypeTabActive,
              ]}
              onPress={() => setUseDefaultCare(false)}
            >
              <Text
                style={[
                  styles.careTypeText,
                  !useDefaultCare && styles.enhancedCareTypeTextActive,
                ]}
              >
                Custom Care
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.enhancedCareDetailsScroll}>
            {useDefaultCare ? (
              <View style={styles.enhancedDefaultCareContainer}>
                <View style={styles.enhancedCareSection}>
                  <Text style={styles.enhancedCareSectionTitle}>
                    <Text style={styles.sectionIcon}>💧 </Text>
                    Watering Schedule
                  </Text>
                  {renderCareDetail(
                    "🕒",
                    "Frequency",
                    plantType?.stageRequirements?.seeding?.wateringFrequency,
                    "days"
                  )}
                  {renderCareDetail(
                    "⏱️",
                    "Duration",
                    plantType?.stageRequirements?.seeding?.wateringDuration,
                    "seconds"
                  )}
                  {renderCareDetail(
                    "📊",
                    "Moisture Target",
                    plantType?.stageRequirements?.seeding?.moisture,
                    "%"
                  )}
                </View>

                <View style={styles.enhancedCareSection}>
                  <Text style={styles.enhancedCareSectionTitle}>
                    <Text style={styles.sectionIcon}>🌱 </Text>
                    Fertilizing Schedule
                  </Text>
                  {renderCareDetail(
                    "📅",
                    "Frequency",
                    plantType?.stageRequirements?.seeding?.fertilizingFrequency,
                    "days"
                  )}
                  {renderCareDetail(
                    "🧪",
                    "pH Range",
                    `${plantType?.stageRequirements?.seeding?.ph?.min} - ${plantType?.stageRequirements?.seeding?.ph?.max}`,
                    ""
                  )}
                </View>

                <View style={styles.enhancedRecommendedNote}>
                  <Text style={styles.recommendedIcon}>💡</Text>
                  <Text style={styles.enhancedRecommendedText}>
                    These settings are optimized for {plantType?.name} based on
                    research and best practices
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.enhancedCustomCareForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.enhancedInputLabel}>
                    <Text style={styles.inputIcon}>💧 </Text>
                    Watering Frequency
                  </Text>
                  <TextInput
                    style={styles.enhancedInput}
                    value={String(customCare.wateringFrequency)}
                    onChangeText={(value) =>
                      setCustomCare((prev) => ({
                        ...prev,
                        wateringFrequency: parseInt(value) || "",
                      }))
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#6B7280"
                  />
                  <Text style={styles.enhancedSuggestion}>
                    Recommended:{" "}
                    {plantType?.stageRequirements?.seeding?.wateringFrequency}{" "}
                    days
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.enhancedInputLabel}>
                    <Text style={styles.inputIcon}>⏱️ </Text>
                    Watering Duration
                  </Text>
                  <TextInput
                    style={styles.enhancedInput}
                    value={String(customCare.wateringDuration)}
                    onChangeText={(value) =>
                      setCustomCare((prev) => ({
                        ...prev,
                        wateringDuration: parseInt(value) || "",
                      }))
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#6B7280"
                  />
                  <Text style={styles.enhancedSuggestion}>
                    Recommended:{" "}
                    {plantType?.stageRequirements?.seeding?.wateringDuration}{" "}
                    seconds
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.enhancedInputLabel}>
                    <Text style={styles.inputIcon}>🌱 </Text>
                    Fertilizing Frequency
                  </Text>
                  <TextInput
                    style={styles.enhancedInput}
                    value={String(customCare.fertilizingFrequency)}
                    onChangeText={(value) =>
                      setCustomCare((prev) => ({
                        ...prev,
                        fertilizingFrequency: parseInt(value) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#6B7280"
                  />
                  <Text style={styles.enhancedSuggestion}>
                    Recommended:{" "}
                    {
                      plantType?.stageRequirements?.seeding
                        ?.fertilizingFrequency
                    }{" "}
                    days
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.enhancedInputLabel}>
                    <Text style={styles.inputIcon}>📊 </Text>
                    Moisture Threshold
                  </Text>
                  <TextInput
                    style={styles.enhancedInput}
                    value={String(customCare.moistureThreshold)}
                    onChangeText={(value) =>
                      setCustomCare((prev) => ({
                        ...prev,
                        moistureThreshold: parseInt(value) || "",
                      }))
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#6B7280"
                  />
                  <Text style={styles.enhancedSuggestion}>
                    Recommended:{" "}
                    {plantType?.stageRequirements?.seeding?.moisture}%
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.enhancedPrimaryButton}
            onPress={() => onSubmit(useDefaultCare ? null : customCare)}
          >
            <Text style={styles.enhancedPrimaryButtonText}>Start Growing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const PlantGrowthProgress = ({ plant }) => {
  if (!plant || !plant.currentStage || !plant.growthPeriod) {
    return null;
  }

  const progress = calculateStageProgress(
    plant.currentStage,
    plant.daysGrown || 0,
    plant.growthPeriod
  );

  return (
    <View style={styles.growthProgressContainer}>
      <View style={styles.stageProgress}>
        <View style={styles.stageHeader}>
          <Text style={styles.currentStage}>
            {getStageIcon(plant.currentStage)} {plant.currentStage}
          </Text>
          <Text style={styles.progressText}>
            {Math.round(progress)}% Complete
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.plantMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricIcon}>🌡️</Text>
          <Text style={styles.metricValue}>23°C</Text>
          <Text style={styles.metricLabel}>Temperature</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricIcon}>💧</Text>
          <Text style={styles.metricValue}>75%</Text>
          <Text style={styles.metricLabel}>Humidity</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricIcon}>☀️</Text>
          <Text style={styles.metricValue}>850</Text>
          <Text style={styles.metricLabel}>Light (lux)</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricIcon}>🧪</Text>
          <Text style={styles.metricValue}>6.5</Text>
          <Text style={styles.metricLabel}>pH Level</Text>
        </View>
      </View>
    </View>
  );
};

// Update the PlantTypeCard component
const PlantTypeCard = ({ plant, onSelect }) => {
  // Get background color based on plant type
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "leafy":
        return "#166534"; // dark green
      case "fruiting":
        return "#9D174D"; // dark pink
      case "root":
        return "#92400E"; // dark orange
      case "legume":
        return "#1E40AF"; // dark blue
      case "brassica":
        return "#5B21B6"; // dark purple
      default:
        return "#374151";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.plantTypeCard,
        { backgroundColor: getTypeColor(plant.type) },
      ]}
      onPress={() => onSelect(plant)}
    >
      <View style={styles.plantTypeHeader}>
        <View
          style={[
            styles.plantTypeIconContainer,
            { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          ]}
        >
          <Text style={styles.plantTypeIcon}>{getPlantIcon(plant.type)}</Text>
        </View>
        <View
          style={[
            styles.plantTypeTag,
            { backgroundColor: "rgba(255, 255, 255, 0.15)" },
          ]}
        >
          <Text style={[styles.plantTypeTagText, { color: "#FFFFFF" }]}>
            {plant.type}
          </Text>
        </View>
      </View>

      <View style={styles.plantTypeInfo}>
        <Text style={styles.plantTypeName}>{plant.name}</Text>
        <Text style={styles.plantTypeDescription} numberOfLines={2}>
          {plant.description}
        </Text>

        <View
          style={[
            styles.plantTypeStats,
            { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          ]}
        >
          <View style={styles.plantTypeStat}>
            <Text style={styles.plantTypeStatIcon}>🌱</Text>
            <Text style={styles.plantTypeStatValue}>
              {plant.growthPeriod.total}
            </Text>
            <Text style={[styles.plantTypeStatLabel, { color: "#E5E7EB" }]}>
              Days to Grow
            </Text>
          </View>

          <View style={[styles.plantTypeStat, styles.plantTypeStatLast]}>
            <Text style={styles.plantTypeStatIcon}>🎯</Text>
            <Text style={styles.plantTypeStatValue}>
              {plant.examples.length}
            </Text>
            <Text style={[styles.plantTypeStatLabel, { color: "#E5E7EB" }]}>
              Varieties
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Update the PlantTypeModal component
const PlantTypeModal = ({ visible, onClose, onSelectPlant }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [showVarieties, setShowVarieties] = useState(false);
  const [showCareCustomization, setShowCareCustomization] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.enhancedModalContent}>
          {!showVarieties && !showCareCustomization ? (
            <>
              <View style={styles.modalHeaderWithClose}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>Select Plant Type</Text>
                  <Text style={styles.modalSubtitle}>
                    Choose a plant type to start growing
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeIconButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={[styles.plantTypeScrollView, { maxHeight: "80%" }]}
                contentContainerStyle={styles.plantTypeScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.plantTypeGrid}>
                  {Object.values(PLANT_TYPES).map((plant, index) => (
                    <View key={plant.id} style={{ width: "48%" }}>
                      <PlantTypeCard
                        plant={{
                          ...plant,
                          type: plant.id.split("_")[0],
                          description: `Perfect for growing ${plant.examples
                            .slice(0, 2)
                            .join(", ")} and more.`,
                        }}
                        onSelect={() => {
                          setSelectedType(plant);
                          setShowVarieties(true);
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </>
          ) : showVarieties ? (
            <View style={styles.varietiesContainer}>
              <View style={styles.modalHeaderWithClose}>
                <View style={styles.modalTitleContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setShowVarieties(false)}
                    >
                      <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.headerIconContainer}>
                      <Text style={styles.headerIcon}>
                        {getPlantIcon(selectedType.id.split("_")[0])}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>{selectedType.name}</Text>
                      <Text style={styles.modalSubtitle}>
                        Select a variety to grow
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeIconButton}
                  onPress={onClose}
                >
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.varietiesScrollView}
                contentContainerStyle={styles.varietiesGrid}
                showsVerticalScrollIndicator={false}
              >
                {selectedType.examples.map((variety, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.enhancedVarietyCard}
                    onPress={() => {
                      setShowVarieties(false);
                      setShowCareCustomization(true);
                    }}
                  >
                    <View style={styles.varietyIconContainer}>
                      <Text style={styles.varietyIcon}>
                        {getPlantIcon(selectedType.id.split("_")[0])}
                      </Text>
                    </View>
                    <Text style={styles.varietyName}>{variety}</Text>
                    <View style={styles.varietyMetrics}>
                      <View style={styles.varietyMetric}>
                        <Text style={styles.metricIcon}>🌱</Text>
                        <Text style={styles.metricValue}>
                          {selectedType.growthPeriod.total}d
                        </Text>
                      </View>
                      <View style={styles.varietyMetric}>
                        <Text style={styles.metricIcon}>💧</Text>
                        <Text style={styles.metricValue}>
                          {
                            selectedType.stageRequirements.seeding
                              .wateringFrequency
                          }
                          x
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <CareCustomizationModal
              visible={showCareCustomization}
              plantType={selectedType}
              onSubmit={(customCare) => {
                onSelectPlant(selectedType, customCare);
                setShowCareCustomization(false);
                onClose();
              }}
              onCancel={() => setShowCareCustomization(false)}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const FertilizerModal = ({
  isConfirmation,
  visible,
  onClose,
  onConfirm,
  title,
  message,
}) => (
  <Modal
    visible={visible}
    animationType="fade"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.enhancedModalContent}>
        <View style={styles.modalHeaderWithClose}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>{title}</Text>
            {message && <Text style={styles.modalSubtitle}>{message}</Text>}
          </View>
          <TouchableOpacity style={styles.closeIconButton} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {isConfirmation ? (
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>Apply Fertilizer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.modalButton, styles.modalConfirmButton]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </Modal>
);

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPlantType, setSelectedPlantType] = useState(null);
  const [activePlants, setActivePlants] = useState([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlant, setActivePlant] = useState(null);
  const [showMarkAsDiedModal, setShowMarkAsDiedModal] = useState(false);
  const [showFertilizerConfirmModal, setShowFertilizerConfirmModal] =
    useState(false);
  const [showFertilizerStatusModal, setShowFertilizerStatusModal] =
    useState(false);
  const [fertilizerStatusMessage, setFertilizerStatusMessage] = useState({
    title: "",
    message: "",
  });

  const tasks = [
    { id: "water", name: "Watering", icon: "💧" },
    { id: "fertilize", name: "Fertilizing", icon: "🌱" },
    { id: "pesticide", name: "Pesticide", icon: "🧪" },
  ];

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsConnecting(true);
    try {
      console.log("Checking connection to ESP32...");
      const result = await scheduleService.testConnection();
      console.log("Connection test result:", result);

      if (result.connected) {
        setIsConnected(true);
        await loadSchedules();
      } else {
        setIsConnected(false);
        Alert.alert(
          "Connection Error",
          `Could not connect to the plant care system.\n\n${
            result.error || "Unknown error"
          }\n\nPlease check:\n\n` +
            "1. The ESP32 is powered on\n" +
            "2. You're connected to the same WiFi network\n" +
            "3. The IP address is correct (${ESP32_CONFIG.IP_ADDRESS})\n" +
            "4. No firewall is blocking the connection",
          [
            {
              text: "Retry",
              onPress: checkConnection,
            },
            {
              text: "Settings",
              onPress: () => {
                // Add navigation to settings screen if you have one
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      setIsConnected(false);
      Alert.alert(
        "Error",
        `Failed to connect to the plant care system: ${error.message}`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const loadSchedules = async () => {
    try {
      const savedSchedules = await scheduleService.getSchedules();
      setSchedules(savedSchedules);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      // Don't show alert, just set empty schedules
      setSchedules([]);
    }
  };

  const generateGrowthStageSchedules = async (plantType, lifecycleId) => {
    try {
      const now = new Date();
      const schedules = [];

      // Generate recurring watering schedules for the next 30 days
      for (
        let i = 0;
        i < 30;
        i += plantType.stageRequirements.seeding.wateringFrequency
      ) {
        const wateringSchedule = {
          plantType: plantType,
          task: { id: "water", name: "Watering" },
          date: new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000), // Start from tomorrow
          careInstructions: {
            duration: plantType.stageRequirements.seeding.wateringDuration,
            waterAmount: "200ml",
            moistureThreshold: plantType.stageRequirements.seeding.moisture,
          },
        };
        await createSchedule(wateringSchedule);
        schedules.push(wateringSchedule);
      }

      // Generate recurring fertilizing schedules if fertilizing frequency > 0
      if (plantType.stageRequirements.seeding.fertilizingFrequency > 0) {
        for (
          let i = 0;
          i < 30;
          i += plantType.stageRequirements.seeding.fertilizingFrequency
        ) {
          const fertilizingSchedule = {
            plantType: plantType,
            task: { id: "fertilize", name: "Fertilizing" },
            date: new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
            careInstructions: {
              duration: 30,
              waterAmount: "0ml",
              moistureThreshold: plantType.stageRequirements.seeding.moisture,
            },
          };
          await createSchedule(fertilizingSchedule);
          schedules.push(fertilizingSchedule);
        }
      }

      return schedules;
    } catch (error) {
      console.error("Failed to generate growth stage schedules:", error);
      throw error;
    }
  };

  const addPlantSchedules = async (plantType) => {
    try {
      setIsLoading(true);

      // Check for active plant first
      if (activePlant) {
        Alert.alert(
          "Active Plant Exists",
          "You must harvest your current plant before adding a new one."
        );
        return;
      }

      // Add plant to Appwrite with lifecycle management
      const result = await addPlant(plantType);
      setActivePlant(result.lifecycle);

      // Generate and create schedules
      await generateGrowthStageSchedules(plantType, result.lifecycle.$id);

      // Refresh the schedules list
      const updatedSchedules = await getSchedules();
      setSchedules(updatedSchedules);

      // Immediately update the active plants list
      const session = await account.get();
      const plants = await getActivePlants(session.$id);
      const activePlantTypes = plants
        .map((plant) => {
          const plantType = Object.values(PLANT_TYPES).find(
            (type) => type.id === plant.id
          );
          return plantType || null;
        })
        .filter(Boolean);

      setActivePlants(activePlantTypes);

      Alert.alert("Success", `Started growing ${plantType.name}`);
    } catch (error) {
      console.error("Error in addPlantSchedules:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
      setShowPlantModal(false);
    }
  };

  const removePlant = async (plantType) => {
    try {
      // Remove all schedules for this plant type
      const plantSchedules = schedules.filter(
        (s) => s.plantType.id === plantType.id
      );
      for (const schedule of plantSchedules) {
        await scheduleService.deleteSchedule(schedule.id);
      }

      setSchedules((prev) =>
        prev.filter((s) => s.plantType.id !== plantType.id)
      );
      setActivePlants((prev) => prev.filter((p) => p.id !== plantType.id));

      Alert.alert("Success", `Removed ${plantType.name} and its schedules`);
    } catch (error) {
      Alert.alert("Error", "Failed to remove plant");
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

  const renderScheduleItem = (schedule) => (
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

          <Text style={styles.scheduleDate}>{formatPhTime(schedule.date)}</Text>
          <Text style={styles.careInstructions}>
            {schedule.careInstructions.type ||
              schedule.careInstructions.waterAmount}
            {schedule.careInstructions.instructions
              ? `\n${schedule.careInstructions.instructions}`
              : ""}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDatePicker = () => {
    if (Platform.OS === "web") {
      // Use a web-friendly date input
      return (
        <input
          type="datetime-local"
          value={selectedDate.toISOString().slice(0, 16)}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          style={{
            padding: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        />
      );
    }

    // Use DateTimePicker for mobile
    return (
      showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )
    );
  };

  useEffect(() => {
    const loadActivePlants = async () => {
      try {
        const session = await account.get();
        const plants = await getActivePlants(session.$id);
        const activePlantTypes = plants
          .map((plant) => {
            // Find the plant type in our PLANT_TYPES object
            const plantType = Object.values(PLANT_TYPES).find(
              (type) => type.id === plant.id
            );
            return plantType || null;
          })
          .filter(Boolean); // Remove any null values
        setActivePlants(activePlantTypes);
      } catch (error) {
        console.error("Failed to load active plants:", error);
      }
    };

    if (isConnected) {
      loadActivePlants();
    }
  }, [isConnected]);

  useEffect(() => {
    const loadActivePlant = async () => {
      try {
        const session = await account.get();
        const plant = await getActivePlant(session.$id);
        setActivePlant(plant);
      } catch (error) {
        console.error("Failed to load active plant:", error);
        // Don't set activePlant to null here, keep the previous state
      }
    };

    if (isConnected) {
      loadActivePlant();
    }
  }, [isConnected]);

  const handleHarvest = async () => {
    try {
      if (!activePlant) return;

      Alert.alert(
        "Confirm Harvest",
        "Are you sure you want to harvest this plant? This will mark it as complete and allow you to start growing a new plant.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Harvest",
            style: "destructive",
            onPress: async () => {
              setIsLoading(true);
              await harvestPlant(activePlant.$id);
              setActivePlant(null);
              Alert.alert("Success", "Plant has been harvested!");
              setIsLoading(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error harvesting plant:", error);
      Alert.alert("Error", "Failed to harvest plant");
    }
  };

  const handleMarkAsDied = () => {
    console.log("handleMarkAsDied triggered", {
      activePlant: activePlant
        ? {
            $id: activePlant.$id,
            plantType: activePlant.plantType,
            currentStage: activePlant.currentStage,
            isActive: activePlant.isActive,
          }
        : null,
    });

    if (!activePlant) {
      console.log("No active plant found");
      return;
    }

    if (!activePlant.$id) {
      console.log("Invalid plant ID", activePlant);
      return;
    }

    setShowMarkAsDiedModal(true);
  };

  const confirmMarkAsDied = async (reason) => {
    console.log("confirmMarkAsDied started", {
      reason,
      plantId: activePlant?.$id,
      activePlant: activePlant
        ? {
            $id: activePlant.$id,
            plantType: activePlant.plantType,
            currentStage: activePlant.currentStage,
            isActive: activePlant.isActive,
          }
        : null,
    });

    if (!activePlant || !activePlant.$id) {
      console.error("Invalid plant data in confirmMarkAsDied");
      Alert.alert("Error", "Invalid plant data");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Setting loading state to true");

      console.log("Calling markPlantAsDied with:", {
        lifecycleId: activePlant.$id,
        reason: reason,
      });

      const result = await markPlantAsDied(activePlant.$id, reason);
      console.log("markPlantAsDied result:", result);

      // Clear the active plant
      setActivePlant(null);
      console.log("Active plant cleared");

      // Refresh the active plants list
      const session = await account.get();
      console.log("Got session:", session.$id);

      const plants = await getActivePlants(session.$id);
      console.log("Got active plants:", plants);

      const activePlantTypes = plants
        .map((plant) => {
          const plantType = Object.values(PLANT_TYPES).find(
            (type) => type.id === plant.id
          );
          return plantType || null;
        })
        .filter(Boolean);
      console.log("Mapped active plant types:", activePlantTypes);

      setActivePlants(activePlantTypes);
      console.log("Updated active plants state");

      // Clear schedules
      setSchedules([]);
      console.log("Cleared schedules");

      // Show success message
      Alert.alert(
        "Plant Marked as Died",
        "The plant has been marked as died and removed from active plants. You can now start growing a new plant.",
        [
          {
            text: "OK",
            onPress: () => {
              console.log("Showing plant modal");
              setShowPlantModal(true);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in confirmMarkAsDied:", {
        error,
        errorMessage: error.message,
        errorStack: error.stack,
      });
      Alert.alert(
        "Error",
        `Failed to mark plant as died: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
      console.log("Loading state cleared");
    }
  };

  const handleFertilizePlant = async () => {
    try {
      if (!activePlant) {
        setFertilizerStatusMessage({
          title: "Error",
          message: "No active plant to fertilize",
        });
        setShowFertilizerStatusModal(true);
        return;
      }

      setShowFertilizerConfirmModal(true);
    } catch (error) {
      console.error("Error in handleFertilizePlant:", error);
      setFertilizerStatusMessage({
        title: "Error",
        message: "Failed to process fertilizer request",
      });
      setShowFertilizerStatusModal(true);
    }
  };

  const handleFertilizerConfirm = async () => {
    try {
      setShowFertilizerConfirmModal(false);
      const response = await fetch("http://192.168.50.19/fertilizer/on");
      const data = await response.text();

      if (response.ok) {
        setFertilizerStatusMessage({
          title: "Success",
          message: "Applying fertilizer...",
        });
        setShowFertilizerStatusModal(true);

        // Start a timer to turn off the fertilizer after 30 seconds
        setTimeout(async () => {
          try {
            await fetch("http://192.168.50.19/fertilizer/off");
            setFertilizerStatusMessage({
              title: "Success",
              message: "Fertilizer application completed",
            });
            setShowFertilizerStatusModal(true);
          } catch (error) {
            console.error("Error turning off fertilizer:", error);
            setFertilizerStatusMessage({
              title: "Error",
              message: "Failed to stop fertilizer. Please check the system.",
            });
            setShowFertilizerStatusModal(true);
          }
        }, 30000);
      } else {
        if (data.includes("Soil is too wet")) {
          setFertilizerStatusMessage({
            title: "Cannot Apply Fertilizer",
            message:
              "The soil moisture is too high. Please wait for the soil to dry out before applying fertilizer.",
          });
        } else {
          throw new Error(data);
        }
        setShowFertilizerStatusModal(true);
      }
    } catch (error) {
      console.error("Error applying fertilizer:", error);
      setFertilizerStatusMessage({
        title: "Error",
        message: "Failed to apply fertilizer: " + error.message,
      });
      setShowFertilizerStatusModal(true);
    }
  };

  const renderActivePlantStatus = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#065F46" />
          <Text style={styles.loadingText}>Updating plant status...</Text>
        </View>
      );
    }

    if (!activePlant) return null;

    const plantTypeObj = Object.values(PLANT_TYPES).find(
      (type) => type.id === activePlant.plantType
    );

    if (!plantTypeObj) {
      console.error("Plant type not found:", activePlant.plantType);
      return null;
    }

    const plantWithType = {
      ...activePlant,
      plantType: plantTypeObj,
    };

    return (
      <View style={styles.activePlantStatus}>
        <View style={styles.plantHeader}>
          <View style={styles.plantInfo}>
            <Text style={styles.plantName}>{plantTypeObj.name}</Text>
            <Text style={styles.plantedDate}>
              Planted on {new Date(activePlant.plantedAt).toLocaleDateString()}
            </Text>
          </View>
          {activePlant.currentStage ===
            PLANT_LIFECYCLE_STAGES.HARVEST_READY && (
            <TouchableOpacity
              style={styles.harvestButton}
              onPress={handleHarvest}
            >
              <Text style={styles.harvestButtonIcon}>🌾</Text>
              <Text style={styles.harvestButtonText}>Harvest Now</Text>
            </TouchableOpacity>
          )}
        </View>

        <PlantGrowthProgress plant={plantWithType} />

        <View style={styles.plantActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFertilizePlant}
          >
            <Text style={styles.actionButtonIcon}>🌱</Text>
            <Text style={styles.actionButtonText}>Fertilize Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleMarkAsDied}
          >
            <Text style={styles.actionButtonIcon}>⚠️</Text>
            <Text style={styles.actionButtonText}>Mark as Died</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderActivePlantsSection = () => (
    <View style={styles.activePlantsSection}>
      <View style={styles.activePlantsHeader}>
        <Text style={styles.activePlantsTitle}>Your Active Plants</Text>
        <View style={styles.activePlantsCount}>
          <Text style={styles.activePlantsCountText}>
            {activePlants.length} Active
          </Text>
        </View>
      </View>

      <View style={styles.plantsGrid}>
        {activePlants.map((plant) => (
          <View key={plant.id} style={styles.plantCard}>
            <Text style={styles.plantIcon}>🌱</Text>
            <Text style={styles.plantName}>{plant.name}</Text>
            <Text style={styles.plantStage}>
              Stage: {plant.currentStage || "Seeding"}
            </Text>

            <View style={styles.plantProgress}>
              <View
                style={[
                  styles.plantProgressFill,
                  {
                    width: `${
                      (plant.daysGrown / plant.growthPeriod.total) * 100
                    }%`,
                  },
                ]}
              />
            </View>

            <View style={styles.plantStats}>
              <View style={styles.enhancedStatCard}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>🌱</Text>
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{plant.daysGrown || 0}</Text>
                  <Text style={styles.statLabel}>Days Growing</Text>
                </View>
              </View>

              <View style={styles.enhancedStatCard}>
                <View style={styles.statIconContainer}>
                  <Text style={styles.statIcon}>🎯</Text>
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>
                    {plant.growthPeriod.total - (plant.daysGrown || 0)}d
                  </Text>
                  <Text style={styles.statLabel}>Until Harvest</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const MarkAsDiedModal = () => {
    return (
      <Modal
        visible={showMarkAsDiedModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowMarkAsDiedModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.markAsDiedModalContent}>
            <View style={styles.modalHeaderWithClose}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Mark Plant as Died</Text>
                <Text style={styles.modalSubtitle}>
                  Select reason for plant death
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeIconButton}
                onPress={() => setShowMarkAsDiedModal(false)}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deathReasonContainer}>
              <TouchableOpacity
                style={styles.deathReasonButton}
                onPress={() => {
                  setShowMarkAsDiedModal(false);
                  confirmMarkAsDied("Disease/Pest Infestation");
                }}
              >
                <Text style={styles.deathReasonIcon}>🐛</Text>
                <View style={styles.deathReasonTextContainer}>
                  <Text style={styles.deathReasonTitle}>Disease/Pest</Text>
                  <Text style={styles.deathReasonDescription}>
                    Plant died due to disease or pest infestation
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deathReasonButton}
                onPress={() => {
                  setShowMarkAsDiedModal(false);
                  confirmMarkAsDied("Environmental Stress");
                }}
              >
                <Text style={styles.deathReasonIcon}>🌡️</Text>
                <View style={styles.deathReasonTextContainer}>
                  <Text style={styles.deathReasonTitle}>Environmental</Text>
                  <Text style={styles.deathReasonDescription}>
                    Died from environmental conditions
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deathReasonButton}
                onPress={() => {
                  setShowMarkAsDiedModal(false);
                  confirmMarkAsDied("Other/Unknown Causes");
                }}
              >
                <Text style={styles.deathReasonIcon}>❓</Text>
                <View style={styles.deathReasonTextContainer}>
                  <Text style={styles.deathReasonTitle}>Other/Unknown</Text>
                  <Text style={styles.deathReasonDescription}>
                    Other or unknown reasons
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Plant Care Scheduler</Text>

        {isConnecting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#065F46" />
            <Text style={styles.loadingText}>
              Connecting to plant care system...
            </Text>
          </View>
        ) : !isConnected ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Not connected to plant care system
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={checkConnection}
            >
              <Text style={styles.retryButtonText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.contentContainer}>
            {renderActivePlantStatus()}

            <TouchableOpacity
              style={[
                styles.addButton,
                !activePlant
                  ? styles.addButtonEnabled
                  : styles.addButtonDisabled,
              ]}
              onPress={() => setShowPlantModal(true)}
              disabled={!!activePlant}
            >
              <Text style={styles.addButtonText}>
                {activePlant
                  ? "Harvest Current Plant First"
                  : "Start Growing New Plant"}
              </Text>
            </TouchableOpacity>

            {renderActivePlantsSection()}

            <View style={styles.careDetailsSection}>
              <Text style={styles.sectionTitle}>Plant Care Details</Text>
              {activePlants.map((plant) => (
                <PlantCareDetails key={plant.id} plantType={plant} />
              ))}
            </View>

            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              {schedules.map(renderScheduleItem)}
            </View>
          </View>
        )}

        <PlantTypeModal
          visible={showPlantModal}
          onClose={() => setShowPlantModal(false)}
          onSelectPlant={addPlantSchedules}
        />
        <MarkAsDiedModal />
        <FertilizerModal
          isConfirmation={true}
          visible={showFertilizerConfirmModal}
          onClose={() => setShowFertilizerConfirmModal(false)}
          onConfirm={handleFertilizerConfirm}
          title="Confirm Fertilizer Application"
          message="Are you sure you want to apply fertilizer now?"
        />

        <FertilizerModal
          isConfirmation={false}
          visible={showFertilizerStatusModal}
          onClose={() => setShowFertilizerStatusModal(false)}
          title={fertilizerStatusMessage.title}
          message={fertilizerStatusMessage.message}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Schedule;
