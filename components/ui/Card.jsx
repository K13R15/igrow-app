import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

const Card = ({
  children,
  variant = "default",
  padding = "md",
  style,
  onPress,
  ...props
}) => {
  const getPaddingStyle = () => {
    switch (padding) {
      case "sm":
        return { padding: theme.spacing.sm };
      case "lg":
        return { padding: theme.spacing.lg };
      case "none":
        return { padding: 0 };
      default:
        return { padding: theme.spacing.md };
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "elevated":
        return styles.elevated;
      case "outlined":
        return styles.outlined;
      default:
        return styles.default;
    }
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[styles.card, getPaddingStyle(), getVariantStyle(), style]}
      onPress={onPress}
      {...props}
    >
      {children}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  default: {
    backgroundColor: theme.colors.cardBackground,
  },
  elevated: {
    backgroundColor: theme.colors.cardBackground,
    ...theme.shadows.medium,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

export default Card;
