import React from "react";
import { StyleSheet, View } from "react-native";
import { colorTema } from "../../utils/colors";

function InfoSeguidorCargando() {
  return (
    <View style={estilo.contenedor}>
      <View style={estilo.foto} />
      <View style={estilo.texto_nombre} />
    </View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  foto: {
    width: 40,
    height: 40,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: colorTema.color_1,
  },
  texto_nombre: {
    width: "50%",
    height: 10,
    backgroundColor: colorTema.color_1,
    borderRadius: 6,
  },
});

export default InfoSeguidorCargando;
