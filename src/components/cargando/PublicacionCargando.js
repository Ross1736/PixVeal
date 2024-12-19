import { StyleSheet, View } from "react-native";
import { colorTema } from "../../utils/colors";

function PublicacionCargando() {
  return (
    <View style={estilo.contenedor}>
      <View style={estilo.foto} />
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 6,
  },
  foto: {
    width: "100%",
    aspectRatio: 4 / 4,
    backgroundColor: colorTema.color_1,
  },
});

export default PublicacionCargando;
