// // Get these from your AdMob account: https://admob.google.com
// export const AD_UNIT_IDS = {
//   // Banner Ads
//   BANNER_ANDROID: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy",
//   BANNER_IOS: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy",

//   // Interstitial Ads
//   INTERSTITIAL_ANDROID: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy",
//   INTERSTITIAL_IOS: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy",

//   // Rewarded Ads
//   REWARDED_ANDROID: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy",
//   REWARDED_IOS: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy",
// };

// // Get your App ID from AdMob account
// export const ADMOB_APP_ID = "ca-app-pub-xxxxxxxxxxxxxxxx~nnnnnnnnnn";


import { Platform } from "react-native";

export const Admob = {
  banner: Platform.select({
    android: "ca-app-pub-3627128998964363/9162781940", // TEST Banner
    ios: "ca-app-pub-3627128998964363/4401926779",
    default: "ca-app-pub-3627128998964363/9162781940",
  }),

  interstitial: Platform.select({
    android: "ca-app-pub-3627128998964363/3232315333", // TEST Interstitial
    ios: "ca-app-pub-3627128998964363/1967335126",
    default: "ca-app-pub-3627128998964363/3232315333",
  }),

  rewarded: Platform.select({
    android: "ca-app-pub-3627128998964363/2431930052", // TEST Rewarded
    ios: "ca-app-pub-3627128998964363/9983117010",
    default: "ca-app-pub-3627128998964363/2431930052",
  }),
};
