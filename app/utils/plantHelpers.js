export const calculateStageProgress = (stage, daysGrown, growthPeriod) => {
  if (!stage || !growthPeriod || typeof growthPeriod !== "object") {
    return 0;
  }

  let daysBeforeStage = 0;
  let found = false;

  try {
    for (const [key, days] of Object.entries(growthPeriod)) {
      if (key === stage) {
        found = true;
        const stageProgress = Math.min(
          Math.max((((daysGrown || 0) - daysBeforeStage) / days) * 100, 0),
          100
        );
        return stageProgress;
      }
      if (!found && key !== "total") {
        daysBeforeStage += days;
      }
    }
  } catch (error) {
    console.error("Error calculating stage progress:", error);
    return 0;
  }

  return 0;
};

export const getStageIcon = (stage) => {
  switch (stage.toLowerCase()) {
    case "seeding":
      return "🌱";
    case "vegetative":
      return "🌿";
    case "flowering":
      return "🌸";
    default:
      return "🌱";
  }
};

export const getPlantIcon = (type) => {
  if (!type) return "🌱";

  switch (type.toLowerCase()) {
    case "leafy":
      return "🥬";
    case "fruiting":
      return "🍅";
    case "root":
      return "🥕";
    case "legume":
      return "🫘";
    case "brassica":
      return "🥦";
    default:
      return "🌱";
  }
};

export const formatPhTime = (date) => {
  if (!date) return "";

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(date).toLocaleString("en-PH", options);
};
