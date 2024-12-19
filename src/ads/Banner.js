import { StyleSheet, Text, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.BANNER
  : process.env.EXPO_PUBLIC_ADMOB_BANNER;

function Banner() {
  return (
    <View style={estilo.contenedor}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",
    maxHeight: 65,
  },
});

export default Banner;
