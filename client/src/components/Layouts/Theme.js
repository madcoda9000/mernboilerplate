// 1. import `extendTheme` function
import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const themeName = "brand.tertiary";
const themeLightBgColor = themeName + ".500";
const themeDarkBgColor = themeName + ".900";
const themeHover = themeName + ".700";

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
  initialColorScheme: themeName,
  semanticTokens: {
    colors: {
      defaultBg: {
        default: themeLightBgColor,
        _dark: themeDarkBgColor,
      },
      sidebarBg: {
        default: "brand.primary.900",
        _dark: "brand.primary.400",
      },
      btnText: {
        default: "white",
        _dark: "white",
      },
      btnPrimary: {
        default: "brand.primary.900",
        _dark: "brand.primary.900",
      },
      btnSecondary: {
        default: "brand.secondary.900",
        _dark: "brand.secondary.500",
      },
    },
  },
  colors: {
    brand: {
      primary: {
        50: "#e2e3e9",
        100: "#b6bacb",
        200: "#878ea7",
        300: "#5c6585",
        400: "#3d486f",
        500: "#1d2c5a",
        600: "#182753",
        700: "#111f4a",
        800: "#09173e",
        900: "#040128",
      },
      secondary: {
        50: "#ffeaf0",
        100: "#ffcbd6",
        200: "#f7959f",
        300: "#f06a79",
        400: "#fd3e57",
        500: "#ff193d",
        600: "#f5023c",
        700: "#e30035",
        800: "#d6002e",
        900: "#c80020",
      },
      tertiary: {
        50: "#def6f0",
        100: "#ade7d8",
        200: "#73d8bf",
        300: "#1ec8a5",
        400: "#00ba91",
        500: "#00ac80",
        600: "#009e73",
        700: "#008d63",
        800: "#007c55",
        900: "#005f38",
      },
      info: {
        50: "#e3f2fd",
        100: "#bbdefb",
        200: "#90caf9",
        300: "#64b5f6",
        400: "#42a5f5",
        500: "#2196f3",
        600: "#1e88e5",
        700: "#1976d2",
        800: "#1565c0",
        900: "#0d47a1",
      },
      warning: {
        50: "#fff3e0",
        100: "#ffe0b2",
        200: "#ffcc80",
        300: "#ffb74d",
        400: "#ffa726",
        500: "#ff9800",
        600: "#fb8c00",
        700: "#f57c00",
        800: "#ef6c00",
        900: "#e65100",
      },
      error: {
        50: "#ffebee",
        100: "#ffcdd2",
        200: "#ef9a9a",
        300: "#e57373",
        400: "#ef5350",
        500: "#f44336",
        600: "#e53935",
        700: "#d32f2f",
        800: "#c62828",
        900: "#b71c1c",
      },
      success: {
        50: "#e3f7e7",
        100: "#bdecc4",
        200: "#8fdf9d",
        300: "#57d374",
        400: "#00c853",
        500: "#00bd2e",
        600: "#00ad24",
        700: "#009b14",
        800: "#008a00",
        900: "#006a00",
      },
    },
  },
};

// 3. extend the theme
const theme = extendTheme(config, withDefaultColorScheme({ colorScheme: themeName }));

export default theme;
