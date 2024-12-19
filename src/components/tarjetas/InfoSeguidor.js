import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FetchContext from "../../context/FetchContext";
import { colorTema } from "../../utils/colors";
import FastImage from "react-native-fast-image";
import InfoSeguidorCargando from "../cargando/InfoSeguidorCargando";

const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;

function InfoSeguidor({ e }) {
  const { getUsuario } = useContext(FetchContext);

  const [datosSeguidor, setDatosSeguidor] = useState(null);

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      const respuesta = await getUsuario(e.seguidor_id);

      setDatosSeguidor(respuesta);
    };

    fetchDatosUsuario();
  }, [e]);

  if (!datosSeguidor) {
    return <InfoSeguidorCargando />;
  }

  return (
    <View style={estilo.contenedor}>
      <View style={estilo.foto}>
        <FastImage
          style={estilo.img}
          source={
            datosSeguidor.foto_perfil
              ? {
                  uri: `${ENDPOINT}${datosSeguidor.foto_perfil}`,
                  priority: FastImage.priority.low,
                  cache: "immutable",
                }
              : require("../../../assets/img/no-user.png")
          }
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      <Text style={estilo.texto_nombre}>{datosSeguidor.nombre_usuario}</Text>
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
  },
  img: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: colorTema.color_1,
  },
  texto_nombre: {
    fontSize: 12,
    fontFamily: "Fuente-300",
    color: colorTema.color_7,
  },
});

export default InfoSeguidor;
