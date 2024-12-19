import { useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AuthContext from "../../src/context/AuthContext";
import InfoSeguidor from "../../src/components/tarjetas/InfoSeguidor";
import { colorTema } from "../../src/utils/colors";
import { FontAwesome5 } from "../../src/imports/importsIconos";
import { cantidadNumeros } from "../../src/utils/funciones";

function Seguidores() {
  const { datosUsuarioLocal } = useContext(AuthContext);

  const [verMas, setVerMas] = useState(12);

  function cargarMas() {
    if (datosUsuarioLocal.seguidores.length >= verMas) {
      return setVerMas(verMas + 24);
    }
  }

  const cantidadSeguidores = cantidadNumeros(
    datosUsuarioLocal.seguidores.length
  );

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
          <Text style={estilo.titulo}>Tus seguidores</Text>

          <View style={estilo.seguidores}>
            <FontAwesome5
              name="user-check"
              size={16}
              color={colorTema.color_9}
            />

            <Text style={estilo.cantidad}>{cantidadSeguidores}</Text>
          </View>
        </View>

        {datosUsuarioLocal.seguidores.length ? (
          <View style={estilo.lista_seguidores}>
            {datosUsuarioLocal.seguidores.slice(0, verMas).map((e, i) => (
              <InfoSeguidor key={i} e={e} />
            ))}
          </View>
        ) : (
          <View style={estilo.no_seguidores}>
            <Text style={estilo.no_seguidores_texto}>No tienes seguidores</Text>
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

export default Seguidores;
