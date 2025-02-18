import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { scheduleStyles as styles } from "../../styles/scheduleStyles";
import { PlantTypeCard } from "./PlantTypeCard";
import { CareCustomizationModal } from "./CareCustomizationModal";
import PropTypes from "prop-types";
import { PLANT_TYPES } from "../../../constants/plantTypes";

export default function PlantTypeModal({ visible, onClose, onSelectPlant }) {
  const [selectedPlantType, setSelectedPlantType] = useState(null);
  const [showCareModal, setShowCareModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlantTypes = PLANT_TYPES.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlantSelect = (plant) => {
    setSelectedPlantType(plant);
    setShowCareModal(true);
  };

  const handleCareSubmit = (customCare) => {
    setShowCareModal(false);
    onSelectPlant(selectedPlantType, customCare);
    setSelectedPlantType(null);
    onClose();
  };

  const handleCareCancel = () => {
    setShowCareModal(false);
    setSelectedPlantType(null);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.enhancedModalContent}>
            <View style={styles.enhancedModalHeader}>
              <Text style={styles.enhancedModalTitle}>Select Plant Type</Text>
              <Text style={styles.enhancedPlantTypeName}>
                Choose a plant to start growing
              </Text>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search plants..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView style={styles.plantTypeList}>
              {filteredPlantTypes.map((plant) => (
                <PlantTypeCard
                  key={plant.type}
                  plant={plant}
                  onSelect={handlePlantSelect}
                />
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.enhancedSecondaryButton}
              onPress={onClose}
            >
              <Text style={styles.enhancedSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CareCustomizationModal
        visible={showCareModal}
        plantType={selectedPlantType}
        onSubmit={handleCareSubmit}
        onCancel={handleCareCancel}
      />
    </>
  );
}

PlantTypeModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectPlant: PropTypes.func.isRequired,
};
