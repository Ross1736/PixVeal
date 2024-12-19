import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colorTema } from "../../src/utils/colors";
import { FontAwesome5 } from "../../src/imports/importsIconos";
import { useContext, useState } from "react";
import AuthContext from "../../src/context/AuthContext";
import InfoSeguido from "../../src/components/tarjetas/InfoSeguido";
import { cantidadNumeros } from "../../src/utils/funciones";

function Seguidos() {
  const { datosUsuarioLocal } = useContext(AuthContext);

  const [verMas, setVerMas] = useState(12);

  function cargarMas() {
    if (datosUsuarioLocal.seguidos.length >= verMas) {
      return setVerMas(verMas + 24);
    }
  }

  const cantidadSeguidos = cantidadNumeros(datosUsuarioLocal.seguidos.length);

  if (!datosUsuarioLocal) {
    return null;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      contentContainerStyle={{
        width: "100%",
        minHeight: "100%",
        paddingBottom: 15,
      }}
      onMomentumScrollEnd={cargarMas}
    >
      <View style={estilo.contenedor}>
        <View style={estilo.textos}>
          <Text style={estilo.titulo}>Tus seguidos</Text>

          <View style={estilo.seguidores}>
            <FontAwesome5
              name="user-check"
              size={16}
              color={colorTema.color_9}
            />

            <Text style={estilo.cantidad}>{cantidadSeguidos}</Text>
          </View>
        </View>

        {datosUsuarioLocal.seguidos.length > 0 ? (
          <View style={estilo.lista_seguidores}>
            {datosUsuarioLocal.seguidos.slice(0, verMas).map((e, i) => (
              <InfoSeguido key={i} e={e} />
            ))}
          </View>
        ) : (
          <View style={estilo.no_seguidores}>
            <Text style={estilo.no_seguidores_texto}>No sigues a nadie</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 20,
  },
  // textos
  textos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titulo: {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: 12,

    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  seguidores: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  cantidad: {
    fontSize: 12,
    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  // seguidores
  lista_seguidores: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 15,
  },
  no_seguidores: {
    paddingHorizontal: 20,
    paddingVertical: 40,

    alignItems: "center",
    justifyContent: "center",
  },
  no_seguidores_texto: {
    fontSize: 12,
    fontFamily: "Fuente-300",
    color: colorTema.color_7,
  },
});

export default Seguidos;
