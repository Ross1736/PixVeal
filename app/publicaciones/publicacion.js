import { useLocalSearchParams, usePathname } from "expo-router/build/hooks";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { colors, colorTema } from "../../src/utils/colors";
import FetchContext from "../../src/context/FetchContext";
import {
  AntDesign,
  FontAwesome,
  Feather,
  MaterialCommunityIcons,
} from "../../src/imports/importsIconos";
import AuthContext from "../../src/context/AuthContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";
import InfoUsuario from "../../src/components/tarjetas/InfoUsuario";
import Cargando from "../../src/components/cargando/Cargando";
import ComentarioPublicacion from "../../src/components/tarjetas/ComentarioPublicacion";
import ComentarPublicacion from "../../src/components/generales/ComentarPublicacion";
import { cantidadNumeros } from "../../src/utils/funciones";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import ImageModal from "react-native-image-modal";
import axios from "axios";

const URL_API = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT;

const { width, height } = Dimensions.get("window");

function Publicacion() {
  const { id } = useLocalSearchParams();

  const { usuarioAuth } = useContext(AuthContext);
  const {
    publicaciones,
    postLike,
    deleteLike,
    getDatosPublicacion,
    datosActualizados,
    setDatosActualizados,
  } = useContext(FetchContext);

  const [datoPublicacion, setDatoPublicacion] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [estadoBotonDescripcion, setEstadoBotonDescripcion] = useState(false);
  const [estadoLike, setEstadoLike] = useState(false);
  const [estadoBoton, setEstadoBoton] = useState(false);
  const [cantidadComentarios, setCantidadComentarios] = useState(4);
  const [estadoCompartir, setEstadoCompartir] = useState(false);
  const [opcionesColorModal, setOpcionesColorModal] = useState(false);
  // contadores
  const [cantidadComentariosTotal, setCantidadComentariosTotal] = useState(0);
  const [cantidadLikes, setCantidadLikes] = useState(0);

  useEffect(() => {
    const fetchDato = async () => {
      try {
        const publicacion = publicaciones.find(
          (p) => p.publicacion_id === Number(id)
        );

        if (!publicacion) {
          throw new Error("Publicación no encontrada");
        }

        setDatoPublicacion(publicacion);
      } catch (error) {
        const respuesta = await axios.get(
          `${URL_API}/api/v1/publicaciones/publicacion/${Number(id)}`
        );

        setDatoPublicacion(respuesta.data);
      }
    };

    fetchDato();
  }, [id]);

  useEffect(() => {
    const fetchDato = async () => {
      try {
        const respuesta = await getDatosPublicacion(id);

        if (respuesta.data) {
          setDatosActualizados(respuesta.data);

          if (respuesta.data.descripcion.length > 140) {
            setDescripcion(
              respuesta.data.descripcion.substring(0, 160) + "..."
            );
            setEstadoBotonDescripcion(true);
          } else {
            setDescripcion(respuesta.data.descripcion);
          }

          setCantidadLikes(cantidadNumeros(respuesta.data.likes.length));
          setCantidadComentariosTotal(
            cantidadNumeros(respuesta.data.comentarios.length)
          );
        }
      } catch (error) {
        console.log(error);

        router.back();
      }
    };

    fetchDato();
  }, [id, publicaciones]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (datosActualizados.likes.length === 0 || !usuarioAuth) {
        setEstadoLike(false);
        return;
      }

      const existe = datosActualizados.likes.some(
        (f) => f.user_id === usuarioAuth.user_id
      );
      setEstadoLike(existe);
    };

    fetchLikes();
  }, [datosActualizados, usuarioAuth]);

  function mostrarDescripcion() {
    setDescripcion(datosActualizados.descripcion);
    setEstadoBotonDescripcion(false);
  }

  async function quitarLike() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoBoton(true);
    setEstadoLike(!estadoLike);

    try {
      await deleteLike(
        datosActualizados.publicacion_id,
        datosActualizados.likes.find((f) => f.user_id === usuarioAuth.user_id)
          .like_id
      );
    } catch (error) {
      console.log(error);
    } finally {
      setEstadoBoton(false);
    }
  }

  async function darLike() {
    if (!usuarioAuth) {
      router.push("/usuario/ingresar");
      return;
    }

    setEstadoBoton(true);
    setEstadoLike(!estadoLike);

    try {
      await postLike(datoPublicacion.publicacion_id);
    } catch (error) {
      console.log(error);
    } finally {
      setEstadoBoton(false);
    }
  }

  // carga foto
  const [dimensionesFoto, setDimensionesFoto] = useState({
    width: 0,
    height: 0,
  });

  function cargaFoto(e) {
    const { width, height } = e.nativeEvent.source;

    setDimensionesFoto({ width, height });
  }

  function verTodosComentarios() {
    setCantidadComentarios(datosActualizados.comentarios.length);
  }

  async function compartir() {
    setEstadoCompartir(true);

    try {
      const fotoUrl = `${ENDPOINT}${datoPublicacion.foto}`;
      const localUri =
        FileSystem.cacheDirectory + datoPublicacion.titulo + ".webp";

      //
      const fotoLocal = await FileSystem.downloadAsync(fotoUrl, localUri);

      await Sharing.shareAsync(fotoLocal.uri, {
        mimeType: "image/webp",
        dialogTitle: "Compartir Foto",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEstadoCompartir(false);
    }
  }

  // animacion
  const opacidad = useSharedValue(0);
  const posicion = useSharedValue(300);

  useEffect(() => {
    if (!dimensionesFoto.width || !dimensionesFoto.height) {
      return;
    }

    opacidad.value = withTiming(1, { duration: 500 }); // 200 con posicion
    posicion.value = withSpring(0, {
      damping: 100, // valores más altos = menos rebote
      stiffness: 200, // valores más bajos = más lento
    });
  }, [dimensionesFoto]);

  const estiloAnimado = useAnimatedStyle(() => {
    return {
      opacity: opacidad.value,
      // transform: [{ translateX: posicion.value }],
    };
  });

  if (!datosActualizados) {
    return <Cargando />;
  }

  return (
    <Animated.View style={[estilo.contenedor, estiloAnimado]}>
      {opcionesColorModal && (
        <StatusBar
          animated={true}
          barStyle="light-content"
          backgroundColor={colorTema.color_10}
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={{
          width: "100%",
          paddingBottom: 15,
        }}
      >
        <View style={estilo.contenido}>
          {dimensionesFoto.height === 0 && (
            <Image
              source={{ uri: `${ENDPOINT}${datoPublicacion.foto}` }}
              onLoad={cargaFoto}
            />
          )}

          <ImageModal
            style={[
              estilo.imagen,
              {
                aspectRatio: dimensionesFoto.width / dimensionesFoto.height,
              },
            ]}
            imageBackgroundColor={colorTema.color_1}
            overlayBackgroundColor={colorTema.color_10}
            resizeMode="contain"
            source={{
              uri: `${ENDPOINT}${datoPublicacion.foto}`,
              cache: "force-cache",
            }}
            onOpen={() => setOpcionesColorModal(!opcionesColorModal)}
            onClose={() => setOpcionesColorModal(!opcionesColorModal)}
          />

          <InfoUsuario user_id={datoPublicacion.user_id} />

          <View style={estilo.textos}>
            <Text style={estilo.textos_titulo}>{datoPublicacion.titulo}</Text>
            <Text style={estilo.textos_descripcion}>
              {descripcion}
              {estadoBotonDescripcion && (
                <Text
                  onPress={mostrarDescripcion}
                  style={estilo.boton_mostrar_mas}
                >
                  {" "}
                  Mostrar Más
                </Text>
              )}
            </Text>
          </View>

          <View style={estilo.botones}>
            <View style={estilo.botones_usuario}>
              {estadoLike ? (
                <Pressable
                  style={estilo.botones_boton}
                  disabled={estadoBoton}
                  onPress={quitarLike}
                >
                  <AntDesign
                    name="heart"
                    size={24}
                    color={colors.color_rojo}
                    style={{ width: 24 }}
                  />

                  <Text style={estilo.botones_boton_texto}>
                    {cantidadLikes}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={estilo.botones_boton}
                  disabled={estadoBoton}
                  onPress={darLike}
                >
                  <AntDesign
                    name="hearto"
                    size={24}
                    color={colorTema.color_9}
                    style={{ width: 24 }}
                  />

                  <Text style={estilo.botones_boton_texto}>
                    {cantidadLikes}
                  </Text>
                </Pressable>
              )}

              <Pressable style={estilo.botones_boton}>
                <MaterialCommunityIcons
                  name="comment-processing-outline"
                  size={24}
                  color={colorTema.color_9}
                  style={{ width: 24 }}
                />
                <Text style={estilo.botones_boton_texto}>
                  {cantidadComentariosTotal}
                </Text>
              </Pressable>

              {/* <Pressable style={estilo.botones_boton}>
                <Feather
                  name="send"
                  size={22}
                  color={colorTema.color_9}
                  style={{ width: 22 }}
                />
              </Pressable> */}
            </View>

            <Pressable
              style={estilo.botones_boton}
              onPress={compartir}
              disabled={estadoCompartir}
            >
              <AntDesign
                name="sharealt"
                size={24}
                style={{ width: 24 }}
                color={colorTema.color_9}
              />
            </Pressable>
          </View>

          <View style={estilo.comentarios}>
            <Text style={estilo.comentarios_titulo}>Comentarios</Text>

            {datosActualizados.comentarios.length > 0 ? (
              <View style={estilo.comentarios_flex}>
                {datosActualizados.comentarios
                  .sort((a, b) => b.comentario_id - a.comentario_id)
                  .slice(0, cantidadComentarios)
                  .map((e) => (
                    <ComentarioPublicacion key={e.comentario_id} e={e} />
                  ))}

                {cantidadComentarios < datosActualizados.comentarios.length && (
                  <Pressable
                    onPress={verTodosComentarios}
                    style={estilo.boton_ver_mas}
                  >
                    <Text style={estilo.boton_ver_mas_texto}>
                      Ver todos los comentarios
                    </Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={estilo.no_comentarios}>
                <Text style={estilo.no_comentarios_texto}>
                  No hay comentarios
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ComentarPublicacion publicacion_id={datosActualizados.publicacion_id} />
    </Animated.View>
  );
}

const estilo = StyleSheet.create({
  contenedor: {
    flex: 1,

    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  contenido: {
    gap: 10,
  },
  imagen: {
    width: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
    backgroundColor: colorTema.color_9,
  },
  // textos
  textos: {
    paddingHorizontal: 15,

    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 2,
  },
  textos_titulo: {
    fontSize: 14,
    fontFamily: "Fuente-600",
  },
  textos_descripcion: {
    fontSize: 14,
    fontFamily: "Fuente-300",
  },
  // boton mostrar mas
  boton_mostrar_mas: {
    fontSize: 12,
    fontFamily: "Fuente-600",
    color: colorTema.color_9,
  },
  // botones
  botones: {
    width: "100%",
    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
  },
  botones_usuario: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 15,
  },
  botones_boton: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: colors.blanco,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  botones_boton_texto: {
    fontSize: 12,
    color: colorTema.color_7,
    fontFamily: "Fuente-400",
  },
  // comentarios
  comentarios: {
    width: "100%",
    paddingHorizontal: 15,

    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 15,
  },
  comentarios_titulo: {
    fontSize: 14,
    fontFamily: "Fuente-600",
  },
  comentarios_flex: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 20,
  },
  boton_ver_mas: {
    width: "100%",
  },
  boton_ver_mas_texto: {
    fontSize: 12,
    fontFamily: "Fuente-600",
    color: colorTema.color_9,
    textAlign: "center",
  },
  no_comentarios: {
    width: "100%",
    padding: 15,
  },
  no_comentarios_texto: {
    fontSize: 14,
    fontFamily: "Fuente-300",
    color: colorTema.color_9,
    textAlign: "center",
  },
});

export default Publicacion;
