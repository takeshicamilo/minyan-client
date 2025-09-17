import { Dimensions, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define breakpoints
export const BREAKPOINTS = {
  xs: 0,     // Extra small devices (phones in portrait)
  sm: 480,   // Small devices (phones in landscape, small tablets)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (large tablets, small laptops)
  xl: 1200,  // Extra large devices (laptops, desktops)
} as const;

// Screen size categories
export const getScreenSize = () => {
  if (SCREEN_WIDTH >= BREAKPOINTS.xl) return 'xl';
  if (SCREEN_WIDTH >= BREAKPOINTS.lg) return 'lg';
  if (SCREEN_WIDTH >= BREAKPOINTS.md) return 'md';
  if (SCREEN_WIDTH >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

// Check if device is tablet
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  }
  
  return (
    (SCREEN_WIDTH >= BREAKPOINTS.md && SCREEN_HEIGHT >= BREAKPOINTS.md) ||
    (SCREEN_WIDTH >= 600 && SCREEN_HEIGHT >= 600)
  );
};

// Check if device is in landscape
export const isLandscape = () => SCREEN_WIDTH > SCREEN_HEIGHT;

// Get responsive value based on screen size
export const getResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T;
}): T => {
  const screenSize = getScreenSize();
  return values[screenSize] ?? values.default;
};

// Scale font size based on screen size
export const getResponsiveFontSize = (baseSize: number): number => {
  const scale = getResponsiveValue({
    xs: 0.85,
    sm: 0.9,
    md: 1,
    lg: 1.1,
    xl: 1.2,
    default: 1,
  });
  
  return Math.round(baseSize * scale);
};

// Get responsive padding/margin
export const getResponsiveSpacing = (baseSpacing: number): number => {
  const scale = getResponsiveValue({
    xs: 0.8,
    sm: 0.9,
    md: 1,
    lg: 1.2,
    xl: 1.4,
    default: 1,
  });
  
  return Math.round(baseSpacing * scale);
};

// Get responsive width (useful for containers)
export const getResponsiveWidth = (percentage: number): number => {
  return SCREEN_WIDTH * (percentage / 100);
};

// Get max width for content containers
export const getMaxContentWidth = (): number => {
  return getResponsiveValue({
    xs: SCREEN_WIDTH - 32, // 16px margin on each side
    sm: SCREEN_WIDTH - 48, // 24px margin on each side
    md: 600, // Fixed max width for tablets
    lg: 480, // Narrower for better readability on large screens
    xl: 420, // Even narrower for very large screens
    default: SCREEN_WIDTH - 32,
  });
};

// Screen dimensions
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallScreen: SCREEN_WIDTH < BREAKPOINTS.sm,
  isMediumScreen: SCREEN_WIDTH >= BREAKPOINTS.sm && SCREEN_WIDTH < BREAKPOINTS.md,
  isLargeScreen: SCREEN_WIDTH >= BREAKPOINTS.md,
  isTablet: isTablet(),
  isLandscape: isLandscape(),
};

// Get responsive border radius
export const getResponsiveBorderRadius = (baseRadius: number): number => {
  const scale = getResponsiveValue({
    xs: 0.8,
    sm: 0.9,
    md: 1,
    lg: 1.1,
    xl: 1.2,
    default: 1,
  });
  
  return Math.round(baseRadius * scale);
};

// Get responsive icon size
export const getResponsiveIconSize = (baseSize: number): number => {
  const scale = getResponsiveValue({
    xs: 0.9,
    sm: 0.95,
    md: 1,
    lg: 1.1,
    xl: 1.2,
    default: 1,
  });
  
  return Math.round(baseSize * scale);
};
