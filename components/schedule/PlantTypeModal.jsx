import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import { PLANT_TYPES } from "../../constants/plantTypes";
import { theme } from "../../constants/theme";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { getPlantIcon } from "../../constants/theme";

const CareCustomizationForm = ({ plantType, onSubmit, onCancel }) => {
  const [settings, setSettings] = useState({
    wateringFrequency:
      plantType?.stageRequirements?.seeding?.wateringFrequency || 1,
    wateringDuration:
      plantType?.stageRequirements?.seeding?.wateringDuration || 30,
    fertilizingFrequency:
      plantType?.stageRequirements?.seeding?.fertilizingFrequency || 7,
    moistureThreshold: plantType?.stageRequirements?.seeding?.moisture || 70,
    phThresholdMin: plantType?.stageRequirements?.seeding?.ph?.min || 5.5,
    phThresholdMax: plantType?.stageRequirements?.seeding?.ph?.max || 7.5,
  });

  return (
    <ScrollView style={styles.customCareForm}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Watering Frequency (days)</Text>
        <TextInput
          style={styles.input}
          value={String(settings.wateringFrequency)}
          onChangeText={(value) =>
            setSettings((prev) => ({
              ...prev,
              wateringFrequency: parseInt(value) || 1,
            }))
          }
          keyboardType="numeric"
          placeholder="Enter watering frequency"
          placeholderTextColor={theme.colors.textTertiary}
        />
        <Text style={styles.suggestion}>
          Recommended:{" "}
          {plantType?.stageRequirements?.seeding?.wateringFrequency} days
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Watering Duration (seconds)</Text>
        <TextInput
          style={styles.input}
          value={String(settings.wateringDuration)}
          onChangeText={(value) =>
            setSettings((prev) => ({
              ...prev,
              wateringDuration: parseInt(value) || 30,
            }))
          }
          keyboardType="numeric"
          placeholder="Enter watering duration"
          placeholderTextColor={theme.colors.textTertiary}
        />
        <Text style={styles.suggestion}>
          Recommended: {plantType?.stageRequirements?.seeding?.wateringDuration}{" "}
          seconds
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fertilizing Frequency (days)</Text>
        <TextInput
          style={styles.input}
          value={String(settings.fertilizingFrequency)}
          onChangeText={(value) =>
            setSettings((prev) => ({
              ...prev,
              fertilizingFrequency: parseInt(value) || 7,
            }))
          }
          keyboardType="numeric"
          placeholder="Enter fertilizing frequency"
          placeholderTextColor={theme.colors.textTertiary}
        />
        <Text style={styles.suggestion}>
          Recommended:{" "}
          {plantType?.stageRequirements?.seeding?.fertilizingFrequency} days
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Moisture Threshold (%)</Text>
        <TextInput
          style={styles.input}
          value={String(settings.moistureThreshold)}
          onChangeText={(value) =>
            setSettings((prev) => ({
              ...prev,
              moistureThreshold: parseInt(value) || 70,
            }))
          }
          keyboardType="numeric"
          placeholder="Enter moisture threshold"
          placeholderTextColor={theme.colors.textTertiary}
        />
        <Text style={styles.suggestion}>
          Recommended: {plantType?.stageRequirements?.seeding?.moisture}%
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>pH Range</Text>
        <View style={styles.phInputContainer}>
          <TextInput
            style={[styles.input, styles.phInput]}
            value={String(settings.phThresholdMin)}
            onChangeText={(value) =>
              setSettings((prev) => ({
                ...prev,
                phThresholdMin: parseFloat(value) || 5.5,
              }))
            }
            keyboardType="numeric"
            placeholder="Min"
            placeholderTextColor={theme.colors.textTertiary}
          />
          <Text style={styles.phSeparator}>-</Text>
          <TextInput
            style={[styles.input, styles.phInput]}
            value={String(settings.phThresholdMax)}
            onChangeText={(value) =>
              setSettings((prev) => ({
                ...prev,
                phThresholdMax: parseFloat(value) || 7.5,
              }))
            }
            keyboardType="numeric"
            placeholder="Max"
            placeholderTextColor={theme.colors.textTertiary}
          />
        </View>
        <Text style={styles.suggestion}>
          Recommended: {plantType?.stageRequirements?.seeding?.ph?.min} -{" "}
          {plantType?.stageRequirements?.seeding?.ph?.max}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button variant="secondary" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={() => onSubmit(settings)}
          style={styles.button}
        >
          Apply Settings
        </Button>
      </View>
    </ScrollView>
  );
};

