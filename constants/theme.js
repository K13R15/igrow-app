export const theme = {
  colors: {
    primary: "#065F46",
    secondary: "#374151",
    background: "#161622",
    cardBackground: "#1F2937",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    textTertiary: "#6B7280",
    success: "#059669",
    danger: "#DC2626",
    warning: "#D97706",
    border: "#374151",
    white: "#FFFFFF",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  shadows: {
    small: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  },

  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    h3: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    body: {
      fontSize: 16,
      color: "#FFFFFF",
    },
    caption: {
      fontSize: 14,
      color: "#9CA3AF",
    },
  },

  layout: {
    containerPadding: 16,
    maxContentWidth: 1200,
  },
};

export const getStageIcon = (stage) => {
  const icons = {
    seeding: "🌱",
    vegetative: "🌿",
    flowering: "🌸",
    default: "🌱",
  };
  return icons[stage.toLowerCase()] || icons.default;
};

export const getPlantIcon = (type) => {
  if (!type) return "🌱"; // Return default icon if type is undefined

  const icons = {
    leafy: "🥬",
    fruiting: "🍅",
    root: "🥕",
    legume: "🫘",
    brassica: "🥦",
    default: "🌱",
  };
  return icons[type.toLowerCase()] || icons.default;
};
