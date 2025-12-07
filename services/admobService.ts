import { MobileAds } from "react-native-google-mobile-ads";

export const initializeMobileAds = async (): Promise<void> => {
  try {
    await MobileAds().initialize();
    console.log("Mobile Ads initialized");
  } catch (error) {
    console.error("Failed to initialize Mobile Ads:", error);
  }
};

