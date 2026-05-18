// Native (Capacitor) integration — no-ops on web.
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import type { Router } from "@tanstack/react-router";

let initialized = false;

export async function initNative(router: Router<any, any>) {
  if (initialized || !Capacitor.isNativePlatform()) return;
  initialized = true;

  // Status bar — dark theme to match app background
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#1a1f2e" });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch {
    // ignore on platforms without status bar
  }

  // Android hardware back button — navigate within the app
  CapApp.addListener("backButton", ({ canGoBack }) => {
    const path = window.location.pathname;
    // Exit only when on the home route with no history
    if (!canGoBack || path === "/") {
      CapApp.exitApp();
    } else {
      router.history.back();
    }
  });
}