const PlantTypeModal = ({ visible, onClose, onSelectPlant }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [showVarieties, setShowVarieties] = useState(false);
  const [showCareCustomization, setShowCareCustomization] = useState(false);

  const handleSelectPlant = (plantType, customCare = null) => {
    onSelectPlant(plantType, customCare);
    setSelectedType(null);
    setShowVarieties(false);
    setShowCareCustomization(false);
  };

  const renderPlantTypeList = () => (
    <>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Select Plant Type</Text>
        <Text style={styles.modalSubtitle}>
          Choose a plant type to start growing
        </Text>
      </View>

      <ScrollView style={styles.plantList}>
        {Object.values(PLANT_TYPES).map((plant) => (
          <Card
            key={plant.id}
            variant="outlined"
            style={styles.plantCard}
            onPress={() => {
              if (plant && plant.id) {
                setSelectedType(plant);
                setShowVarieties(true);
              }
            }}
          >
            <View style={styles.plantIconContainer}>
              <Text style={styles.plantIcon}>{getPlantIcon(plant?.type)}</Text>
            </View>
            <View style={styles.plantInfo}>
              <Text style={styles.plantName}>
                {plant?.name || "Unknown Plant"}
              </Text>
              <Text style={styles.plantDescription}>
                {plant?.description || "No description available"}
              </Text>
              <View style={styles.plantStats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Growth Period</Text>
                  <Text style={styles.statValue}>
                    {plant?.growthPeriod?.total || 0} days
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Varieties</Text>
                  <Text style={styles.statValue}>
                    {plant?.examples?.length || 0}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </>
  );

  const renderVarieties = () => (
    <>
      <View style={styles.modalHeader}>
        <View style={styles.headerWithBack}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowVarieties(false)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {selectedType?.name || "Unknown Plant"} Varieties
          </Text>
        </View>
        <Text style={styles.modalSubtitle}>
          Select a variety to customize care
        </Text>
      </View>

      <ScrollView style={styles.varietiesList}>
        {selectedType?.examples.map((variety, index) => (
          <Card
            key={index}
            variant="outlined"
            style={styles.varietyCard}
            onPress={() => {
              if (selectedType) {
                setShowVarieties(false);
                setShowCareCustomization(true);
              }
            }}
          >
            <View style={styles.varietyIconContainer}>
              <Text style={styles.varietyIcon}>
                {getPlantIcon(selectedType?.type)}
              </Text>
            </View>
            <Text style={styles.varietyName}>
              {variety || "Unknown Variety"}
            </Text>
            {index === 0 && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Popular</Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </>
  );

  const renderCareCustomization = () => (
    <>
      <View style={styles.modalHeader}>
        <View style={styles.headerWithBack}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowCareCustomization(false)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Customize Care</Text>
        </View>
        <Text style={styles.modalSubtitle}>
          {selectedType?.name || "Unknown Plant"}
        </Text>
      </View>

      <CareCustomizationForm
        plantType={selectedType}
        onSubmit={(settings) => handleSelectPlant(selectedType, settings)}
        onCancel={() => setShowCareCustomization(false)}
      />
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {!showVarieties && !showCareCustomization
            ? renderPlantTypeList()
            : showVarieties
            ? renderVarieties()
            : renderCareCustomization()}

          <Button
            variant="secondary"
            onPress={onClose}
            fullWidth
            style={styles.closeButton}
          >
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    padding: theme.spacing.lg,
  },
  modalHeader: {
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    ...theme.typography.h2,
    textAlign: "center",
  },
  modalSubtitle: {
    ...theme.typography.caption,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  headerWithBack: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backButtonText: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  plantList: {
    flex: 1,
  },
  plantCard: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  plantIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  plantIcon: {
    fontSize: theme.fontSize.xxl,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  plantDescription: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.sm,
  },
  plantStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    ...theme.typography.caption,
  },
  statValue: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  varietiesList: {
    flex: 1,
  },
  varietyCard: {
    alignItems: "center",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  varietyIconContainer: {
    marginBottom: theme.spacing.sm,
  },
  varietyIcon: {
    fontSize: theme.fontSize.xxxl,
  },
  varietyName: {
    ...theme.typography.body,
    textAlign: "center",
  },
  popularBadge: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  popularBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.white,
  },
  careOptions: {
    padding: theme.spacing.lg,
  },
  orText: {
    ...theme.typography.body,
    textAlign: "center",
    marginVertical: theme.spacing.md,
  },
  closeButton: {
    marginTop: theme.spacing.lg,
  },
  customCareForm: {
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.caption,
    marginBottom: theme.spacing.xs,
  },
  input: {
    ...theme.typography.body,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  suggestion: {
    ...theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  phInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phInput: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  phSeparator: {
    ...theme.typography.caption,
    marginHorizontal: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
  },
  button: {
    flex: 1,
  },
});

export default PlantTypeModal;
