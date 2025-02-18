import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { scheduleStyles as styles } from '../../styles/scheduleStyles';
import { getPlantIcon } from '../../utils/plantHelpers';
import PropTypes from 'prop-types';

export const PlantTypeCard = ({ plant, onSelect }) => (
  <TouchableOpacity
    style={styles.plantTypeCard}
    onPress={() => onSelect(plant)}
  >
    <View style={styles.plantTypeIconContainer}>
      <Text style={styles.plantTypeIcon}>{getPlantIcon(plant.type)}</Text>
    </View>
    <View style={styles.plantTypeInfo}>
      <Text style={styles.plantTypeName}>{plant.name}</Text>
      <Text style={styles.plantTypeDescription}>{plant.description}</Text>
      <View style={styles.plantTypeStats}>
        <View style={styles.plantTypeStat}>
          <Text style={styles.plantTypeStatLabel}>Growth</Text>
          <Text style={styles.plantTypeStatValue}>
            {plant.growthPeriod.total} days
          </Text>
        </View>
        <View style={styles.plantTypeStat}>
          <Text style={styles.plantTypeStatLabel}>Varieties</Text>
          <Text style={styles.plantTypeStatValue}>{plant.examples.length}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// Add PropTypes for better development experience
PlantTypeCard.propTypes = {
  plant: PropTypes.shape({
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    growthPeriod: PropTypes.shape({
      total: PropTypes.number.isRequired,
    }).isRequired,
    examples: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
}; 