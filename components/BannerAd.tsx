import { Admob } from "@/constants/ads";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

interface BannerAdComponentProps {
  style?: any;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({ style }) => {
  return (
    <View style={[styles.adContainer, style]}>
      <BannerAd
        unitId={Admob.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => console.log("Banner ad loaded")}
        onAdFailedToLoad={error => console.error("Banner ad error:", error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BannerAdComponent;
