import React from "react";
import { StyleSheet, View } from "react-native";
import { colorTema } from "../../utils/colors";

function ComentarioPublicacionCargando() {
  return (
    <View style={estilo.contenedor}>
      <View style={estilo.foto} />

      <View style={estilo.textos}>
        <View style={estilo.textos_nombres} />
        <View style={estilo.textos_comentario} />
        <View style={estilo.textos_comentario} />
      </View>
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 15,
  },
  foto: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: colorTema.color_1,
  },
  textos: {
    flexShrink: 1,
    flexGrow: 1,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 6,
  },
  textos_nombres: {
    width: "60%",
    height: 8,
    marginBottom: 2,
    backgroundColor: colorTema.color_1,
    borderRadius: 6,
  },
  textos_comentario: {
    width: "100%",
    height: 8,
    backgroundColor: colorTema.color_1,
    borderRadius: 6,
  },
});

export default ComentarioPublicacionCargando;
