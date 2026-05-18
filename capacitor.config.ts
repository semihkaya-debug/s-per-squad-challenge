import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.superlig.fantasy",
  appName: "Süper Lig Fantasy",
  webDir: "dist",
  backgroundColor: "#1a1f2e",
  android: {
    backgroundColor: "#1a1f2e",
    allowMixedContent: false,
  },
  ios: {
    backgroundColor: "#1a1f2e",
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#1a1f2e",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      spinnerColor: "#9bff8a",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1a1f2e",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "native",
      resizeOnFullScreen: true,
      style: "DARK",
    },
  },
};

export default config;
