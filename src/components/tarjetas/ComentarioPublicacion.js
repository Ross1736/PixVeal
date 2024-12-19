import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import ComentarioPublicacionCargando from "../cargando/ComentarioPublicacionCargando";
import FetchContext from "../../context/FetchContext";
import { tiempoTranscurrido } from "../../utils/funciones";
import { colorTema } from "../../utils/colors";

const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;

function ComentarioPublicacion({ e }) {
  const { getUsuario } = useContext(FetchContext);

  const [datosUsuario, setDatosUsuario] = useState(null);

  const tiempoComentario = tiempoTranscurrido(e.createdAt);

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      const respuesta = await getUsuario(e.user_id);

      setDatosUsuario(respuesta);
    };

    fetchDatosUsuario();
  }, []);

  if (!datosUsuario) {
    return <ComentarioPublicacionCargando />;
  }

  return (
    <View style={estilo.contenedor}>
      <View style={estilo.foto}>
        <FastImage
          style={estilo.img}
          source={
            datosUsuario.foto_perfil
              ? {
                  uri: `${ENDPOINT}${datosUsuario.foto_perfil}`,
                  priority: FastImage.priority.low,
                  cache: "immutable",
                }
              : require("../../../assets/img/no-user.png")
          }
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>

      <View style={estilo.textos}>
        <View style={estilo.textos_usuario}>
          <Text style={estilo.textos_nombres}>
            {datosUsuario.nombre_usuario}
          </Text>
          <Text style={estilo.textos_fecha}>{tiempoComentario}</Text>
        </View>

        <Text style={estilo.textos_comentario}>{e.comentario}</Text>
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
    gap: 8,
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
  textos: {
    flexShrink: 1,
    flexGrow: 1,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 2,
  },
  textos_usuario: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
  },
  textos_nombres: {
    flexShrink: 1,
    flexGrow: 1,

    fontSize: 12,
    fontFamily: "Fuente-600",
  },
  textos_fecha: {
    fontSize: 10,
    color: colorTema.color_4,
  },
  textos_comentario: { fontSize: 14, fontFamily: "Fuente-300" },
});

export default ComentarioPublicacion;
