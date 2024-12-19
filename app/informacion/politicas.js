import { ScrollView, StyleSheet, Text, View } from "react-native";
import listaPoliticas from "../../src/json/politicasPrivacidad.json";
import { colorTema } from "../../src/utils/colors";

function Politicas() {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <View style={estilo.contenido}>
          <Text style={estilo.titulo}>{listaPoliticas.titulo}</Text>

          <Text style={estilo.descripcion}>{listaPoliticas.presentacion}</Text>

          {listaPoliticas.politicas.map((politica, index) => (
            <View key={index} style={estilo.politica}>
              <Text style={estilo.politica_texto_nombre}>
                {politica.nombre}
              </Text>
              <Text style={estilo.politica_texto_descripcion}>
                {politica.descripcion}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const estilo = StyleSheet.create({
  contenido: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,

    alignItems: "flex-start",
    justifyContent: "center",
    gap: 10,
  },
  titulo: {
    fontSize: 16,
    color: colorTema.color_9,
    fontFamily: "Fuente-600",
  },
  descripcion: {
    fontSize: 14,
    lineHeight: 20,
    color: colorTema.color_7,
    fontFamily: "Fuente-300",
  },
  // politica
  politica: {
    width: "100%",
    marginTop: 15,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 4,
  },
  politica_texto_nombre: {
    fontSize: 14,
    color: colorTema.color_9,
    fontFamily: "Fuente-500",
  },
  politica_texto_descripcion: {
    fontSize: 14,
    color: colorTema.color_7,
    fontFamily: "Fuente-300",
  },
});

export default Politicas;
