import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { scheduleStyles as styles } from "../../styles/scheduleStyles";
import PropTypes from "prop-types";

export const CareCustomizationModal = ({
  visible,
  plantType,
  onSubmit,
  onCancel,
}) => {
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
          <View style={styles.enhancedModalHeader}>
            <Text style={styles.enhancedModalTitle}>Plant Care Setup</Text>
            <Text style={styles.enhancedPlantTypeName}>{plantType?.name}</Text>
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
                        wateringFrequency: parseInt(value) || 1,
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
                        wateringDuration: parseInt(value) || 30,
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
                        fertilizingFrequency: parseInt(value) || 7,
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
                        moistureThreshold: parseInt(value) || 70,
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

          <View style={styles.enhancedModalFooter}>
            <TouchableOpacity
              style={styles.enhancedSecondaryButton}
              onPress={onCancel}
            >
              <Text style={styles.enhancedSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.enhancedPrimaryButton}
              onPress={() => onSubmit(useDefaultCare ? null : customCare)}
            >
              <Text style={styles.enhancedPrimaryButtonText}>
                Start Growing
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

CareCustomizationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
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
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
