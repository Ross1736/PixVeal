import { StyleSheet, View } from "react-native";
import { colorTema } from "../../utils/colors";

function TarjetaIndexCargando() {
  return (
    <View style={estilo.contenedor}>
      <View style={estilo.tarjeta}>
        <View style={estilo.img} />

        <View style={estilo.textos}>
          <View style={estilo.texto_titulo} />
          <View style={estilo.texto_descripcion} />
          <View style={estilo.texto_descripcion} />
        </View>

        <View style={estilo.botones}>
          <View style={estilo.botones_usuario}>
            <View style={estilo.boton} />
            <View style={estilo.boton} />
            <View style={estilo.boton} />
          </View>

          <View style={estilo.boton}></View>
        </View>
      </View>
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",
    paddingBottom: 15,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 30,
  },
  tarjeta: {
    width: "100%",

    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
  img: {
    width: "100%",
    aspectRatio: 4 / 4,
    borderRadius: 20,
    backgroundColor: colorTema.color_1,
  },
  textos: {
    width: "100%",
    paddingHorizontal: 15,

    gap: 6,
  },
  texto_titulo: {
    height: 10,
    backgroundColor: colorTema.color_1,
    marginBottom: 2,
    borderRadius: 8,
  },
  texto_descripcion: {
    height: 10,
    backgroundColor: colorTema.color_1,
    borderRadius: 8,
  },
  // botones
  botones: {
    width: "100%",
    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  botones_usuario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 15,
  },
  boton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: colorTema.color_1,
  },
});

export default TarjetaIndexCargando;
