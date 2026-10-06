import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#f0eeff",
    100: "#dbd7ff",
    200: "#bbb3ff",
    300: "#9586ff",
    400: "#7065f0", // Programming Hero Signature Indigo-Violet
    500: "#5b4de6",
    600: "#4839cc",
    700: "#3628b0",
    800: "#261b8f",
    900: "#180f6e",
  },
  cyan: {
    50: "#e0fcff",
    100: "#b8f7ff",
    200: "#80efff",
    300: "#40e4ff",
    400: "#00f2fe", // Hyper Neon Cyan
    500: "#00cce6",
    600: "#009eb3",
    700: "#007385",
    800: "#004d59",
    900: "#002b33",
  },
  coral: {
    400: "#ff5376",
    500: "#ff3366",
    600: "#e61a4d",
  },
  amber: {
    400: "#ffd369",
    500: "#feca57",
    600: "#e5a73b",
  },
};

const fonts = {
  heading: "'Outfit', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const styles = {
  global: {
    body: {
      bg: "#080B14",
      color: "#F1F5F9",
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      letterSpacing: "-0.01em",
    },
    "::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
    },
    "::-webkit-scrollbar-track": {
      background: "rgba(10, 13, 24, 0.6)",
    },
    "::-webkit-scrollbar-thumb": {
      background: "rgba(112, 101, 240, 0.35)",
      borderRadius: "999px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "rgba(0, 242, 254, 0.6)",
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "700",
      borderRadius: "14px",
      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: "rgba(14, 18, 36, 0.96)",
        backdropFilter: "blur(25px) saturate(1.9)",
        border: "1px solid rgba(112, 101, 240, 0.25)",
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: "xl",
      },
    },
  },
  Tooltip: {
    baseStyle: {
      bg: "rgba(14, 18, 36, 0.95)",
      color: "gray.100",
      borderRadius: "lg",
      border: "1px solid rgba(112, 101, 240, 0.25)",
      px: 3,
      py: 1.5,
      fontSize: "xs",
      fontWeight: "600",
      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    },
  },
};

const theme = extendTheme({ config, colors, fonts, styles, components });

export default theme;
