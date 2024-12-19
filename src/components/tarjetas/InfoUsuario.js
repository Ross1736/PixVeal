import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { FontAwesome5 } from "../../imports/importsIconos";
import { colors, colorTema } from "../../utils/colors";
import AuthContext from "../../context/AuthContext";
import FetchContext from "../../context/FetchContext";
import { router } from "expo-router";
import InfoUsuarioCargando from "../cargando/InfoUsuarioCargando";
import { cantidadNumeros } from "../../utils/funciones";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;

function InfoUsuario({ user_id }) {
  const { usuarioAuth, getDatosUsuario } = useContext(AuthContext);
  const { seguirUsuario, dejarSeguirUsuario } = useContext(FetchContext);

  const [datosUsuario, setDatosUsuario] = useState(null);
  const [estadoSeguir, setEstadoSeguir] = useState(false);
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [cambios, setCambios] = useState(false);
  const [cantidadSeguidores, setCantidadSeguidores] = useState(0);

  useEffect(() => {
    const fetchDatosUsuario = async () => {
      try {
        const respuesta = await axios.get(
          `${API_URL}/api/v1/usuarios/usuario/${user_id}`
        );

        if (respuesta.data && usuarioAuth) {
          const estado = respuesta.data.seguidores.some(
            (s) => s.seguidor_id === usuarioAuth.user_id
          );

          setEstadoSeguir(estado);
        }

        setDatosUsuario(respuesta.data);
        setCantidadSeguidores(
          cantidadNumeros(respuesta.data.seguidores.length)
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchDatosUsuario();
  }, [user_id, cambios, usuarioAuth]);

  async function seguir() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoBoton(true);

    try {
      const respuesta = await seguirUsuario(datosUsuario.user_id);

      if (respuesta) {
        setCambios(!cambios);
      }

      await getDatosUsuario(usuarioAuth.user_id);
    } catch (error) {
      console.log("ERROR", error.response.data);
    } finally {
      setEstadoBoton(false);
    }
  }

  async function dejarSeguir() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoBoton(true);

    try {
      const respuesta = await dejarSeguirUsuario(datosUsuario.user_id);

      if (respuesta) {
        setCambios(!cambios);
      }

      await getDatosUsuario(usuarioAuth.user_id);
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setEstadoBoton(false);
    }
  }

  if (!datosUsuario) {
    return <InfoUsuarioCargando />;
  }

  return (
    <View style={estilo.contenedor}>
      <View style={estilo.informacion}>
        <View style={estilo.foto}>
          <FastImage
            style={estilo.img}
            source={
              datosUsuario.foto_perfil
                ? {
                    uri: `${ENDPOINT}${datosUsuario.foto_perfil}`,
                    priority: FastImage.priority.normal,
                    cache: "immutable",
                  }
                : require("../../../assets/img/no-user.png")
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        <View style={estilo.textos}>
          <Text style={estilo.texto_nombres}>
            {datosUsuario.nombre_usuario}
          </Text>

          {usuarioAuth && usuarioAuth.user_id === user_id ? (
            <Pressable
              style={estilo.boton_seguir}
              onPress={() => router.push("/usuario/usuario")}
            >
              <Text style={estilo.boton_seguir_texto}>Editar perfil</Text>
            </Pressable>
          ) : estadoSeguir ? (
            <Pressable
              style={estilo.boton_seguir}
              disabled={estadoBoton}
              onPress={dejarSeguir}
            >
              <Text style={estilo.boton_seguir_texto}>Siguiendo</Text>
            </Pressable>
          ) : (
            <Pressable
              style={estilo.boton_seguir}
              disabled={estadoBoton}
              onPress={seguir}
            >
              <Text style={estilo.boton_seguir_texto}>Seguir</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={estilo.seguidores}>
        <FontAwesome5 name="user-check" size={16} color={colorTema.color_9} />

        <Text style={estilo.texto_seguidores}>{cantidadSeguidores}</Text>
      </View>
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
    gap: 10,
  },
  // informacion
  informacion: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
  foto: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: colorTema.color_1,
  },
  // textos
  textos: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 4,
  },
  texto_nombres: {
    fontSize: 12,
    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  // boton seguir
  boton_seguir: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: colorTema.color_9,

    alignItems: "center",
  },
  boton_seguir_texto: {
    fontSize: 10,
    fontFamily: "Fuente-600",
    color: colors.blanco,
  },
  // seguidores
  seguidores: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  texto_seguidores: {
    fontSize: 12,
    fontFamily: "Fuente-400",
    color: colorTema.color_9,
  },
});

export default InfoUsuario;
