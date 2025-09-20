/**
 * Comprehensive Chart Color System
 * Provides consistent, accessible color palettes for data visualization
 */

export const chartColorPalettes = {
  revenue: [
    '#6366f1', // Indigo - Modern & Professional
    '#06b6d4', // Cyan - Fresh & Energetic
    '#22c55e', // Bright Green - Fresh & Positive
    '#f59e0b', // Amber - Warm & Inviting
    '#f43f5e', // Rose Red - Modern & Bold
  ],
  growth: [
    '#a855f7', // Purple - Creative & Bold
    '#c084fc', // Light Purple
    '#e879f9', // Pink
    '#f0abfc', // Light Pink
    '#fbbf24', // Golden Yellow
  ],
  users: [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#2563eb', // Darker Blue
    '#1d4ed8', // Even Darker Blue
    '#1e40af', // Dark Blue
  ],
  categorical: [
    '#6366f1', // Indigo - Primary
    '#a855f7', // Purple - Secondary
    '#06b6d4', // Cyan - Tertiary
    '#22c55e', // Green - Success
    '#f59e0b', // Amber - Warning
    '#f43f5e', // Rose - Danger
    '#3b82f6', // Blue - Info
    '#fbbf24', // Golden - Accent
  ],
  gradient: {
    success: 'linear-gradient(135deg, #22c55e, #16a34a)',
    info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
    danger: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  }
};

/**
 * Get status color based on value and thresholds
 */
export const getStatusColor = (
  value: number, 
  thresholds: { excellent: number, good: number, warning: number }
): string => {
  if (value >= thresholds.excellent) return 'gradient-success';
  if (value >= thresholds.good) return 'gradient-info';
  if (value >= thresholds.warning) return 'gradient-warning';
  return 'gradient-danger';
};

/**
 * Get color for chart data point based on index
 */
export const getChartColor = (index: number, palette: keyof typeof chartColorPalettes = 'categorical'): string => {
  const colors = chartColorPalettes[palette];
  
  // Check if colors is an array (not the gradient object)
  if (Array.isArray(colors)) {
    const color = colors[index % colors.length];
    return color || colors[0] || '#6366f1'; // Fallback to first color or default
  }
  
  // If it's the gradient object, return the first gradient value
  // This is a fallback - ideally gradient palettes shouldn't be used with this function
  const gradientValues = Object.values(colors);
  return gradientValues[0] || '#6366f1'; // Fallback to default color
};

/**
 * Generate gradient fill for area charts
 */
export const getGradientFill = (color: string, opacity: number = 0.3): string => {
  return `linear-gradient(180deg, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent)`;
};

/**
 * Get hover color (slightly lighter version)
 */
export const getHoverColor = (color: string): string => {
  // Simple implementation - in a real app, you might use a color manipulation library
  return color + '80'; // Add 50% opacity
};

/**
 * Color blind friendly palette - Modern
 */
export const colorBlindFriendlyPalette = [
  '#1976d2', // Deep Blue
  '#f57c00', // Deep Orange
  '#7b1fa2', // Deep Purple
  '#388e3c', // Forest Green
  '#d32f2f', // Deep Red
  '#fbc02d', // Golden Yellow
  '#5d4037', // Brown
  '#455a64', // Blue Grey
];

/**
 * High contrast palette for accessibility - Enhanced
 */
export const highContrastPalette = [
  '#0000ff', // Bright Blue
  '#ff0000', // Bright Red
  '#00ff00', // Bright Green
  '#ffff00', // Bright Yellow
  '#ff00ff', // Bright Magenta
  '#00ffff', // Bright Cyan
  '#ff8000', // Bright Orange
  '#8000ff', // Bright Purple
];

/**
 * Get appropriate palette based on user preferences
 */
export const getAccessiblePalette = (isColorBlind: boolean = false, isHighContrast: boolean = false): string[] => {
  if (isHighContrast) return highContrastPalette;
  if (isColorBlind) return colorBlindFriendlyPalette;
  return chartColorPalettes.categorical;
};

/**
 * Chart theme configuration
 */
export interface ChartTheme {
  colors: string[];
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  tooltipBackground: string;
  tooltipBorder: string;
}

export const getChartTheme = (isDark: boolean = true): ChartTheme => ({
  colors: chartColorPalettes.categorical,
  backgroundColor: isDark ? 'var(--surface-0)' : 'var(--light-surface-0)',
  textColor: isDark ? 'var(--text-primary)' : 'var(--light-text-primary)',
  gridColor: isDark ? 'var(--surface-3)' : 'var(--light-surface-3)',
  tooltipBackground: isDark ? 'var(--surface-2)' : 'var(--light-surface-2)',
  tooltipBorder: isDark ? 'var(--surface-3)' : 'var(--light-surface-3)',
});

/**
 * Generate CSS custom properties for chart colors
 */
export const generateChartCSSVariables = (): string => {
  return Object.entries(chartColorPalettes)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((color, index) => `--chart-${key}-${index}: ${color};`).join('\n');
      }
      return `--chart-${key}: ${value};`;
    })
    .join('\n');
};
