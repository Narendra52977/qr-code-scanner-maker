import {
    AdEventType,
    InterstitialAd,
    RewardedAd,
    RewardedAdEventType,
} from "react-native-google-mobile-ads";

export type AdType = "rewarded" | "interstitial";

export interface AdCallback {
  onRewardEarned?: () => void;
  onAdClosed?: () => void;
  onAdFailed?: () => void;
}

class AdManager {
  private rewardedAd: any = null;
  private interstitialAd: any = null;
  private isRewardedLoaded: boolean = false;
  private isInterstitialLoaded: boolean = false;
  private callback: AdCallback = {};

  constructor(rewardedUnitId: string, interstitialUnitId: string) {
    this.initializeRewardedAd(rewardedUnitId);
    this.initializeInterstitialAd(interstitialUnitId);
  }

  private initializeRewardedAd(adUnitId: string) {
    this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isRewardedLoaded = true;
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
      this.callback.onRewardEarned?.();
      this.isRewardedLoaded = false;
      this.loadRewardedAd();
    });

    this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isRewardedLoaded = false;
      this.loadRewardedAd();
    });

    this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
      this.callback.onAdFailed?.();
      this.isRewardedLoaded = false;
    });

    this.loadRewardedAd();
  }

  private initializeInterstitialAd(adUnitId: string) {
    this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      this.isInterstitialLoaded = true;
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.isInterstitialLoaded = false;
      this.callback.onAdClosed?.();
      this.loadInterstitialAd();
    });

    this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error: any) => {
      this.callback.onAdFailed?.();
      this.isInterstitialLoaded = false;
    });

    this.loadInterstitialAd();
  }

  loadRewardedAd() {
    this.rewardedAd?.load();
  }

  loadInterstitialAd() {
    this.interstitialAd?.load();
  }

  showAd(type: AdType) {
    if (type === "rewarded") {
      if (this.isRewardedLoaded && this.rewardedAd) {
        this.rewardedAd.show();
        return true;
      }
    } else if (type === "interstitial") {
      if (this.isInterstitialLoaded && this.interstitialAd) {
        this.interstitialAd.show();
        return true;
      }
    }
    return false;
  }

  setCallback(callback: AdCallback) {
    this.callback = callback;
  }
}

export default AdManager;
