// Elevations - box shadows (Light & Dark)

export default {
  light: {
    xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    base: "0 1px 4px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    lg: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    xl: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  dark: {
    xs: "0 1px 2px 0 rgba(255, 255, 255, 0.07)",
    sm: "0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)",
    base: "0 1px 4px 0 rgba(255, 255, 255, 0.12), 0 2px 4px 0 rgba(255, 255, 255, 0.08)",
    lg: "0 4px 6px -1px rgba(255, 255, 255, 0.15), 0 2px 4px -1px rgba(255, 255, 255, 0.1)",
    xl: "0 10px 15px -3px rgba(255, 255, 255, 0.2), 0 4px 6px -2px rgba(255, 255, 255, 0.12)",
  },
} as const;
