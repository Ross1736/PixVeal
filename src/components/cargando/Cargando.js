import { ActivityIndicator, View } from "react-native";
import { colors } from "../../utils/colors";

function Cargando() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.blanco,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={colors.color_primario} />
    </View>
  );
}

export default Cargando;
