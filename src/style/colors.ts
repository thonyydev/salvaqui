/**
 * Salvaqui Design System
 *
 * Centralized color tokens for the application.
 * Supports dark and light themes.
 */

const palette = {
  indigo: "#5865F2",
  indigoDark: "#4652D8",
  indigoLight: "#A5B4FC",

  violet: "#8B5CF6",
  pink: "#EC4899",
  amber: "#F59E0B",
  cyan: "#0EA5E9",
  teal: "#14B8A6",

  green: "#22C55E",
  red: "#EF4444",

  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

/**
 * Colors representing saved content types.
 */
export const ContentColors = {
  link: "#818CF8",
  image: "#F472B6",
  video: "#A78BFA",
  note: "#FBBF24",
  file: "#38BDF8",
  collection: "#2DD4BF",
} as const;

/**
 * Semantic color tokens.
 */
export const Colors = {
  dark: {
    brand: {
      primary: palette.indigo,
      pressed: palette.indigoDark,
      secondary: palette.violet,
      subtle: "#202548",
      onPrimary: palette.white,
    },

    background: {
      primary: "#0B0D12",
      secondary: "#11141B",
      tertiary: "#171A23",
    },

    surface: {
      primary: "#171A23",
      secondary: "#1D212C",
      elevated: "#242936",
      pressed: "#2D3342",
    },

    text: {
      primary: "#F8FAFC",
      secondary: "#A1A8B8",
      tertiary: "#737C90",
      disabled: "#596173",
      inverse: "#0B0D12",
      link: palette.indigoLight,
      onBrand: palette.white,
    },

    border: {
      default: "#292E3B",
      subtle: "#202531",
      strong: "#41485A",
      focus: palette.indigo,
    },

    icon: {
      primary: "#F8FAFC",
      secondary: "#A1A8B8",
      muted: "#737C90",
      active: "#A5B4FC",
    },

    button: {
      primary: palette.indigo,
      primaryPressed: palette.indigoDark,
      secondary: "#242936",
      secondaryPressed: "#303748",
      ghostPressed: "#202531",
      disabled: "#292E3B",
      disabledText: "#737C90",
    },

    input: {
      background: "#171A23",
      border: "#303645",
      borderFocus: palette.indigo,
      placeholder: "#737C90",
      disabled: "#12151C",
    },

    card: {
      background: "#171A23",
      border: "#292E3B",
      highlighted: "#202548",
    },

    status: {
      success: "#4ADE80",
      successBackground: "#10281C",

      warning: "#FBBF24",
      warningBackground: "#30230D",

      error: "#FB7185",
      errorBackground: "#351A23",

      info: "#93C5FD",
      infoBackground: "#17263F",
    },

    navigation: {
      background: "#11141B",
      active: "#A5B4FC",
      inactive: "#737C90",
      border: "#292E3B",
    },

    favorite: "#FBBF24",

    separator: "#292E3B",

    skeleton: {
      base: "#1D212C",
      highlight: "#2D3342",
    },

    overlay: "rgba(0, 0, 0, 0.70)",
    shadow: "rgba(0, 0, 0, 0.35)",

    content: ContentColors,
  },

  light: {
    brand: {
      primary: palette.indigo,
      pressed: palette.indigoDark,
      secondary: palette.violet,
      subtle: "#EEF0FF",
      onPrimary: palette.white,
    },

    background: {
      primary: "#FFFFFF",
      secondary: "#F8F9FC",
      tertiary: "#F0F2F7",
    },

    surface: {
      primary: "#FFFFFF",
      secondary: "#F6F7FB",
      elevated: "#FFFFFF",
      pressed: "#E9ECF4",
    },

    text: {
      primary: "#111827",
      secondary: "#5D6575",
      tertiary: "#717B8D",
      disabled: "#A0A7B5",
      inverse: "#FFFFFF",
      link: palette.indigoDark,
      onBrand: palette.white,
    },

    border: {
      default: "#E4E7EF",
      subtle: "#EEF0F5",
      strong: "#CBD1DD",
      focus: palette.indigo,
    },

    icon: {
      primary: "#111827",
      secondary: "#647084",
      muted: "#8D97A8",
      active: palette.indigo,
    },

    button: {
      primary: palette.indigo,
      primaryPressed: palette.indigoDark,
      secondary: "#EEF0F7",
      secondaryPressed: "#E0E4EF",
      ghostPressed: "#F0F2F7",
      disabled: "#E4E7EF",
      disabledText: "#8D97A8",
    },

    input: {
      background: "#F8F9FC",
      border: "#DCE1EA",
      borderFocus: palette.indigo,
      placeholder: "#8D97A8",
      disabled: "#F0F2F7",
    },

    card: {
      background: "#FFFFFF",
      border: "#E4E7EF",
      highlighted: "#F1F2FF",
    },

    status: {
      success: "#15803D",
      successBackground: "#ECFDF3",

      warning: "#B45309",
      warningBackground: "#FFFBEB",

      error: "#DC2626",
      errorBackground: "#FEF2F2",

      info: "#2563EB",
      infoBackground: "#EFF6FF",
    },

    navigation: {
      background: "#FFFFFF",
      active: palette.indigo,
      inactive: "#8D97A8",
      border: "#E4E7EF",
    },

    favorite: "#D97706",

    separator: "#E4E7EF",

    skeleton: {
      base: "#E9ECF2",
      highlight: "#F6F7FB",
    },

    overlay: "rgba(15, 23, 42, 0.50)",
    shadow: "rgba(15, 23, 42, 0.10)",

    content: ContentColors,
  },
} as const;

/**
 * Available theme names.
 */
export type ColorScheme = keyof typeof Colors;

/**
 * Theme token type.
 */
export type AppColors = (typeof Colors)[ColorScheme];

/**
 * Default app theme.
 *
 * Change to Colors.light to use light mode.
 */
export const colors: AppColors = Colors.dark;

export { palette };
