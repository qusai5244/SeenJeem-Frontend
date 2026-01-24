// Izki Club Brand Colors
export const IZKI_COLORS = {
  primary: '#7A1E3A',      // Burgundy / Maroon - Main brand color
  secondary: '#8B1F3F',    // Deep Maroon - Gradients & highlights
  accent: '#C2B178',       // Gold / Beige - Prestige & contrast
  lightAccent: '#E6D8A3',  // Soft Gold - Icons & separators
  background: '#FFFFFF',   // White - Clean sections
  darkBg: '#2F2F2F',       // Charcoal - Footer / overlays
  lightMaroonBg: '#F6ECEF', // Light maroon tint for sections
  text: {
    primary: '#2F2F2F',
    secondary: '#666666',
    light: '#FFFFFF',
  },
} as const;

// Gradient definitions
export const IZKI_GRADIENTS = {
  maroon: `linear-gradient(135deg, ${IZKI_COLORS.primary} 0%, ${IZKI_COLORS.secondary} 100%)`,
  gold: `linear-gradient(135deg, ${IZKI_COLORS.accent} 0%, ${IZKI_COLORS.lightAccent} 100%)`,
  maroonVertical: `linear-gradient(180deg, ${IZKI_COLORS.primary} 0%, ${IZKI_COLORS.secondary} 100%)`,
} as const;

// Typography
export const IZKI_FONTS = {
  arabic: '"Cairo", "Tajawal", sans-serif',
  english: '"Poppins", "Montserrat", sans-serif',
} as const;







