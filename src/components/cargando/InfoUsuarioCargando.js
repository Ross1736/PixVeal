import { StyleSheet, View } from "react-native";
import { colorTema } from "../../utils/colors";

function InfoUsuarioCargando() {
  return (
    <View style={estilo.contenedor}>
      <View style={estilo.user}>
        <View style={estilo.user_imagen} />

        <View style={estilo.user_info}>
          <View style={estilo.user_info_texto} />
          <View style={estilo.user_info_boton} />
        </View>
      </View>

      <View style={estilo.seguidores} />
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  user_imagen: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colorTema.color_1,
  },
  user_info: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  user_info_texto: {
    width: 60,
    height: 10,

    backgroundColor: colorTema.color_1,
    borderRadius: 4,
  },
  user_info_boton: {
    width: 60,
    height: 10,

    backgroundColor: colorTema.color_1,
    borderRadius: 4,
  },
  seguidores: {
    width: 35,
    height: 25,
    backgroundColor: colorTema.color_1,
    borderRadius: 2,
  },
});

export default InfoUsuarioCargando;
