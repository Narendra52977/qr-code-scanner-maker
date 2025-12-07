import { Admob } from "@/constants/ads";
import AdManager, { AdCallback } from "@/services/Admanager";
import { useCallback, useEffect, useRef } from "react";

export const useAdManager = (callback: AdCallback) => {
  const adManagerRef = useRef<AdManager | null>(null);

  useEffect(() => {
    if (!adManagerRef.current) {
      adManagerRef.current = new AdManager(Admob.rewarded, Admob.interstitial);
    }
    adManagerRef.current.setCallback(callback);
  }, [callback]);

  const showRewardedAd = useCallback(() => {
    return adManagerRef.current?.showAd("rewarded") ?? false;
  }, []);

  const showInterstitialAd = useCallback(() => {
    return adManagerRef.current?.showAd("interstitial") ?? false;
  }, []);

  return { showRewardedAd, showInterstitialAd };
};